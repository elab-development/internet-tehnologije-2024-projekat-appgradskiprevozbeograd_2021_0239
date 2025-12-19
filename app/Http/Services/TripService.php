<?php

namespace App\Http\Services;

use App\Models\Trip;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class TripService
{
    public function addTrip(array $request):Trip
    {
        return Trip::create([
            'line_id'=>request('line_id'),
            'service_date'=>request('service_date'),
            'scheduled_start_time'=>request('scheduled_start_time'),
            'status'=>request('status')

        ]);
    }
    public function updateTrip(Trip $trip,array $data):Trip{
        $trip->update($data);
        return $trip;
    }
    public function deleteTrip(Trip $trip):bool{
        return $trip->delete();
    }
    public function getTrip($tripId):?Trip
    {
        return Trip::where('id',$tripId)->first();
    }
    public function getTripsForLineId($lineId):LengthAwarePaginator{
        return Trip::where('line_id',$lineId)
            ->paginate(5);
    }
    public function getTripsForStatus($status):Collection
    {
        return Trip::where('status',$status)->get();
    }

}
