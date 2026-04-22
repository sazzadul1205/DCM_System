<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('patient_allergies', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained('patients')->cascadeOnDelete();
            $table->foreignId('allergy_id')->constrained('allergies')->cascadeOnDelete();
            $table->enum('severity', ['mild', 'moderate', 'severe', 'life_threatening'])->nullable();
            $table->text('reaction_notes')->nullable();
            $table->date('diagnosed_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('patient_id');
            $table->index('allergy_id');
            $table->index('is_active');
            $table->index('severity');
            $table->index(['patient_id', 'is_active']);
            $table->index(['patient_id', 'allergy_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('patient_allergies');
    }
};
