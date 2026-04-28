<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
  public function run(): void
  {
    // Get role IDs
    $superAdminRole = Role::where('slug', 'super-admin')->first();
    $adminRole = Role::where('slug', 'admin')->first();
    $managerRole = Role::where('slug', 'manager')->first();

    // Create Super Admin User
    $superAdmin = User::create([
      'uid' => 'ADMIN_SUPER_001',
      'name' => 'Super Administrator',
      'email' => 'superadmin@example.com',
      'phone_primary' => '+1234567890',
      'phone_secondary' => null,
      'blood_group' => 'O+',
      'date_of_birth' => '1985-01-15',
      'gender' => 'other',
      'email_verified_at' => now(),
      'password' => Hash::make('SuperAdmin@123'),
      'role_id' => $superAdminRole->id,
      'status' => 'active',
      'address_division' => 'Dhaka',
      'address_district' => 'Dhaka',
      'address_police_station' => 'Gulshan',
      'address_postal_code' => '1212',
      'address_details' => 'House #123, Road #45, Gulshan-2',
      'emergency_contact_name' => 'Jane Doe',
      'emergency_contact_phone' => '+1987654321',
      'emergency_contact_relation' => 'Spouse',
      'profile_completed' => true,
      'profile_completed_at' => now(),
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // Create Admin User
    $admin = User::create([
      'uid' => 'ADMIN_001',
      'name' => 'Admin User',
      'email' => 'admin@example.com',
      'phone_primary' => '+1234567891',
      'phone_secondary' => '+1234567892',
      'blood_group' => 'A+',
      'date_of_birth' => '1990-05-20',
      'gender' => 'male',
      'email_verified_at' => now(),
      'password' => Hash::make('Admin@123'),
      'role_id' => $adminRole->id,
      'status' => 'active',
      'address_division' => 'Chittagong',
      'address_district' => 'Chittagong',
      'address_police_station' => 'Khulshi',
      'address_postal_code' => '4219',
      'address_details' => 'Apartment 5B, Plaza Tower, Khulshi',
      'emergency_contact_name' => 'Sarah Admin',
      'emergency_contact_phone' => '+1987654322',
      'emergency_contact_relation' => 'Sister',
      'profile_completed' => true,
      'profile_completed_at' => now(),
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // Create Manager User
    $manager = User::create([
      'uid' => 'MGR_001',
      'name' => 'Manager User',
      'email' => 'manager@example.com',
      'phone_primary' => '+1234567893',
      'phone_secondary' => null,
      'blood_group' => 'B+',
      'date_of_birth' => '1988-11-10',
      'gender' => 'female',
      'email_verified_at' => now(),
      'password' => Hash::make('Manager@123'),
      'role_id' => $managerRole->id,
      'status' => 'active',
      'address_division' => 'Rajshahi',
      'address_district' => 'Rajshahi',
      'address_police_station' => 'Boalia',
      'address_postal_code' => '6100',
      'address_details' => '456/B, New Market Area',
      'emergency_contact_name' => 'Mike Manager',
      'emergency_contact_phone' => '+1987654323',
      'emergency_contact_relation' => 'Brother',
      'profile_completed' => true,
      'profile_completed_at' => now(),
      'created_at' => now(),
      'updated_at' => now(),
    ]);

    // Update created_by and updated_by for self-reference
    $superAdmin->update([
      'created_by' => $superAdmin->id,
      'updated_by' => $superAdmin->id,
    ]);

    $admin->update([
      'created_by' => $superAdmin->id,
      'updated_by' => $superAdmin->id,
    ]);

    $manager->update([
      'created_by' => $superAdmin->id,
      'updated_by' => $superAdmin->id,
    ]);

    // Insert password history for all users
    $users = [$superAdmin, $admin, $manager];

    foreach ($users as $user) {
      DB::table('user_password_history')->insert([
        'user_id' => $user->id,
        'password_hash' => Hash::make('123456789'), 
        'changed_at' => now(),
        'created_by' => $user->id,
        'created_at' => now(),
        'updated_at' => now(),
      ]);
    }
  }
}
