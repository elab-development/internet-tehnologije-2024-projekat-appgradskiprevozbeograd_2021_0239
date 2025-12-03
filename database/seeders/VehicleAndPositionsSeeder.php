<?php

namespace Database\Seeders;

use App\Models\Line;
use App\Models\Vehicle;
use App\Models\VehiclePosition;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
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
            // preuzmi kao kolekciju radi lakšeg pristupa
            $stations = $line->stations; // Collection

            // fallback coordinates ako nema stanica
            $fallback1 = ['lat' => 44.81, 'lng' => 20.45];
            $fallback2 = ['lat' => 44.80, 'lng' => 20.44];

            for ($i = 1; $i <= 2; $i++) {
                $vehicle = Vehicle::create([
                    'vehicle_code' => strtoupper("BG-{$line->code}-{$i}"),
                    'line_id' => $line->id,
                    'active' => true,
                ]);

                // odredi koordinate na osnovu indeksa u kolekciji (sigurno pristupanje)
                if ($vehicle->id % 2) {
                    $refStation = $stations->first(); // vrati prvu ili null
                } else {
                    // želiš 4. element (index 3)
                    $refStation = $stations->count() > 3 ? $stations->get(3) : null;
                }

                $latitude = $refStation->latitude ?? $fallback1['lat'];
                $longitude = $refStation->longitude ?? $fallback1['lng'];

                // ako je druga grana i nema 4. stanice, koristi drugi fallback
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
