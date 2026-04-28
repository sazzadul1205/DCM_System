<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        // Insert roles
        $roles = [
            [
                'name' => 'Super Admin',
                'slug' => 'super-admin',
                'permissions' => json_encode([
                    'dashboard.view',
                    'profile.view',
                    'profile.edit',
                    'profile.complete',
                    'roles.index',
                    'roles.view',
                    'roles.create',
                    'roles.edit',
                    'roles.delete',
                    'allergies.index',
                    'allergies.create',
                    'allergies.edit',
                    'allergies.delete',
                    'medical-conditions.index',
                    'medical-conditions.create',
                    'medical-conditions.edit',
                    'medical-conditions.delete',
                    'patients.index',
                    'patients.view',
                    'patients.create',
                    'patients.quick-store',
                    'patients.edit',
                    'patients.delete',
                    'patients.archived',
                    'patients.restore',
                    'patients.force-delete',
                    'patients.print',
                    'patients.export',
                    'patients.statistics',
                ]),
                'description' => 'Full system access with all permissions',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Admin',
                'slug' => 'admin',
                'permissions' => json_encode([
                    'dashboard.view',
                    'profile.view',
                    'profile.edit',
                    'profile.complete',
                    'roles.index',
                    'roles.view',
                    'roles.create',
                    'roles.edit',
                    'roles.delete',
                    'allergies.index',
                    'allergies.create',
                    'allergies.edit',
                    'allergies.delete',
                    'medical-conditions.index',
                    'medical-conditions.create',
                    'medical-conditions.edit',
                    'medical-conditions.delete',
                    'patients.index',
                    'patients.view',
                    'patients.create',
                    'patients.quick-store',
                    'patients.edit',
                    'patients.delete',
                    'patients.archived',
                    'patients.restore',
                    'patients.force-delete',
                    'patients.print',
                    'patients.export',
                    'patients.statistics',
                ]),
                'description' => 'Administrative access with most permissions except system critical changes',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Manager',
                'slug' => 'manager',
                'permissions' => json_encode([
                    'dashboard.view',
                    'patients.view',
                    'patients.create',
                    'patients.edit',
                    'medical_conditions.view',
                    'allergies.view',
                    'reports.view',
                    'profile.view',
                    'profile.edit',
                ]),
                'description' => 'Management access focused on patient management and reporting',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Visitor',
                'slug' => 'visitor',
                'permissions' => json_encode([
                    'profile.view',
                    'profile.edit',
                    'dashboard.view',
                    'profile.complete',
                ]),
                'description' => 'Limited access user. Only dashboard and profile completion allowed.',
                'status' => 'active',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->insert($role);
        }
    }
}
