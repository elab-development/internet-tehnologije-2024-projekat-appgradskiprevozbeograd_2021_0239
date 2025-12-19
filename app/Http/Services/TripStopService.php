<?php

namespace App\Http\Services;

use App\Models\TripStop;
use Illuminate\Support\Collection;

class TripStopService
{

    public function addTripStop(array $tripStop):TripStop{
        return TripStop::create($tripStop);
    }
    public function updateTripStop(TripStop $tripStop,array $data):TripStop{
         $tripStop->update($data);
         return $tripStop;

    }
    public function deleteTripStop(TripStop $tripStop):bool{
        return $tripStop->delete();
    }
    public function getTripStopByid($id): ?TripStop{
        return TripStop::where('id', $id)->first();
    }
    public function getTripStopForStation($stationId):Collection
    {
        $tripStops=TripStop::where('station_id',$stationId)->paginate(10);
        return $tripStops;
    }
    public function getTripStopsForStationForCode($stationId, $lineCode = null, $upcomingOnly = false, $perPage = 10)
    {
        $query = TripStop::where('station_id', $stationId)
            ->with('trip.line');

        if ($lineCode) {
            $query->whereHas('trip.line', fn($q) => $q->where('code', $lineCode));
        }

        if ($upcomingOnly) {
            $query->where('scheduled_arrival', '>', now());
        }

        return $query->paginate($perPage);
    }


}
