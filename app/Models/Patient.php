<?php

namespace App\Models;

use App\Services\UidGenerator;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Patient extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'patient_uid',
        'name',
        'phone_primary',
        'phone_secondary',
        'email',
        'gender',
        'date_of_birth',
        'blood_group',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'referred_by_user_id',
        'referral_source',
        'referral_notes',
        'address_division',
        'address_district',
        'address_police_station',
        'address_postal_code',
        'address_details',
        'status',
        'registration_date',
        'created_by',
        'updated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'registration_date' => 'date',
            'deleted_at' => 'datetime',
        ];
    }

    // Generate a unique ID with retry mechanism
    protected static function booted()
    {
        static::creating(function ($patient) {
            if (empty($patient->patient_uid)) {
                $patient->patient_uid = UidGenerator::generate(
                    prefix: 'PID',
                    table: 'patients',
                    column: 'patient_uid',
                    length: 16
                );
            }
        });
    } 

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    /**
     * Get the user who referred this patient.
     */
    public function referredBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'referred_by_user_id');
    }

    /**
     * Get the creator of this patient.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the updater of this patient.
     */
    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
