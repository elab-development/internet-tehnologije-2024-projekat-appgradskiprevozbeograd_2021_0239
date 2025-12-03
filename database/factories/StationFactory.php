<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Station;

class StationFactory extends Factory
{
    protected $model = Station::class;

    private $stations = [
        [
            'name' => 'Zeleni Venac',
            'latitude' => 44.81306,
            'longitude' => 20.45250,
            'address' => 'Zeleni Venac 6, Beograd'
        ],
        [
            'name' => 'Brankov Most',
            'latitude' => 44.8150,
            'longitude' => 20.4470,
            'address' => 'Brankova ulica 3, Beograd'
        ],
        [
            'name' => 'Blok 16',
            'latitude' => 44.816111,
            'longitude' => 20.436944,
            'address' => 'Bulevar Mihajla Pupina bb, Novi Beograd'
        ],
        [
            'name' => 'Španskih boraca',
            'latitude' => 44.81542,
            'longitude' => 20.419054,
            'address' => 'Španskih boraca 32, Novi Beograd'
        ],
        [
            'name' => 'Trg Slavija',
            'latitude' => 44.8172,
            'longitude' => 20.4745,
            'address' => 'Trg Slavija, Beograd'
        ],
        [
            'name' => 'Autokomanda',
            'latitude' => 44.7880,
            'longitude' => 20.4632,
            'address' => 'Bulevar oslobođenja 32, Beograd'
        ],
        [
            'name' => 'Voždovac',
            'latitude' => 44.7730,
            'longitude' => 20.4740,
            'address' => 'Vojvode Stepe 111, Voždovac'
        ],
        [
            'name' => 'Vukov Spomenik',
            'latitude' => 44.8217,
            'longitude' => 20.4623,
            'address' => 'Ruzveltova 43, Beograd'
        ],
        [
            'name' => 'Karaburma',
            'latitude' => 44.8291,
            'longitude' => 20.4680,
            'address' => 'Mirijevski bulevar 42, Karaburma'
        ],
        [
            'name' => 'Zemun - Novi Grad',
            'latitude' => 44.7925,
            'longitude' => 20.4269,
            'address' => 'Ugrinovačka 133, Zemun Novi Grad'
        ],
    ];

    public function definition(): array
    {
        $station = $this->faker->randomElement($this->stations);

        return [
            'name' => $station['name'],
            'latitude' => $station['latitude'],
            'longitude' => $station['longitude'],
            'address' => $station['address'],
            'zone' => $this->faker->numberBetween(1, 2),
            'stop_code' => $this->faker->unique()->numberBetween(1, 1000),
        ];
    }
}
