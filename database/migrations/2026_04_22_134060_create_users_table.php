<?php
// database/migrations/0001_01_01_000000_create_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone_primary');
            $table->string('phone_secondary')->nullable();
            $table->enum('blood_group', ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])->nullable();

            // New profile fields
            $table->date('date_of_birth')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();

            // Address fields
            $table->string('address_division')->nullable();
            $table->string('address_district')->nullable();
            $table->string('address_police_station')->nullable();
            $table->string('address_postal_code')->nullable();
            $table->text('address_details')->nullable();

            // Emergency contact fields
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('emergency_contact_relation')->nullable();

            // Profile completion tracking
            $table->boolean('profile_completed')->default(false);
            $table->timestamp('profile_completed_at')->nullable();

            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->foreignId('role_id')->nullable()->constrained('roles')->nullOnDelete();
            $table->rememberToken();
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->softDeletes();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            // Indexes
            $table->index('uid');
            $table->index('phone_primary');
            $table->index('role_id');
            $table->index('status');
            $table->index('deleted_at');
            $table->index('profile_completed');
            $table->index(['id', 'deleted_at']);
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('sessions');
    }
};
