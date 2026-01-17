<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // role create or get
        $role = Role::firstOrCreate([
            'name' => 'admin'
        ]);

        $permissions = [
            'Create Student',
            'Edit Student',
            'Delete Student',
        ];

        // permission create
        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission
            ]);
        }

        // sync permissions to role
        $role->syncPermissions($permissions);

        // assign role to first user
        $user = User::first();
        if ($user) {
            $user->assignRole('admin');
        }
    }
}
