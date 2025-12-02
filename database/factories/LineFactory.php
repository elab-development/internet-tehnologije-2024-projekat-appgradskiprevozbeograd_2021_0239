<?php

namespace Database\Factories;

use App\Models\Line;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Line>
 */
class LineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model=Line::class;
    public function definition(): array
    {

        return [
            'code' => $this->faker->unique()->numberBetween(1, 200),
            'name' => 'Linija ' . $this->faker->unique()->numberBetween(1, 200),
            'mode' => $this->faker->randomElement(['bus','tram','trolley']),
            'color' => '#'.substr($this->faker->hexcolor, 1),
            'active' => true,
        ];
    }
}
