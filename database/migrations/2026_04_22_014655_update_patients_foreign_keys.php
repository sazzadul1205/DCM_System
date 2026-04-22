<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
  public function up(): void
  {
    Schema::table('patients', function (Blueprint $table) {
      $table->foreign('referred_by_user_id')->references('id')->on('users')->nullOnDelete();
      $table->foreign('created_by')->references('id')->on('users')->nullOnDelete();
      $table->foreign('updated_by')->references('id')->on('users')->nullOnDelete();
    });
  }

  public function down(): void
  {
    Schema::table('patients', function (Blueprint $table) {
      $table->dropForeign(['referred_by_user_id']);
      $table->dropForeign(['created_by']);
      $table->dropForeign(['updated_by']);
    });
  }
};
