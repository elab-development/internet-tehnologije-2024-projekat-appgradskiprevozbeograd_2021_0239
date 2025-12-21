<?php

namespace App\Http\Services;

use App\Models\Line;
use App\Models\Station;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class LineStationService
{

    public function attachStationToLine(Line $line, int $stationId, array $data): void
    {
        $line->stations()->attach($stationId, [
            'stop_sequence' => $data['stop_sequence'] ?? null,
            'direction' => $data['direction'] ?? null,
            'distance_from_start' => $data['distance_from_start'] ?? null,
        ]);
    }


    public function updatePivot(Line $line, int $stationId, array $data): bool
    {
        return $line->stations()->updateExistingPivot($stationId, [
            'stop_sequence' => $data['stop_sequence'] ?? null,
            'direction' => $data['direction'] ?? null,
            'distance_from_start' => $data['distance_from_start'] ?? null,
        ]);
    }


    public function detachStationFromLine(Line $line, int $stationId): void
    {
        $line->stations()->detach($stationId);
    }


    public function reorderStations(Line $line, array $stationOrder): void
    {
        DB::transaction(function () use ($line, $stationOrder) {
            foreach ($stationOrder as $item) {
                $stationId = (int) ($item['station_id'] ?? 0);
                $sequence = $item['stop_sequence'] ?? null;
                if ($stationId && $sequence !== null) {
                    $line->stations()->updateExistingPivot($stationId, [
                        'stop_sequence' => $sequence
                    ]);
                }
            }
        });
    }


    public function getStationsForLine(Line $line, ?string $direction = null)
    {
        $query = $line->stations()->withPivot(['stop_sequence', 'direction', 'distance_from_start']);

        if ($direction !== null) {
            $query->wherePivot('direction', $direction);
        }

        return $query->orderBy('line_stations.stop_sequence')->get();
    }


    public function getLinesForStation(int $stationId): Collection
    {
        $station = Station::findOrFail($stationId);
        return $station->lines()->withPivot(['stop_sequence', 'direction', 'distance_from_start'])->get();
    }


    public function isStationAttached(Line $line, int $stationId, ?string $direction = null): bool
    {
        $query = $line->stations()->where('stations.id', $stationId);
        if ($direction !== null) {
            $query->wherePivot('direction', $direction);
        }
        return $query->exists();
    }
}
