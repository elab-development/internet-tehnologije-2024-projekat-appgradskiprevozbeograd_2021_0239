<?php

namespace Database\Seeders;

use App\Models\Line;
use App\Models\Trip;
use App\Models\TripStop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TripAndTripStopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lines = Line::all();

        foreach ($lines as $line) {
            $trip = Trip::create([
                'line_id' => $line->id,
                'service_date' => now()->toDateString(),
                'scheduled_start_time' => '08:00:00',
                'status' => 'scheduled',
            ]);

            $stations = $line->stations()->orderBy('line_station.stop_sequence')->get();
            $time = now()->copy()->setTime(8,0,0);

            foreach ($stations as $seq => $station) {
                TripStop::create([
                    'trip_id' => $trip->id,
                    'station_id' => $station->id,
                    'stop_sequence' => $seq + 1,
                    'scheduled_arrival' => $time->copy()->addMinutes($seq * 3),
                    'scheduled_departure' => $time->copy()->addMinutes($seq * 3)->addSeconds(30),
                ]);
            }
        }
    }
}
