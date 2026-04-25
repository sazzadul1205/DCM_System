<?php

namespace App\Http\Controllers;

use App\Models\Patient;
use App\Models\User;
use App\Models\Allergy;
use App\Models\MedicalCondition;
use App\Models\PatientAllergy;
use App\Models\PatientMedicalCondition;
use App\Models\PatientMedication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PatientController extends Controller
{
    /**
     * Display a listing of patients.
     */
    public function index(Request $request)
    {
        $query = Patient::query();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('patient_uid', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone_primary', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Gender filter
        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        // Blood group filter
        if ($request->filled('blood_group')) {
            $query->where('blood_group', $request->blood_group);
        }

        // Date range filter
        if ($request->filled('from_date')) {
            $query->whereDate('registration_date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('registration_date', '<=', $request->to_date);
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $patients = $query->paginate($perPage)->withQueryString();

        // Transform patients
        $patients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'patient_uid' => $patient->patient_uid,
                'name' => $patient->name,
                'phone_primary' => $patient->phone_primary,
                'phone_secondary' => $patient->phone_secondary,
                'email' => $patient->email,
                'gender' => $patient->gender,
                'date_of_birth' => $patient->date_of_birth,
                'blood_group' => $patient->blood_group,
                'emergency_contact_name' => $patient->emergency_contact_name,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'emergency_contact_relation' => $patient->emergency_contact_relation,
                'referred_by_user_id' => $patient->referred_by_user_id,
                'referral_source' => $patient->referral_source,
                'referral_notes' => $patient->referral_notes,
                'address_division' => $patient->address_division,
                'address_district' => $patient->address_district,
                'address_police_station' => $patient->address_police_station,
                'address_postal_code' => $patient->address_postal_code,
                'address_details' => $patient->address_details,
                'status' => $patient->status,
                'registration_date' => $patient->registration_date,
                'created_at' => $patient->created_at,
                'updated_at' => $patient->updated_at,
                'referred_by' => $patient->referredBy ? [
                    'id' => $patient->referredBy->id,
                    'name' => $patient->referredBy->name,
                ] : null,
                'created_by' => $patient->createdBy ? [
                    'id' => $patient->createdBy->id,
                    'name' => $patient->createdBy->name,
                ] : null,
            ];
        });

        return Inertia::render('Backend/Patients/Index', [
            'patients' => $patients,
            'filters' => [
                'search' => $request->input('search', ''),
                'status' => $request->input('status', ''),
                'gender' => $request->input('gender', ''),
                'blood_group' => $request->input('blood_group', ''),
                'from_date' => $request->input('from_date', ''),
                'to_date' => $request->input('to_date', ''),
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Show form for creating a new patient.
     */
    public function create()
    {
        $referrers = User::where('status', 'active')->select('id', 'name', 'email')->get();
        $availableAllergies = Allergy::where('status', 'active')->select('id', 'name', 'type')->get();
        $availableConditions = MedicalCondition::where('status', 'active')->select('id', 'name', 'category')->get();

        return Inertia::render('Backend/Patients/Create', [
            'referrers' => $referrers,
            'availableAllergies' => $availableAllergies,
            'availableConditions' => $availableConditions,
        ]);
    }

    /**
     * Store a newly created patient.
     */
    public function store(Request $request)
    {
        // Change validation to accept arrays OR strings
        $validated = $request->validate([
            // Basic Info
            'name' => 'required|string|max:255',
            'phone_primary' => 'required|string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date|before:today',
            'blood_group' => 'nullable|string|max:5',
            'status' => 'required|in:active,inactive',
            'registration_date' => 'required|date',

            // Emergency Contact
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relation' => 'nullable|string|max:100',

            // Address
            'address_division' => 'nullable|string|max:100',
            'address_district' => 'nullable|string|max:100',
            'address_police_station' => 'nullable|string|max:100',
            'address_postal_code' => 'nullable|string|max:20',
            'address_details' => 'nullable|string',

            // Referral
            'referred_by_user_id' => 'nullable|exists:users,id',
            'referral_source' => 'nullable|string|max:255',
            'referral_notes' => 'nullable|string',

            // Change these to accept arrays OR remove validation rules entirely
            'allergies' => 'nullable',
            'conditions' => 'nullable',
            'medications' => 'nullable',
        ]);

        // Start database transaction
        DB::beginTransaction();

        try {
            // Add audit fields
            $validated['created_by'] = Auth::id();
            $validated['updated_by'] = Auth::id();

            // Remove the relationship fields from validated data
            unset($validated['allergies'], $validated['conditions'], $validated['medications']);

            // Create patient
            $patient = Patient::create($validated);

            // Process Allergies - handle both string JSON and array formats
            $allergies = $request->input('allergies');
            if ($allergies) {
                // If it's a JSON string, decode it
                if (is_string($allergies)) {
                    $allergies = json_decode($allergies, true);
                }

                if (is_array($allergies)) {
                    foreach ($allergies as $allergy) {
                        PatientAllergy::create([
                            'patient_id' => $patient->id,
                            'allergy_id' => $allergy['allergy_id'],
                            'severity' => $allergy['severity'] ?? 'Mild',
                            'reaction_notes' => $allergy['reaction_notes'] ?? null,
                            'diagnosed_date' => $allergy['diagnosed_date'] ?? null,
                            'is_active' => true,
                            'created_by' => Auth::id(),
                            'updated_by' => Auth::id(),
                        ]);
                    }
                }
            }

            // Process Medical Conditions - handle both string JSON and array formats
            $conditions = $request->input('conditions');
            if ($conditions) {
                // If it's a JSON string, decode it
                if (is_string($conditions)) {
                    $conditions = json_decode($conditions, true);
                }

                if (is_array($conditions)) {
                    foreach ($conditions as $condition) {
                        PatientMedicalCondition::create([
                            'patient_id' => $patient->id,
                            'condition_id' => $condition['condition_id'],
                            'severity' => $condition['severity'] ?? 'Mild',
                            'diagnosed_date' => $condition['diagnosed_date'] ?? null,
                            'is_active' => $condition['is_active'] ?? true,
                            'notes' => $condition['notes'] ?? null,
                            'created_by' => Auth::id(),
                            'updated_by' => Auth::id(),
                        ]);
                    }
                }
            }

            // Process Medications - handle both string JSON and array formats
            $medications = $request->input('medications');
            if ($medications) {
                // If it's a JSON string, decode it
                if (is_string($medications)) {
                    $medications = json_decode($medications, true);
                }

                if (is_array($medications)) {
                    foreach ($medications as $medication) {
                        PatientMedication::create([
                            'patient_id' => $patient->id,
                            'medication_name' => $medication['medication_name'],
                            'dosage' => $medication['dosage'] ?? null,
                            'frequency' => $medication['frequency'] ?? null,
                            'start_date' => $medication['start_date'] ?? null,
                            'end_date' => $medication['end_date'] ?? null,
                            'is_active' => true,
                            'prescribed_by' => Auth::id(),
                            'notes' => $medication['notes'] ?? null,
                            'created_by' => Auth::id(),
                            'updated_by' => Auth::id(),
                        ]);
                    }
                }
            }

            // Commit transaction
            DB::commit();

            return redirect()->route('patients.show', $patient->id)
                ->with('success', 'Patient created successfully.');
        } catch (\Exception $e) {
            // Rollback transaction on error
            DB::rollBack();

            Log::error('Patient creation failed: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());

            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Failed to create patient: ' . $e->getMessage()]);
        }
    }

    /**
     * Quick store for minimal patient information.
     */
    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_primary' => 'required|string|max:20|unique:patients,phone_primary',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date|before:today',
            'status' => 'required|in:active,inactive',
        ]);

        $validated['registration_date'] = now()->toDateString();
        $validated['created_by'] = Auth::id();
        $validated['updated_by'] = Auth::id();

        $patient = Patient::create($validated);

        return redirect()->route('patients.show', $patient->id)
            ->with('success', 'Patient created successfully. You can add more details later.');
    }

    /**
     * Display the specified patient.
     */
    public function show(Patient $patient)
    {
        // Load patient with all relationships
        $patient->load([
            'referredBy',
            'createdBy',
            'updatedBy',
        ]);

        // Get patient allergies (show all active ones)
        $allergies = PatientAllergy::with('allergy')
            ->where('patient_id', $patient->id)
            ->where('is_active', true)
            ->get()
            ->map(function ($patientAllergy) {
                return [
                    'id' => $patientAllergy->id,
                    'allergy_id' => $patientAllergy->allergy_id,
                    'allergy_name' => $patientAllergy->allergy->name,
                    'allergy_type' => $patientAllergy->allergy->type,
                    'severity' => $patientAllergy->severity,
                    'reaction_notes' => $patientAllergy->reaction_notes,
                    'diagnosed_date' => $patientAllergy->diagnosed_date,
                    'is_active' => $patientAllergy->is_active,
                ];
            });

        // Get patient medical conditions (show all active ones)
        $medicalConditions = PatientMedicalCondition::with('condition')
            ->where('patient_id', $patient->id)
            ->where('is_active', true)
            ->get()
            ->map(function ($patientCondition) {
                return [
                    'id' => $patientCondition->id,
                    'condition_id' => $patientCondition->condition_id,
                    'condition_name' => $patientCondition->condition->name,
                    'category' => $patientCondition->condition->category,
                    'severity' => $patientCondition->severity,
                    'diagnosed_date' => $patientCondition->diagnosed_date,
                    'is_active' => $patientCondition->is_active,
                    'notes' => $patientCondition->notes,
                ];
            });

        // Get ALL medications (remove the date filter)
        $medications = PatientMedication::where('patient_id', $patient->id)
            ->orderBy('start_date', 'desc')
            ->get()
            ->map(function ($medication) {
                return [
                    'id' => $medication->id,
                    'medication_name' => $medication->medication_name,
                    'dosage' => $medication->dosage,
                    'frequency' => $medication->frequency,
                    'start_date' => $medication->start_date,
                    'end_date' => $medication->end_date,
                    'is_active' => $medication->is_active,
                    'notes' => $medication->notes,
                ];
            });

        return Inertia::render('Backend/Patients/Show', [
            'patient' => [
                'id' => $patient->id,
                'patient_uid' => $patient->patient_uid,
                'name' => $patient->name,
                'phone_primary' => $patient->phone_primary,
                'phone_secondary' => $patient->phone_secondary,
                'email' => $patient->email,
                'gender' => $patient->gender,
                'date_of_birth' => $patient->date_of_birth,
                'blood_group' => $patient->blood_group,
                'emergency_contact_name' => $patient->emergency_contact_name,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'emergency_contact_relation' => $patient->emergency_contact_relation,
                'referred_by_user_id' => $patient->referred_by_user_id,
                'referral_source' => $patient->referral_source,
                'referral_notes' => $patient->referral_notes,
                'address_division' => $patient->address_division,
                'address_district' => $patient->address_district,
                'address_police_station' => $patient->address_police_station,
                'address_postal_code' => $patient->address_postal_code,
                'address_details' => $patient->address_details,
                'status' => $patient->status,
                'registration_date' => $patient->registration_date,
                'created_at' => $patient->created_at,
                'updated_at' => $patient->updated_at,
                'referred_by' => $patient->referredBy ? [
                    'id' => $patient->referredBy->id,
                    'name' => $patient->referredBy->name,
                ] : null,
            ],
            'allergies' => $allergies,
            'medicalConditions' => $medicalConditions,
            'medications' => $medications,
            'availableAllergies' => Allergy::where('status', 'active')->select('id', 'name', 'type')->get(),
            'availableConditions' => MedicalCondition::where('status', 'active')->select('id', 'name', 'category')->get(),
        ]);
    }

    /**
     * Show form for editing the specified patient.
     */
    public function edit(Patient $patient)
    {
        $referrers = User::where('status', 'active')
            ->select('id', 'name', 'email')
            ->get();

        return Inertia::render('Backend/Patients/Edit', [
            'patient' => [
                'id' => $patient->id,
                'patient_uid' => $patient->patient_uid,
                'name' => $patient->name,
                'phone_primary' => $patient->phone_primary,
                'phone_secondary' => $patient->phone_secondary,
                'email' => $patient->email,
                'gender' => $patient->gender,
                'date_of_birth' => $patient->date_of_birth,
                'blood_group' => $patient->blood_group,
                'emergency_contact_name' => $patient->emergency_contact_name,
                'emergency_contact_phone' => $patient->emergency_contact_phone,
                'emergency_contact_relation' => $patient->emergency_contact_relation,
                'referred_by_user_id' => $patient->referred_by_user_id,
                'referral_source' => $patient->referral_source,
                'referral_notes' => $patient->referral_notes,
                'address_division' => $patient->address_division,
                'address_district' => $patient->address_district,
                'address_police_station' => $patient->address_police_station,
                'address_postal_code' => $patient->address_postal_code,
                'address_details' => $patient->address_details,
                'status' => $patient->status,
                'registration_date' => $patient->registration_date,
            ],
            'referrers' => $referrers,
        ]);
    }

    /**
     * Update the specified patient.
     */
    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone_primary' => 'required|string|max:20',
            'phone_secondary' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date|before:today',
            'blood_group' => 'nullable|string|max:5',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relation' => 'nullable|string|max:100',
            'referred_by_user_id' => 'nullable|exists:users,id',
            'referral_source' => 'nullable|string|max:255',
            'referral_notes' => 'nullable|string',
            'address_division' => 'nullable|string|max:100',
            'address_district' => 'nullable|string|max:100',
            'address_police_station' => 'nullable|string|max:100',
            'address_postal_code' => 'nullable|string|max:20',
            'address_details' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'registration_date' => 'required|date',
        ]);

        $validated['updated_by'] = Auth::id();

        $patient->update($validated);

        return redirect()->route('patients.show', $patient->id)
            ->with('success', 'Patient updated successfully.');
    }

    /**
     * Update single patient status.
     */
    public function updateStatus(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'status' => 'required|in:active,inactive',
        ]);

        $patient->update([
            'status' => $validated['status'],
            'updated_by' => Auth::id(),
        ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';
        return redirect()->back()->with('success', "Patient {$statusText} successfully.");
    }

    /**
     * Soft delete the specified patient.
     */
    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()->route('patients.index')
            ->with('success', 'Patient moved to archive.');
    }

    /**
     * Display archived (soft deleted) patients.
     */
    public function archived(Request $request)
    {
        $query = Patient::onlyTrashed();

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('patient_uid', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone_primary', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortField = $request->input('sort_field', 'deleted_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $archivedPatients = $query->paginate($perPage)->withQueryString();

        $archivedPatients->getCollection()->transform(function ($patient) {
            return [
                'id' => $patient->id,
                'patient_uid' => $patient->patient_uid,
                'name' => $patient->name,
                'phone_primary' => $patient->phone_primary,
                'gender' => $patient->gender,
                'status' => $patient->status,
                'deleted_at' => $patient->deleted_at,
                'deleted_by' => $patient->updatedBy ? [
                    'id' => $patient->updatedBy->id,
                    'name' => $patient->updatedBy->name,
                ] : null,
            ];
        });

        return Inertia::render('Backend/Patients/Archived', [
            'archivedPatients' => $archivedPatients,
            'filters' => [
                'search' => $request->input('search', ''),
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'per_page' => (int) $perPage,
            ],
        ]);
    }

    /**
     * Restore a soft deleted patient.
     */
    public function restore($id)
    {
        $patient = Patient::onlyTrashed()->findOrFail($id);
        $patient->restore();
        $patient->update(['updated_by' => Auth::id()]);

        return redirect()->route('patients.archived')
            ->with('success', 'Patient restored successfully.');
    }

    /**
     * Force delete a patient permanently.
     */
    public function forceDelete($id)
    {
        $patient = Patient::withTrashed()->findOrFail($id);

        // Delete related records
        PatientAllergy::where('patient_id', $patient->id)->delete();
        PatientMedicalCondition::where('patient_id', $patient->id)->delete();
        PatientMedication::where('patient_id', $patient->id)->delete();

        $patient->forceDelete();

        return redirect()->route('patients.archived')
            ->with('success', 'Patient permanently deleted.');
    }

    /**
     * Bulk delete patients.
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:patients,id',
        ]);

        $count = Patient::whereIn('id', $validated['ids'])->delete();

        return redirect()->back()->with('success', "{$count} patient(s) moved to archive.");
    }

    /**
     * Bulk restore patients.
     */
    public function bulkRestore(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:patients,id',
        ]);

        $count = Patient::onlyTrashed()
            ->whereIn('id', $validated['ids'])
            ->restore();

        Patient::whereIn('id', $validated['ids'])->update(['updated_by' => Auth::id()]);

        return redirect()->back()->with('success', "{$count} patient(s) restored successfully.");
    }

    /**
     * Bulk force delete patients permanently.
     */
    public function bulkForceDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:patients,id',
        ]);

        $patients = Patient::withTrashed()->whereIn('id', $validated['ids'])->get();

        foreach ($patients as $patient) {
            // Delete related records
            PatientAllergy::where('patient_id', $patient->id)->delete();
            PatientMedicalCondition::where('patient_id', $patient->id)->delete();
            PatientMedication::where('patient_id', $patient->id)->delete();
            $patient->forceDelete();
        }

        return redirect()->back()->with('success', count($patients) . " patient(s) permanently deleted.");
    }

    /**
     * Bulk update status for multiple patients.
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:patients,id',
            'status' => 'required|in:active,inactive',
        ]);

        $updatedCount = Patient::whereIn('id', $validated['ids'])
            ->update([
                'status' => $validated['status'],
                'updated_by' => Auth::id(),
            ]);

        $statusText = $validated['status'] === 'active' ? 'activated' : 'deactivated';

        return redirect()->back()->with('success', "{$updatedCount} patient(s) {$statusText} successfully.");
    }

    /**
     * Print patients list (PDF/HTML view).
     */
    public function print(Request $request)
    {
        $query = Patient::query();

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('patient_uid', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone_primary', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        if ($request->filled('blood_group')) {
            $query->where('blood_group', $request->blood_group);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('registration_date', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('registration_date', '<=', $request->to_date);
        }

        // Get all patients for print
        $patients = $query->orderBy('name')->get();

        // Return Inertia print view
        return Inertia::render('Backend/Patients/Print', [
            'patients' => $patients->map(function ($patient) {
                return [
                    'patient_uid' => $patient->patient_uid,
                    'name' => $patient->name,
                    'phone_primary' => $patient->phone_primary,
                    'gender' => $patient->gender,
                    'blood_group' => $patient->blood_group,
                    'registration_date' => $patient->registration_date,
                    'status' => $patient->status,
                ];
            }),
            'filters' => $request->all(),
            'print_date' => now()->format('Y-m-d H:i:s'),
            'total_count' => $patients->count(),
        ]);
    }

    /**
     * Export patients to CSV/Excel.
     */
    public function export(Request $request)
    {
        $query = Patient::query();

        // Apply same filters as print
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('patient_uid', 'like', "%{$search}%")
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('phone_primary', 'like', "%{$search}%");
            });
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('gender')) {
            $query->where('gender', $request->gender);
        }

        $patients = $query->orderBy('name')->get();

        // Return CSV export
        $fileName = 'patients_' . date('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename={$fileName}",
        ];

        $callback = function () use ($patients) {
            $file = fopen('php://output', 'w');

            // Add headers
            fputcsv($file, [
                'Patient UID',
                'Name',
                'Primary Phone',
                'Secondary Phone',
                'Email',
                'Gender',
                'Date of Birth',
                'Blood Group',
                'Emergency Contact',
                'Emergency Phone',
                'Registration Date',
                'Status'
            ]);

            // Add data rows
            foreach ($patients as $patient) {
                fputcsv($file, [
                    $patient->patient_uid,
                    $patient->name,
                    $patient->phone_primary,
                    $patient->phone_secondary,
                    $patient->email,
                    $patient->gender,
                    $patient->date_of_birth,
                    $patient->blood_group,
                    $patient->emergency_contact_name,
                    $patient->emergency_contact_phone,
                    $patient->registration_date,
                    $patient->status,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get patient statistics for dashboard.
     */
    public function statistics()
    {
        $totalPatients = Patient::count();
        $activePatients = Patient::where('status', 'active')->count();
        $inactivePatients = Patient::where('status', 'inactive')->count();
        $archivedPatients = Patient::onlyTrashed()->count();

        $genderStats = [
            'male' => Patient::where('gender', 'male')->count(),
            'female' => Patient::where('gender', 'female')->count(),
            'other' => Patient::where('gender', 'other')->count(),
        ];

        $bloodGroupStats = Patient::select('blood_group', DB::raw('count(*) as total'))
            ->whereNotNull('blood_group')
            ->groupBy('blood_group')
            ->pluck('total', 'blood_group')
            ->toArray();

        $monthlyRegistrations = Patient::select(
            DB::raw('DATE_FORMAT(registration_date, "%Y-%m") as month'),
            DB::raw('count(*) as total')
        )
            ->groupBy('month')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        return response()->json([
            'total' => $totalPatients,
            'active' => $activePatients,
            'inactive' => $inactivePatients,
            'archived' => $archivedPatients,
            'by_gender' => $genderStats,
            'by_blood_group' => $bloodGroupStats,
            'monthly_registrations' => $monthlyRegistrations,
        ]);
    }
}
