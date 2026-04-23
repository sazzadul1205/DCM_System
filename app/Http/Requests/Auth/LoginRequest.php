<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use App\Models\UserPasswordHistory;
use Carbon\Carbon;
use Illuminate\Auth\Events\Lockout;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'login' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    /**
     * Get custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'login.required' => 'Email or phone number is required.',
            'password.required' => 'Password is required.',
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        $this->ensureIsNotRateLimited();

        $loginInput = $this->input('login');
        $password = $this->input('password');

        // Detect login type
        $field = filter_var($loginInput, FILTER_VALIDATE_EMAIL)
            ? 'email'
            : 'phone_primary';

        // Normalize phone number (remove all non-numeric characters)
        if ($field === 'phone_primary') {
            $loginInput = preg_replace('/[^0-9]/', '', $loginInput);

            // Remove leading 0 or 880 if present
            if (str_starts_with($loginInput, '0')) {
                $loginInput = substr($loginInput, 1);
            }
            if (str_starts_with($loginInput, '880')) {
                $loginInput = substr($loginInput, 3);
            }
        }

        // Find user
        $user = User::where($field, $loginInput)->first();

        // Check if user exists
        if (!$user) {
            RateLimiter::hit($this->throttleKey(), 120);

            throw ValidationException::withMessages([
                'login' => 'No account found with this email or phone number.',
            ]);
        }

        // Check old password (password history)
        $oldPassword = UserPasswordHistory::where('user_id', $user->id)
            ->orderByDesc('changed_at')
            ->first();

        if ($oldPassword && Hash::check($password, $oldPassword->password_hash)) {
            $changedAt = Carbon::parse($oldPassword->changed_at);
            $diff = $changedAt->diffForHumans();

            throw ValidationException::withMessages([
                'login' => "This password was changed {$diff}. Please use your current password. If this wasn't you, contact support.",
            ]);
        }

        // Attempt login
        if (!Auth::attempt(
            [$field => $loginInput, 'password' => $password],
            $this->boolean('remember')
        )) {
            RateLimiter::hit($this->throttleKey(), 120);

            throw ValidationException::withMessages([
                'login' => 'The provided credentials do not match our records.',
            ]);
        }

        // Check if user is active
        $user = Auth::user();
        if ($user->status !== 'active') {
            Auth::logout();

            throw ValidationException::withMessages([
                'login' => 'Your account is ' . $user->status . '. Please contact support.',
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'login' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('login')) . '|' . $this->ip());
    }
}
