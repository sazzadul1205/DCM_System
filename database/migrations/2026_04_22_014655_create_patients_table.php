<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('patient_uid')->unique();
            $table->string('name');
            $table->string('phone_primary');
            $table->string('phone_secondary')->nullable();
            $table->string('email')->nullable();
            $table->enum('gender', ['male', 'female', 'other']);
            $table->date('date_of_birth');
            $table->enum('blood_group', [
                'A+',
                'A-',
                'B+',
                'B-',
                'AB+',
                'AB-',
                'O+',
                'O-'
            ])->nullable();

            // Emergency Contact
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relation')->nullable();

            // Referral
            $table->foreignId('referred_by_user_id')->nullable();
            $table->enum('referral_source', [
                'doctor',
                'patient',
                'walk_in',
                'social_media',
                'news',
                'other'
            ])->nullable();
            $table->text('referral_notes')->nullable();

            // Address
            $table->string('address_division')->nullable();
            $table->string('address_district')->nullable();
            $table->string('address_police_station')->nullable();
            $table->string('address_postal_code')->nullable();
            $table->text('address_details')->nullable();

            $table->enum('status', ['active', 'inactive', 'deceased', 'archived'])->default('active');
            $table->date('registration_date');
            $table->softDeletes();

            $table->foreignId('created_by')->nullable();
            $table->foreignId('updated_by')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('patient_uid');
            $table->index('phone_primary');
            $table->index('email');
            $table->index('blood_group');
            $table->index('referral_source');
            $table->index('referred_by_user_id');
            $table->index('status');
            $table->index('deleted_at');
            $table->index('created_by');
            $table->index(['id', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patients');
    }
};
