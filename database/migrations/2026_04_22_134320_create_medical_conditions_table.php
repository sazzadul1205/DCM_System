<?php
// migrations/2026_04_22_134320_create_medical_conditions_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medical_conditions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->enum('category', ['general', 'dental', 'chronic', 'acute']);
            $table->text('description')->nullable();
            $table->boolean('is_dental')->default(false);
            $table->boolean('requires_attention')->default(true);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();

            $table->index('category');
            $table->index('is_dental');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medical_conditions');
    }
};
