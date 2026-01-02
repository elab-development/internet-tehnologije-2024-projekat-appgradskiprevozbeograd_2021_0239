<?php

namespace Database\Factories;

use App\Models\Line;
use App\Models\Trip;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Trip>
 */
class TripFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Trip::class;
    public function definition(): array
    {
        return [
            'line_id' => Line::factory(),
            'service_date' => $this->faker->dateTimeThisYear,
            'scheduled_start_time' => $this->faker->time(),
            'status' => $this->faker->randomElement(['scheduled', 'active', 'completed']),
        ];
    }
}
