<?php
// database/migrations/2026_04_22_015034_create_medication_frequencies_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medication_frequencies', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('code')->unique();
            $table->integer('times_per_day')->nullable();
            $table->text('description')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users');
            $table->timestamps();
        });

        // Seed default frequencies
        $this->seedFrequencies();
    }

    private function seedFrequencies(): void
    {
        $frequencies = [
            ['name' => 'Once Daily', 'code' => 'once_daily', 'times_per_day' => 1],
            ['name' => 'Twice Daily', 'code' => 'twice_daily', 'times_per_day' => 2],
            ['name' => 'Three Times Daily', 'code' => 'thrice_daily', 'times_per_day' => 3],
            ['name' => 'Four Times Daily', 'code' => 'four_times_daily', 'times_per_day' => 4],
            ['name' => 'Every Other Day', 'code' => 'every_other_day', 'times_per_day' => 0.5],
            ['name' => 'Once Weekly', 'code' => 'once_weekly', 'times_per_day' => 0.14],
            ['name' => 'As Needed', 'code' => 'as_needed', 'times_per_day' => null],
        ];

        foreach ($frequencies as $frequency) {
            DB::table('medication_frequencies')->insert(array_merge($frequency, [
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('medication_frequencies');
    }
};
