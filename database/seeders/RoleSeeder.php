<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('roles')->insert([
            'name' => 'Visitor',
            'slug' => 'visitor',
            'permissions' => json_encode([
                "profile.view",
                "profile.edit",
                'dashboard.view',
                'profile.complete',
            ]),
            'description' => 'Limited access user. Only dashboard and profile completion allowed.',
            'status' => 'active',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
