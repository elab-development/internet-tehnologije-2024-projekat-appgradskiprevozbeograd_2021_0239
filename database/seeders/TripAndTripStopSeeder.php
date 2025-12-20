<?php

namespace Database\Seeders;

use App\Models\Line;
use App\Models\Trip;
use App\Models\TripStop;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TripAndTripStopSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lines = Line::all();

        foreach ($lines as $line) {
            // Definišemo pravac, npr. 'A' za ovaj primer
            $direction = 'A';

            $trip = Trip::create([
                'line_id' => $line->id,
                'service_date' => now()->toDateString(),
                'scheduled_start_time' => '08:00:00',
                'status' => 'scheduled',
                'direction' => $direction,
            ]);

            // Dohvat stanica linije u tom pravcu
            $stations = $line->stations()
                ->withPivot(['stop_sequence', 'distance_from_start'])
                ->wherePivot('direction', $direction)
                ->orderBy('line_station.stop_sequence')
                ->get();

            $startTime = Carbon::parse($trip->scheduled_start_time);
            $avgSpeedMPerS = 8.33; // primer brzine vozila

            foreach ($stations as $station) {
                $distance = $station->pivot->distance_from_start ?? 0;
                $seconds = $avgSpeedMPerS > 0 ? (int)($distance / $avgSpeedMPerS) : 0;
                $scheduledArrival = $startTime->copy()->addSeconds($seconds);

                TripStop::create([
                    'trip_id' => $trip->id,
                    'station_id' => $station->id,
                    'stop_sequence' => $station->pivot->stop_sequence ?? 1,
                    'scheduled_arrival' => $scheduledArrival,
                    'scheduled_departure' => $scheduledArrival->copy()->addMinutes(0), // možeš dodati zadržavanje
                    'distance_from_start' => $distance,
                ]);
            }
        }
    }
}
