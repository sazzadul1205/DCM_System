<?php
// database/migrations/2026_04_22_014634_user_password_history_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_password_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('password_hash');
            $table->timestamp('changed_at')->useCurrent();
            $table->foreignId('created_by')->nullable()->constrained('users');

            $table->index('user_id');
            $table->index('changed_at');
            $table->index(['user_id', 'changed_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_password_history');
    }
};
