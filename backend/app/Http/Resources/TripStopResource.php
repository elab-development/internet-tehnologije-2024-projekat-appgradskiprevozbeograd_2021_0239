<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TripStopResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'=>$this->id,
            'station'=>new StationResource($this->station),
            'stop_sequnce'=>$this->stop_sequence,
            'scheduled_arrival'=>$this->scheduled_arrival,
            'scheduled_departure'=>$this->scheduled_departure
        ];
    }
}
