<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // pivot polja su dostupna samo ako je station učitan kroz belongsToMany relaciju
        $pivot = $this->when(
            isset($this->pivot),
            function () {
                return [
                    'stop_sequence' => $this->pivot->stop_sequence ?? null,
                    'direction' => $this->pivot->direction ?? null,
                    'distance_from_start' => $this->pivot->distance_from_start ?? null,
                ];
            },
            null
        );

        // Ako je učitana relacija 'lines', prikazujemo i njih (sa minimalnim podacima da se ne bi ušlo u rekurziju)
        $lines = $this->whenLoaded('lines')
            ? $this->lines->map(function ($line) {
                return [
                    'id' => $line->id,
                    'code' => $line->code,
                    'name' => $line->name,
                    // pivot polja za line <-> station
                    'stop_sequence' => $line->pivot->stop_sequence ?? null,
                    'direction' => $line->pivot->direction ?? null,
                    'distance_from_start' => $line->pivot->distance_from_start ?? null,
                ];
            })
            : null;

        return [
            'id' => $this->id,
            'name' => $this->name,
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'address' => $this->address,
            'zone' => $this->zone,
            'stop_code' => $this->stop_code,
            'pivot' => $pivot,
            'lines' => $lines,
        ];
    }
}
