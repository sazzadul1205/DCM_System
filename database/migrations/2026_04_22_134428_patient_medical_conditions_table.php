<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_medical_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('condition_id')->constrained('medical_conditions')->cascadeOnDelete();
            $table->enum('severity', ['mild', 'moderate', 'severe'])->nullable();
            $table->date('diagnosed_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('patient_id');
            $table->index('condition_id');
            $table->index('is_active');
            $table->index('severity');
            $table->index('diagnosed_date');
            $table->index(['patient_id', 'is_active']);
            $table->index(['patient_id', 'condition_id']);
        });
    }


    public function down(): void
    {
        Schema::dropIfExists('patient_medical_conditions');
    }
};
