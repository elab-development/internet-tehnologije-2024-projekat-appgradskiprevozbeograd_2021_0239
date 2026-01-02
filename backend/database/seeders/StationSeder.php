<?php

namespace backend\database\seeders;

use App\Models\Station;
use Illuminate\Database\Seeder;

class StationSeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Station::factory(40)->create();
    }
}
