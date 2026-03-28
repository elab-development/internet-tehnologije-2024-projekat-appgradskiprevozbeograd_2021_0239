<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LineResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $stations = $this->whenLoaded('stations')
            ? $this->stations->sortBy(function ($s) {
                return $s->pivot->stop_sequence ?? 0;
            })->values()
            : null;

        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'mode' => $this->mode,
            'color' => $this->color,
            'active' => $this->active,
            'stations' => $stations ? StationResource::collection($stations) : null,
        ];  }
}
