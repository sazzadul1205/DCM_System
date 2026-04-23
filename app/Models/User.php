<?php

// app/Models/User.php

namespace App\Models;

use App\Services\UidGenerator;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'uid',
        'name',
        'email',
        'phone_primary',
        'phone_secondary',
        'blood_group',
        'date_of_birth',
        'gender',
        'email_verified_at',
        'password',
        'role_id',
        'status',
        'address_division',
        'address_district',
        'address_police_station',
        'address_postal_code',
        'address_details',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'profile_completed',
        'profile_completed_at',
        'created_by',
        'updated_by',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'deleted_at' => 'datetime',
            'profile_completed' => 'boolean',
            'profile_completed_at' => 'datetime',
            'date_of_birth' => 'date',
        ];
    }

    protected static function booted()
    {
        static::creating(function ($user) {
            if (empty($user->uid)) {
                $user->uid = UidGenerator::generate(
                    prefix: 'UID',
                    table: 'users',
                    column: 'uid',
                    length: 16
                );
            }
        });
    }

    // Helper Methods
    public function isProfileCompleted(): bool
    {
        return $this->profile_completed === true;
    }

    public function needsProfileCompletion(): bool
    {
        return !$this->isProfileCompleted();
    }

    public function markProfileAsCompleted(): void
    {
        $this->update([
            'profile_completed' => true,
            'profile_completed_at' => now(),
        ]);
    }

    // Relationships
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
