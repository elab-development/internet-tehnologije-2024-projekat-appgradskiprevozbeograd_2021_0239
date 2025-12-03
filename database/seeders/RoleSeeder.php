<?php

namespace Database\Seeders;

use App\Models\Roles;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Roles::firstOrCreate(['name'=>'admin'], ['description'=>'Administrator']);
        Roles::firstOrCreate(['name'=>'operator'], ['description'=>'Operator / dispatcher']);
        Roles::firstOrCreate(['name'=>'user'], ['description'=>'Normal user']);
    }
}
