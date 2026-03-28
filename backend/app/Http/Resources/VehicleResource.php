<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'vehicle_code' => $this->vehicle_code,
            'line' => $this->line,
            'active' => $this->active,
            'positions'=>VehiclePositionResource::collection($this->positions),
            'user'=>new UserResource($this->user)
        ];
    }
}
