<?php

namespace Database\Factories;

use App\Models\Vehicle;
use App\Models\VehiclePosition;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VehiclePosition>
 */
class VehiclePositionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = VehiclePosition::class;
    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(),
            'line_id' => null,
            'latitude' => $this->faker->latitude(44.7, 44.9),
            'longitude' => $this->faker->longitude(20.25, 20.65),
            'timestamp' => now(),
        ];
    }
}
