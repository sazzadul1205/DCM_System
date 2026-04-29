<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
  /**
   * Show the profile completion page
   * Redirect if profile is already completed
   */
  public function completeProfile(): Response|\Illuminate\Http\RedirectResponse
  {
    /** @var User $user */
    $user = Auth::user();

    // If profile is already completed, redirect to profile show page
    if ($user->isProfileCompleted()) {
      return redirect()->route('profile.show')
        ->with('info', 'Your profile is already completed!');
    }

    return Inertia::render('Backend/Users/CompleteProfile', [
      'user' => $user
    ]);
  }

  /**
   * Store completed profile data
   */
  public function storeCompletedProfile(Request $request)
  {
    /** @var User $user */
    $user = User::query()->findOrFail(Auth::id());

    // Prevent re-completion if already completed
    if ($user->isProfileCompleted()) {
      return redirect()->route('profile.show')
        ->with('error', 'Profile already completed!');
    }

    // Normalize input BEFORE validation
    $request->merge([
      'email' => strtolower(trim($request->email)),
      'phone_primary' => preg_replace('/[^0-9]/', '', $request->phone_primary),
      'phone_secondary' => $request->phone_secondary
        ? preg_replace('/[^0-9]/', '', $request->phone_secondary)
        : null,
    ]);

    // Validation
    $validated = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => [
        'required',
        'string',
        'email',
        'max:255',
        'unique:users,email,' . $user->id,
      ],
      'phone_primary' => [
        'required',
        'string',
        'max:20',
        'unique:users,phone_primary,' . $user->id,
      ],
      'phone_secondary' => ['nullable', 'string', 'max:20'],
      'blood_group' => ['nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
      'date_of_birth' => ['nullable', 'date'],
      'gender' => ['nullable', 'in:male,female,other'],
      'address_division' => ['nullable', 'string', 'max:100'],
      'address_district' => ['nullable', 'string', 'max:100'],
      'address_police_station' => ['nullable', 'string', 'max:100'],
      'address_postal_code' => ['nullable', 'string', 'max:20'],
      'address_details' => ['nullable', 'string'],
      'emergency_contact_name' => ['nullable', 'string', 'max:255'],
      'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
      'emergency_contact_relation' => ['nullable', 'string', 'max:100'],
    ]);

    try {
      DB::beginTransaction();

      // Update ALL relevant fields including new profile fields
      $user->update([
        'name' => $validated['name'],
        'email' => $validated['email'],
        'phone_primary' => $validated['phone_primary'],
        'phone_secondary' => $validated['phone_secondary'] ?? null,
        'blood_group' => $validated['blood_group'] ?? null,
        'date_of_birth' => $validated['date_of_birth'] ?? null,
        'gender' => $validated['gender'] ?? null,
        'address_division' => $validated['address_division'] ?? null,
        'address_district' => $validated['address_district'] ?? null,
        'address_police_station' => $validated['address_police_station'] ?? null,
        'address_postal_code' => $validated['address_postal_code'] ?? null,
        'address_details' => $validated['address_details'] ?? null,
        'emergency_contact_name' => $validated['emergency_contact_name'] ?? null,
        'emergency_contact_phone' => $validated['emergency_contact_phone'] ?? null,
        'emergency_contact_relation' => $validated['emergency_contact_relation'] ?? null,
      ]);

      // Mark profile as completed
      $user->markProfileAsCompleted();

      DB::commit();

      return redirect()
        ->route('profile.show')
        ->with('success', 'Profile completed successfully!');
    } catch (\Throwable $e) {
      DB::rollBack();

      Log::error('Profile completion failed', [
        'user_id' => $user->id,
        'error' => $e->getMessage(),
      ]);

      throw ValidationException::withMessages([
        'general' => 'Failed to complete profile. Please try again or contact support.',
      ]);
    }
  }

  /**
   * Show the user profile
   */
  public function show(): Response|\Illuminate\Http\RedirectResponse
  {
    /** @var User $user */
    $user = User::query()->with('role')->findOrFail(Auth::id());

    return Inertia::render('Backend/Users/Show', [
      'user' => $user,
      'isOwnProfile' => true,
      'canEdit' => true,
    ]);
  }

  /**
   * Show the profile edit page
   */
  public function edit(): Response
  {
    /** @var User $user */
    $user = Auth::user();

    return Inertia::render('Backend/Users/Edit', [
      'user' => $user
    ]);
  }

  /**
   * Update user profile
   */
  public function update(Request $request)
  {
    /** @var User $user */
    $user = Auth::user();

    // Normalize input
    $request->merge([
      'email' => strtolower(trim($request->email)),
      'phone_primary' => preg_replace('/[^0-9]/', '', $request->phone_primary),
      'phone_secondary' => $request->phone_secondary
        ? preg_replace('/[^0-9]/', '', $request->phone_secondary)
        : null,
    ]);

    $validated = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'email' => [
        'required',
        'string',
        'email',
        'max:255',
        'unique:users,email,' . $user->id,
      ],
      'phone_primary' => [
        'required',
        'string',
        'max:20',
        'unique:users,phone_primary,' . $user->id,
      ],
      'phone_secondary' => ['nullable', 'string', 'max:20'],
      'blood_group' => ['nullable', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
      'date_of_birth' => ['nullable', 'date'],
      'gender' => ['nullable', 'in:male,female,other'],
      'address_division' => ['nullable', 'string', 'max:100'],
      'address_district' => ['nullable', 'string', 'max:100'],
      'address_police_station' => ['nullable', 'string', 'max:100'],
      'address_postal_code' => ['nullable', 'string', 'max:20'],
      'address_details' => ['nullable', 'string'],
      'emergency_contact_name' => ['nullable', 'string', 'max:255'],
      'emergency_contact_phone' => ['nullable', 'string', 'max:20'],
      'emergency_contact_relation' => ['nullable', 'string', 'max:100'],
    ]);

    try {
      DB::beginTransaction();

      $user->update($validated);

      DB::commit();

      return redirect()
        ->route('profile.show')
        ->with('success', 'Profile updated successfully!');
    } catch (\Throwable $e) {
      DB::rollBack();

      Log::error('Profile update failed', [
        'user_id' => $user->id,
        'error' => $e->getMessage(),
      ]);

      throw ValidationException::withMessages([
        'general' => 'Failed to update profile. Please try again.',
      ]);
    }
  }

  /**
   * Delete user account (soft delete)
   */
  public function destroy(Request $request)
  {
    /** @var User $user */
    $user = Auth::user();

    $request->validate([
      'password' => ['required', 'string'],
    ]);

    // Verify password
    if (!Hash::check($request->password, $user->password)) {
      throw ValidationException::withMessages([
        'password' => 'The provided password is incorrect.',
      ]);
    }

    try {
      DB::beginTransaction();

      // Soft delete the user
      $user->delete();

      // Log out the user
      Auth::logout();

      // Invalidate session
      $request->session()->invalidate();
      $request->session()->regenerateToken();

      DB::commit();

      return redirect('/')->with('success', 'Your account has been deleted successfully.');
    } catch (\Throwable $e) {
      DB::rollBack();

      Log::error('Account deletion failed', [
        'user_id' => $user->id,
        'user_email' => $user->email,
        'error' => $e->getMessage()
      ]);

      throw ValidationException::withMessages([
        'general' => 'Failed to delete account. Please try again later.',
      ]);
    }
  }
}
