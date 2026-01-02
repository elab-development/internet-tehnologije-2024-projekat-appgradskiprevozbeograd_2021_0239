<?php

namespace Database\Factories;

use App\Models\Line;
use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Vehicle::class;

    public function definition(): array
    {
        return [
            'vehicle_code' => strtoupper($this->faker->bothify('BG-###')),
            'line_id' => Line::factory(),
            'active' => true,
            'user_id' => function () {
                $user = User::where('role_id', 2)->inRandomOrder()->first();
                return $user ? $user->id : User::factory()->state(['role_id' => 2])->create()->id;
            },
        ];
    }
}
