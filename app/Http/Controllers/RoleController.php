<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Available permissions list (easily extendable)
     */
    protected function getAvailablePermissions(): array
    {
        return [
            'dashboard.view',
            'profile.view',
            'profile.edit',
            'profile.complete',
            'roles.view',
            'roles.create',
            'roles.edit',
            'roles.delete',
        ];
    }

    /**
     * Display a listing of roles.
     */
    public function index(Request $request)
    {
        $query = Role::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination with query string preservation
        $perPage = $request->input('per_page', 10);
        $roles = $query->paginate($perPage)->withQueryString();

        // Transform roles to include permissions as array
        $roles->getCollection()->transform(function ($role) {
            return [
                'id' => $role->id,
                'name' => $role->name,
                'slug' => $role->slug,
                'permissions' => $role->permissions ?? [],
                'description' => $role->description,
                'status' => $role->status,
                'created_at' => $role->created_at,
                'updated_at' => $role->updated_at,
                'created_by' => $role->createdBy ? [
                    'id' => $role->createdBy->id,
                    'name' => $role->createdBy->name,
                ] : null,
            ];
        });

        return Inertia::render('Backend/Roles/Index', [
            'roles' => $roles,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => (int) $perPage,
            ],
            'availablePermissions' => $this->getAvailablePermissions(),
        ]);
    }

    /**
     * Store a newly created role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles,slug',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'permissions' => $validated['permissions'] ?? [],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Role created successfully.');
    }

    /**
     * Update the specified role.
     */
    public function update(Request $request, Role $role)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:roles,slug,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $role->update([
            'name' => $validated['name'],
            'slug' => $validated['slug'],
            'permissions' => $validated['permissions'] ?? [],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Role updated successfully.');
    }

    /**
     * Update single role status
     */
    public function updateStatus(Request $request, Role $role)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        // Prevent deactivating system-critical roles
        if ($validated['status'] === 'inactive' && in_array($role->slug, ['super-admin', 'admin'])) {
            return redirect()->back()->with('error', 'Cannot deactivate system roles (Super Admin or Admin).');
        }

        $role->update([
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "Role {$statusText} successfully.");
    }

    /**
     * Remove the specified role.
     */
    public function destroy(Role $role)
    {
        // Prevent deletion of system-critical roles
        if (in_array($role->slug, ['super-admin', 'admin'])) {
            return redirect()->back()->with('error', 'Cannot delete system roles.');
        }

        $role->delete();

        return redirect()->back()->with('success', 'Role deleted successfully.');
    }

    /**
     * Bulk delete roles
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
        ]);

        // Prevent deletion of system-critical roles
        $protectedRoles = Role::whereIn('id', $validated['ids'])
            ->whereIn('slug', ['super-admin', 'admin'])
            ->count();

        if ($protectedRoles > 0) {
            return redirect()->back()->with('error', 'Cannot delete system roles (Super Admin or Admin).');
        }

        $deletedCount = Role::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', "{$deletedCount} role(s) deleted successfully.");
    }

    /**
     * Bulk update status for multiple roles
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:roles,id',
            'status' => 'required|in:active,inactive',
        ]);

        // Prevent status update for system-critical roles if trying to deactivate
        if ($validated['status'] === 'inactive') {
            $protectedRoles = Role::whereIn('id', $validated['ids'])
                ->whereIn('slug', ['super-admin', 'admin'])
                ->count();

            if ($protectedRoles > 0) {
                return redirect()->back()->with('error', 'Cannot deactivate system roles (Super Admin or Admin).');
            }
        }

        $updatedCount = Role::whereIn('id', $validated['ids'])
            ->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
            ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';

        return redirect()->back()->with('success', "{$updatedCount} role(s) {$statusText} successfully.");
    }

    /**
     * Get available permissions (API endpoint for dynamic updates)
     */
    public function getPermissions()
    {
        return response()->json([
            'permissions' => $this->getAvailablePermissions(),
        ]);
    }
}
