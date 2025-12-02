<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\=Station>
 */
class StationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Station::class;

    private $stations = [
        ['name' => 'Zeleni Venac', 'latitude' => 44.81306, 'longitude' => 20.45250],
        ['name' => 'Brankov Most', 'latitude' => 44.815, 'longitude' => 20.447],
        ['name' => 'Blok 16', 'latitude' => 44.816111, 'longitude' => 20.436944],
        ['name' => 'Španskih boraca', 'latitude' => 44.81542, 'longitude' => 20.419054],
        ['name' => 'Trg Slavija', 'latitude' => 44.8172, 'longitude' => 20.4745],
        ['name' => 'Autokomanda', 'latitude' => 44.7880, 'longitude' => 20.4632],
        ['name' => 'Voždovac', 'latitude' => 44.7730, 'longitude' => 20.4740],
        ['name' => 'Vukov Spomenik', 'latitude' => 44.8217, 'longitude' => 20.4623],
        ['name' => 'Karaburma', 'latitude' => 44.8291, 'longitude' => 20.4680],
        ['name' => 'Zemun - Novi Grad', 'latitude' => 44.7925, 'longitude' => 20.4269],
    ];

    public function definition(): array
    {
        $station = $this->faker->randomElement($this->stations);

        return [
            'name' => $station['name'],
            'latitude' => $station['latitude'],
            'longitude' => $station['longitude'],
            'address' => null,
            'zone' => null,
            'stop_code' => null,
        ];
    }
}
