<?php
// database/migrations/2026_04_22_014559_update_users_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add new columns
            $table->string('uid')->unique()->after('id');
            $table->string('phone_primary')->after('email');
            $table->string('phone_secondary')->nullable()->after('phone_primary');
            $table->enum('blood_group', [
                'A+',
                'A-',
                'B+',
                'B-',
                'AB+',
                'AB-',
                'O+',
                'O-'
            ])->nullable()->after('phone_secondary');
            $table->foreignId('role_id')->nullable()->after('blood_group')->constrained('roles');
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active')->after('role_id');
            $table->softDeletes()->after('status');
            $table->foreignId('created_by')->nullable()->after('deleted_at')->constrained('users');
            $table->foreignId('updated_by')->nullable()->after('created_by')->constrained('users');

            // Add indexes
            $table->index('phone_primary');
            $table->index('status');
            $table->index('deleted_at');
            $table->index(['id', 'deleted_at']);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['role_id']);
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            $table->dropColumn([
                'uid',
                'phone_primary',
                'phone_secondary',
                'blood_group',
                'role_id',
                'status',
                'deleted_at',
                'created_by',
                'updated_by'
            ]);
        });
    }
};
