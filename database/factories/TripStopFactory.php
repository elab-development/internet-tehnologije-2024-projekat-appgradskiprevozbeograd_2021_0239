<?php

namespace Database\Factories;

use App\Models\Station;
use App\Models\Trip;
use App\Models\TripStop;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TripStop>
 */
class TripStopFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = TripStop::class;
    public function definition(): array
    {
        return [
            'trip_id' => Trip::factory(),
            'station_id' => Station::factory(),
            'stop_sequence' => $this->faker->numberBetween(1, 20),
            'scheduled_arrival' => $this->faker->time(),
            'scheduled_departure' => $this->faker->time(),
        ];
    }
}
