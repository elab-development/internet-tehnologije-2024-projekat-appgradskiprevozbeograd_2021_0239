<?php

namespace Database\Seeders;

use App\Models\Line;
use App\Models\Station;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Arr;

class LinesAndPivotSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lines = [
            '16' => 'Paviljoni – Karaburma 2',
            '23' => 'Vidikovac –  Karaburma 2',
            '33' => 'Kumodraz – Pancevacki most',
            '48' => 'Miljakovac 3 – Pancevacki most',
            '95' => 'Novi Beograd(Blok 45) – Borca 3',
        ];

        // Uzimamo sve stanice iz baze
        $allStations = Station::all()->pluck('id')->toArray();

        foreach ($lines as $code => $name) {
            $line = Line::firstOrCreate(['code' => $code], [
                'name' => $name,
                'mode' => 'bus',
                'color' => '#' . substr(md5($code), 0, 6),
                'active' => true,
            ]);

            if (count($allStations) < 10) {
                $more = Station::factory(20)->create()->pluck('id')->toArray();
                $allStations = array_merge($allStations, $more);
            }

            $chosen = (count($allStations) >= 10) ? Arr::random($allStations, 10) : $allStations;

            $attach = [];
            $seq = 1;
            foreach ($chosen as $sid) {
                $attach[$sid] = [
                    'stop_sequence' => $seq++,
                    'direction' => 'A',
                    'distance_from_start' => null,
                ];
            }
            $line->stations()->syncWithoutDetaching($attach);
        }
    }
}
