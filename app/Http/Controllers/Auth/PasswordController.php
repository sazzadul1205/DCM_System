<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\UserPasswordHistory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => [
                'required',
                Password::defaults(),
                'confirmed',
                new \App\Rules\PasswordHistory($request->user()->id, 5) // Prevent last 5 passwords
            ],
        ]);

        $user = $request->user();

        try {
            DB::beginTransaction();

            // Store old password in history before updating
            UserPasswordHistory::create([
                'user_id' => $user->id,
                'password_hash' => $user->password, // Store the current password hash
                'changed_at' => now(),
                'created_by' => $user->id,
            ]);

            // Update user's password
            $user->update([
                'password' => Hash::make($validated['password']),
            ]);

            DB::commit();

            // Log the password change
            Log::info('Password changed successfully', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'changed_at' => now()
            ]);

            return back()->with('success', 'Password updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Password change failed', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'error' => $e->getMessage()
            ]);

            return back()->withErrors(['error' => 'Failed to update password. Please try again.']);
        }
    }

    /**
     * Check if password has been used before (optional helper method)
     */
    public function isPasswordUsedBefore($userId, $newPassword, $historyLimit = 5): bool
    {
        $recentPasswords = UserPasswordHistory::where('user_id', $userId)
            ->orderBy('changed_at', 'desc')
            ->limit($historyLimit)
            ->get();

        foreach ($recentPasswords as $oldPassword) {
            if (Hash::check($newPassword, $oldPassword->password_hash)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get password history for a user (optional)
     */
    public function getPasswordHistory($userId, $limit = 10)
    {
        return UserPasswordHistory::where('user_id', $userId)
            ->orderBy('changed_at', 'desc')
            ->limit($limit)
            ->get();
    }
}
