<?php

namespace Database\Seeders;

use App\Models\Line;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehiclePosition;
use Illuminate\Database\Seeder;

class VehicleAndPositionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lines = Line::with('stations')->get(); // eager load stations

        foreach ($lines as $line) {

            // Odredi korisnika za vozila ove linije
            $user = User::where('role_id', 2)->inRandomOrder()->first();
            if (!$user) {
                $user = User::factory()->state(['role_id' => 2])->create();
            }

            $stations = $line->stations;
            $fallback1 = ['lat' => 44.81, 'lng' => 20.45];
            $fallback2 = ['lat' => 44.80, 'lng' => 20.44];

            for ($i = 1; $i <= 2; $i++) {
                $vehicle = Vehicle::create([
                    'vehicle_code' => strtoupper("BG-{$line->code}-{$i}"),
                    'line_id' => $line->id,
                    'active' => true,
                    'user_id' => $user->id, // sigurno postavljen
                ]);

                // Odredi referentnu stanicu
                if ($vehicle->id % 2) {
                    $refStation = $stations->first();
                } else {
                    $refStation = $stations->count() > 3 ? $stations->get(3) : null;
                }

                $latitude = $refStation->latitude ?? $fallback1['lat'];
                $longitude = $refStation->longitude ?? $fallback1['lng'];

                // Ako nema 4. stanice, koristi drugi fallback
                if (!($vehicle->id % 2) && is_null($refStation)) {
                    $latitude = $fallback2['lat'];
                    $longitude = $fallback2['lng'];
                }

                VehiclePosition::create([
                    'vehicle_id' => $vehicle->id,
                    'line_id' => $line->id,
                    'latitude' => $latitude,
                    'longitude' => $longitude,
                    'timestamp' => now(),
                ]);
            }
        }
    }
}
