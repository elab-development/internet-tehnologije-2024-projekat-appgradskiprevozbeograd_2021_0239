<?php

namespace Database\Seeders;

use App\Models\Roles;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $adminRole = Roles::where('name','admin')->first();
        $operatorRole = Roles::where('name','operator')->first();
        $userRole = Roles::where('name','user')->first();

        User::firstOrCreate(['email'=>'admin@example.com'], [
            'name' => 'Admin',
            'password' => \Hash::make('password'),
            'role_id' => $adminRole->id,
            'email_verified_at' => now(),
        ]);

        User::factory(20)->create(['role_id' => $operatorRole->id]);
        User::factory(50)->create(['role_id' => $userRole->id]);
    }
}
