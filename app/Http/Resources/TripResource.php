<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TripResource extends JsonResource
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
            'trip_stops' => TripStopResource::collection($this->tripStops),
            'line'=>new LineResource($this->line),
            'scheduled_start_time'=>$this->scheduled_start_time,
            'status'=>$this->status
        ];
    }
}
