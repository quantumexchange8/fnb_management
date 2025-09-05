<?php

namespace Database\Seeders\Tenant;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'dashboard',
        ];

        // Create permissions
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Create Super Admin role
        $superAdminRole = Role::firstOrCreate(['name' => 'superadmin']);

        $superAdminRole->syncPermissions(Permission::all());

        // Assign superadmin role to user ID 1
        $superAdmin = User::find(1);
        if ($superAdmin) {
            $superAdmin->assignRole($superAdminRole);
        }
    }
}
