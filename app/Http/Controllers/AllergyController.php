<?php

namespace App\Http\Controllers;

use App\Models\Allergy;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AllergyController extends Controller
{
    /**
     * Display a listing of allergies.
     */
    public function index(Request $request)
    {
        $query = Allergy::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%")
                    ->orWhere('common_symptoms', 'like', "%{$search}%");
            });
        }

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
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
        $allergies = $query->paginate($perPage)->withQueryString();

        // Transform allergies to include created_by and updated_by info
        $allergies->getCollection()->transform(function ($allergy) {
            return [
                'id' => $allergy->id,
                'name' => $allergy->name,
                'type' => $allergy->type,
                'description' => $allergy->description,
                'common_symptoms' => $allergy->common_symptoms,
                'status' => $allergy->status,
                'created_at' => $allergy->created_at,
                'updated_at' => $allergy->updated_at,
                'created_by' => $allergy->createdBy ? [
                    'id' => $allergy->createdBy->id,
                    'name' => $allergy->createdBy->name,
                ] : null,
                'updated_by' => $allergy->updatedBy ? [
                    'id' => $allergy->updatedBy->id,
                    'name' => $allergy->updatedBy->name,
                ] : null,
            ];
        });

        return Inertia::render('Backend/Allergies/Index', [
            'allergies' => $allergies,
            'filters' => [
                'search' => $request->input('search', ''),
                'type' => $request->input('type', ''),
                'status' => $request->input('status', ''),
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Store a newly created allergy.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'common_symptoms' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $allergy = Allergy::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'description' => $validated['description'] ?? null,
            'common_symptoms' => $validated['common_symptoms'] ?? null,
            'status' => $validated['status'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Allergy created successfully.');
    }

    /**
     * Update the specified allergy.
     */
    public function update(Request $request, Allergy $allergy)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'description' => 'nullable|string',
            'common_symptoms' => 'nullable|string',
            'status' => 'required|in:active,inactive',
        ]);

        $allergy->update([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'description' => $validated['description'] ?? null,
            'common_symptoms' => $validated['common_symptoms'] ?? null,
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        return redirect()->back()->with('success', 'Allergy updated successfully.');
    }

    /**
     * Update single allergy status
     */
    public function updateStatus(Request $request, Allergy $allergy)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $allergy->update([
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "Allergy {$statusText} successfully.");
    }

    /**
     * Remove the specified allergy.
     */
    public function destroy(Allergy $allergy)
    {
        $allergy->delete();

        return redirect()->back()->with('success', 'Allergy deleted successfully.');
    }

    /**
     * Bulk delete allergies
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:allergies,id',
        ]);

        $deletedCount = Allergy::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', "{$deletedCount} allergy(ies) deleted successfully.");
    }

    /**
     * Bulk update status for multiple allergies
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:allergies,id',
            'status' => 'required|in:active,inactive',
        ]);

        $updatedCount = Allergy::whereIn('id', $validated['ids'])
            ->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
            ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';

        return redirect()->back()->with('success', "{$updatedCount} allergy(ies) {$statusText} successfully.");
    }
}
