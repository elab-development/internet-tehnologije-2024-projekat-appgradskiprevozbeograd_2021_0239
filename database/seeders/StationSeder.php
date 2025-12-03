<?php

namespace Database\Seeders;

use App\Models\Station;
use Database\Factories\StationFactory;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StationSeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $factory = new StationFactory();
        $reflection = new \ReflectionClass($factory);
        $prop = $reflection->getProperty('stations');
        $prop->setAccessible(true);
        $stations = $prop->getValue($factory);

        foreach ($stations as $s) {
            Station::firstOrCreate(['name' => $s['name']], $s);
        }

        Station::factory(20)->create();
    }
}
