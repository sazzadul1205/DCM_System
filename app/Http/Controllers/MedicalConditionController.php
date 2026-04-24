<?php

namespace App\Http\Controllers;

use App\Models\MedicalCondition;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MedicalConditionController extends Controller
{
    /**
     * Display a listing of medical conditions.
     */
    public function index(Request $request)
    {
        $query = MedicalCondition::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Dental filter
        if ($request->filled('is_dental')) {
            $query->where('is_dental', $request->is_dental === 'true');
        }

        // Requires attention filter
        if ($request->filled('requires_attention')) {
            $query->where('requires_attention', $request->requires_attention === 'true');
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
        $conditions = $query->paginate($perPage)->withQueryString();

        // Transform conditions to include created_by and updated_by info
        $conditions->getCollection()->transform(function ($condition) {
            return [
                'id' => $condition->id,
                'name' => $condition->name,
                'category' => $condition->category,
                'description' => $condition->description,
                'is_dental' => $condition->is_dental,
                'requires_attention' => $condition->requires_attention,
                'status' => $condition->status,
                'created_at' => $condition->created_at,
                'updated_at' => $condition->updated_at,
                'created_by' => $condition->createdBy ? [
                    'id' => $condition->createdBy->id,
                    'name' => $condition->createdBy->name,
                ] : null,
                'updated_by' => $condition->updatedBy ? [
                    'id' => $condition->updatedBy->id,
                    'name' => $condition->updatedBy->name,
                ] : null,
            ];
        });

        return Inertia::render('Backend/MedicalConditions/Index', [
            'medicalConditions' => $conditions,
            'filters' => [
                'search' => $request->input('search', ''),
                'category' => $request->input('category', ''),
                'is_dental' => $request->input('is_dental', ''),
                'requires_attention' => $request->input('requires_attention', ''),
                'status' => $request->input('status', ''),
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created medical condition.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_dental' => 'boolean',
            'requires_attention' => 'boolean',
            'status' => 'required|in:active,inactive',
        ]);

        $condition = MedicalCondition::create([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'is_dental' => $validated['is_dental'] ?? false,
            'requires_attention' => $validated['requires_attention'] ?? false,
            'status' => $validated['status'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Medical condition created successfully.');
    }

    /**
     * Update the specified medical condition.
     */
    public function update(Request $request, MedicalCondition $medicalCondition)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_dental' => 'boolean',
            'requires_attention' => 'boolean',
            'status' => 'required|in:active,inactive',
        ]);

        $medicalCondition->update([
            'name' => $validated['name'],
            'category' => $validated['category'],
            'description' => $validated['description'] ?? null,
            'is_dental' => $validated['is_dental'] ?? false,
            'requires_attention' => $validated['requires_attention'] ?? false,
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Medical condition updated successfully.');
    }

    /**
     * Update single medical condition status
     */
    public function updateStatus(Request $request, MedicalCondition $medicalCondition)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $medicalCondition->update([
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "Medical condition {$statusText} successfully.");
    }

    /**
     * Remove the specified medical condition.
     */
    public function destroy(MedicalCondition $medicalCondition)
    {
        $medicalCondition->delete();

        return redirect()->back()->with('success', 'Medical condition deleted successfully.');
    }

    /**
     * Bulk delete medical conditions
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:medical_conditions,id',
        ]);

        $deletedCount = MedicalCondition::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', "{$deletedCount} medical condition(s) deleted successfully.");
    }

    /**
     * Bulk update status for multiple medical conditions
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:medical_conditions,id',
            'status' => 'required|in:active,inactive',
        ]);

        $updatedCount = MedicalCondition::whereIn('id', $validated['ids'])
            ->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
            ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';

        return redirect()->back()->with('success', "{$updatedCount} medical condition(s) {$statusText} successfully.");
    }
}
