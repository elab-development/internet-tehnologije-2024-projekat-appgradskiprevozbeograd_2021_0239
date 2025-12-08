<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TripResoource extends JsonResource
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
            'trip_stops' => TripStopResource::collection($this->stops),
            'stop_sequence' => $this->stop_sequence,
            'eta' => $this->eta,
            'actual_arrival' => $this->actual_arrival,
        ];
    }
}
