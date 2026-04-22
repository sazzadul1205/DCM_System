<?php
// database/migrations/2026_04_22_015204_create_patient_medications_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('medication_id')->constrained('medications');
            $table->string('dosage')->nullable();
            $table->foreignId('frequency_id')->nullable()->constrained('medication_frequencies');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('prescribed_by')->nullable()->constrained('users');
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();

            $table->index('patient_id');
            $table->index('medication_id');
            $table->index('frequency_id');
            $table->index('is_active');
            $table->index('start_date');
            $table->index('prescribed_by');
            $table->index(['patient_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_medications');
    }
};
