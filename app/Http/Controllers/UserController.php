<?php

namespace App\Http\Controllers;

// Models
use App\Models\Role;
use App\Models\User;
use App\Models\UserPasswordHistory;

// Http
use Illuminate\Http\Request;

// Facades
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

// Validation
use Illuminate\Validation\ValidationException;

// Inertia
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a listing of active users with advanced filtering.
     */
    public function index(Request $request): Response
    {
        $query = User::query()->with('role');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_primary', 'like', "%{$search}%")
                    ->orWhere('uid', 'like', "%{$search}%")
                    ->orWhere('address_division', 'like', "%{$search}%")
                    ->orWhere('address_district', 'like', "%{$search}%")
                    ->orWhere('address_police_station', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        // Apply role filter
        if ($request->filled('role_id')) {
            $query->where('role_id', $request->role_id);
        }

        // Apply blood group filter
        if ($request->filled('blood_group')) {
            $query->where('blood_group', $request->blood_group);
        }

        // Apply gender filter
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        // Apply date range filters
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Apply sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        // Validate sort field to prevent SQL injection
        $allowedSortFields = ['uid', 'name', 'email', 'status', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        // Paginate results
        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage)->withQueryString();

        // Get all active roles for dropdown
        $roles = Role::where('status', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        // Return filters for persistence
        $filters = $request->only([
            'search',
            'per_page',
            'sort_field',
            'sort_direction',
            'status',
            'role_id',
            'blood_group',
            'gender',
            'date_from',
            'date_to'
        ]);

        return Inertia::render('Backend/Users/Index', [
            'users' => $users,
            'filters' => $filters,
            'roles' => $roles,
        ]);
    }

    /**
     * Store a newly created user.
     */
    public function store(Request $request)
    {
        // Normalize input - Keep the + sign for phone numbers
        $request->merge([
            'email' => strtolower(trim($request->email)),
            'phone_primary' => $this->normalizePhoneNumber($request->phone_primary),
        ]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'phone_primary' => ['required', 'string', 'max:20', 'regex:/^\+[1-9][0-9]{7,14}$/', 'unique:users'],
            'role_id' => ['required', 'exists:roles,id'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {
            DB::beginTransaction();

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_primary' => $validated['phone_primary'],
                'role_id' => $validated['role_id'],
                'password' => Hash::make($validated['password']),
                'created_by' => Auth::id(),
                'profile_completed' => true,
                'profile_completed_at' => now(),
                'status' => 1,
            ]);

            DB::commit();

            return redirect()->route('users.index')
                ->with('success', 'User created successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('User creation failed', [
                'error' => $e->getMessage(),
                'created_by' => Auth::id(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to create user. Please try again.',
            ]);
        }
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        // Normalize input - Keep the + sign for phone numbers
        $request->merge([
            'email' => strtolower(trim($request->email)),
            'phone_primary' => $this->normalizePhoneNumber($request->phone_primary),
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
                'regex:/^\+[1-9][0-9]{7,14}$/',
                'unique:users,phone_primary,' . $user->id,
            ],
            'role_id' => ['required', 'exists:roles,id'],
        ]);

        // Handle password update if provided
        if ($request->filled('password')) {
            $request->validate([
                'password' => ['required', 'string', 'min:8', 'confirmed'],
            ]);
        }

        try {
            DB::beginTransaction();

            $updateData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone_primary' => $validated['phone_primary'],
                'role_id' => $validated['role_id'],
                'updated_by' => Auth::id(),
            ];

            if ($request->filled('password')) {
                $updateData['password'] = Hash::make($request->password);

                // Log password change in history (if table exists)
                if (class_exists('UserPasswordHistory')) {
                    UserPasswordHistory::create([
                        'user_id' => $user->id,
                        'password_hash' => $updateData['password'],
                        'changed_at' => now(),
                        'created_by' => Auth::id(),
                    ]);

                    // Keep only last 3 password records
                    if (method_exists('UserPasswordHistory', 'cleanupOldHistory')) {
                        UserPasswordHistory::cleanupOldHistory($user->id, 3);
                    }
                }
            }

            $user->update($updateData);

            DB::commit();

            return redirect()->route('users.index')
                ->with('success', 'User updated successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('User update failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'updated_by' => Auth::id(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to update user. Please try again.',
            ]);
        }
    }

    /**
     * Display user details.
     */
    public function show(User $user): Response
    {
        $user->load(['role', 'createdBy', 'updatedBy']);

        // Get the authenticated user
        $authUser = Auth::user();

        // Check if current user can edit this profile
        $canEdit = false;

        // Check if user has admin role (adjust role name/id as needed)
        if ($authUser->role && ($authUser->role->slug === 'admin' || $authUser->role_id === 1)) {
            $canEdit = true;
        }

        // Or if it's their own profile
        if ($authUser->id === $user->id) {
            $canEdit = true;
        }

        return Inertia::render('Backend/Users/Show', [
            'user' => $user,
            'isOwnProfile' => Auth::id() === $user->id,
            'canEdit' => $canEdit,
            'backUrl' => route('users.index'),
        ]);
    }

    /**
     * Update user status (active/inactive).
     */
    public function updateStatus(Request $request, User $user)
    {
        $validated = $request->validate([
            'status' => ['required', 'boolean'],
        ]);

        try {
            $user->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
            ]);

            $statusText = $validated['status'] ? 'activated' : 'deactivated';

            return redirect()->route('users.index')
                ->with('success', "User {$statusText} successfully!");
        } catch (\Throwable $e) {
            Log::error('User status update failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to update user status.',
            ]);
        }
    }

    /**
     * Soft delete the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent self-deletion
        if ($user->id === Auth::id()) {
            throw ValidationException::withMessages([
                'general' => 'You cannot delete your own account from here. Use profile settings instead.',
            ]);
        }

        try {
            DB::beginTransaction();

            $user->delete(); // Soft delete

            DB::commit();

            return redirect()->route('users.index')
                ->with('success', 'User moved to archive successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('User soft delete failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'deleted_by' => Auth::id(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to archive user. Please try again.',
            ]);
        }
    }

    /**
     * Display archived (soft deleted) users with advanced filtering.
     */
    public function archived(Request $request): Response
    {
        $query = User::onlyTrashed()->with('role');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_primary', 'like', "%{$search}%")
                    ->orWhere('uid', 'like', "%{$search}%");
            });
        }

        // Apply sorting for archived users
        $sortField = $request->get('sort_field', 'deleted_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        $allowedSortFields = ['uid', 'name', 'email', 'deleted_at', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        } else {
            $query->orderBy('deleted_at', 'desc');
        }

        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage)->withQueryString();

        $roles = Role::where('status', true)
            ->select('id', 'name')
            ->orderBy('name')
            ->get();

        return Inertia::render('Backend/Users/Archived', [
            'users' => $users,
            'filters' => $request->only(['search', 'per_page', 'sort_field', 'sort_direction']),
            'roles' => $roles,
        ]);
    }

    /**
     * Restore a soft deleted user.
     */
    public function restore(int $id)
    {
        try {
            DB::beginTransaction();

            $user = User::onlyTrashed()->findOrFail($id);
            $user->restore();
            $user->update(['updated_by' => Auth::id()]);

            DB::commit();

            return redirect()->route('users.archived')
                ->with('success', 'User restored successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('User restore failed', [
                'user_id' => $id,
                'error' => $e->getMessage(),
                'restored_by' => Auth::id(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to restore user. Please try again.',
            ]);
        }
    }

    /**
     * Permanently delete a soft deleted user.
     */
    public function forceDelete(int $id)
    {
        try {
            DB::beginTransaction();

            $user = User::onlyTrashed()->findOrFail($id);

            // Log before permanent deletion
            Log::info('User force deleted', [
                'user_id' => $user->id,
                'user_email' => $user->email,
                'deleted_by' => Auth::id(),
            ]);

            $user->forceDelete();

            DB::commit();

            return redirect()->route('users.archived')
                ->with('success', 'User permanently deleted!');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('User force delete failed', [
                'user_id' => $id,
                'error' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to permanently delete user. Please try again.',
            ]);
        }
    }

    /**
     * Bulk delete (soft delete) users.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:users,id'],
        ]);

        // Prevent self-deletion
        $ids = array_filter($validated['ids'], function ($id) {
            return $id !== Auth::id();
        });

        if (empty($ids)) {
            throw ValidationException::withMessages([
                'general' => 'You cannot delete your own account.',
            ]);
        }

        try {
            DB::beginTransaction();

            User::whereIn('id', $ids)->delete();

            DB::commit();

            return redirect()->route('users.index')
                ->with('success', count($ids) . ' user(s) archived successfully!');
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Bulk user delete failed', [
                'ids' => $ids,
                'error' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to archive users.',
            ]);
        }
    }

    /**
     * Bulk update user status.
     */
    public function bulkStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => ['required', 'array'],
            'ids.*' => ['exists:users,id'],
            'status' => ['required', 'boolean'],
        ]);

        try {
            DB::beginTransaction();

            User::whereIn('id', $validated['ids'])->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
            ]);

            DB::commit();

            $action = $validated['status'] ? 'activated' : 'deactivated';

            return redirect()->route('users.index')
                ->with('success', count($validated['ids']) . " user(s) {$action} successfully!");
        } catch (\Throwable $e) {
            DB::rollBack();

            Log::error('Bulk user status update failed', [
                'ids' => $validated['ids'],
                'status' => $validated['status'],
                'error' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'general' => 'Failed to update user statuses.',
            ]);
        }
    }

    /**
     * Export users to CSV or Excel.
     */
    public function export(Request $request)
    {
        $query = User::query()->with('role');

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone_primary', 'like', "%{$search}%")
                    ->orWhere('uid', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status') && $request->status !== '') {
            $query->where('status', $request->status);
        }

        if ($request->filled('role_id')) {
            $query->where('role_id', $request->role_id);
        }

        if ($request->filled('blood_group')) {
            $query->where('blood_group', $request->blood_group);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        // If specific users are selected for export
        if ($request->filled('selected_ids')) {
            $ids = explode(',', $request->selected_ids);
            $query->whereIn('id', $ids);
        }

        $users = $query->get();

        // Generate filename
        $filename = 'users_export_' . date('Y-m-d_His') . '.csv';

        // Create CSV
        $handle = fopen('php://temp', 'w+');

        // Add UTF-8 BOM for Excel compatibility
        fprintf($handle, chr(0xEF) . chr(0xBB) . chr(0xBF));

        // Add headers
        fputcsv($handle, [
            'UID',
            'Name',
            'Email',
            'Phone',
            'Role',
            'Status',
            'Blood Group',
            'Gender',
            'Date of Birth',
            'Division',
            'District',
            'Police Station',
            'Address',
            'Created At',
            'Updated At'
        ]);

        // Add data rows
        foreach ($users as $user) {
            fputcsv($handle, [
                $user->uid,
                $user->name,
                $user->email,
                $user->phone_primary,
                $user->role->name ?? 'N/A',
                $user->status ? 'Active' : 'Inactive',
                $user->blood_group ?? 'N/A',
                $user->gender ?? 'N/A',
                $user->date_of_birth ?? 'N/A',
                $user->address_division ?? 'N/A',
                $user->address_district ?? 'N/A',
                $user->address_police_station ?? 'N/A',
                $user->address_details ?? 'N/A',
                $user->created_at,
                $user->updated_at,
            ]);
        }

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response($csv, 200, [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }

    /**
     * Get available roles for user forms (dropdown data).
     */
    public function getFormData(): \Illuminate\Http\JsonResponse
    {
        $roles = Role::where('status', true)
            ->select('id', 'name', 'slug')
            ->orderBy('name')
            ->get();

        return response()->json([
            'roles' => $roles,
        ]);
    }

    /**
     * Normalize phone number - ensures it starts with + and contains only digits
     * 
     * @param string|null $phone
     * @return string|null
     */
    private function normalizePhoneNumber($phone)
    {
        if (empty($phone)) {
            return null;
        }

        // Remove all non-digit characters except +
        $phone = preg_replace('/[^0-9+]/', '', trim($phone));

        // If no + sign, add it
        if (!str_starts_with($phone, '+')) {
            $phone = '+' . $phone;
        }

        return $phone;
    }
}
