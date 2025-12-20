<?php

namespace App\Http\Services;

use App\Models\Line;
use App\Models\Trip;
use App\Models\TripStop;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

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
    public function createTripWithStops(array $data): Trip
    {
        return DB::transaction(function () use ($data) {
            $trip = Trip::create([
                'line_id' => $data['line_id'],
                'service_date' => $data['service_date'],
                'scheduled_start_time' => $data['scheduled_start_time'],
                'status' => 'scheduled',
                'direction' => $data['direction'] ?? 'A',
            ]);

            $line = Line::findOrFail($data['line_id']);
            $lineStations = $line->stations()
                ->withPivot(['stop_sequence','distance_from_start'])
                ->wherePivot('direction', $data['direction'])
                ->orderBy('line_station.stop_sequence')
                ->get();

            $avgSpeedMPerS = 8.33; // primer: 30 km/h -> 8.33 m/s
            $startTime = Carbon::parse($data['scheduled_start_time']);

            foreach ($lineStations as $index => $station) {
                $distance = $station->pivot->distance_from_start ?? 0;
                $seconds = $avgSpeedMPerS > 0 ? (int)($distance / $avgSpeedMPerS) : 0;
                $scheduledArrival = $startTime->copy()->addSeconds($seconds);

                TripStop::create([
                    'trip_id' => $trip->id,
                    'station_id' => $station->id,
                    'stop_sequence' => $station->pivot->stop_sequence ?? ($index + 1),
                    'scheduled_arrival' => $scheduledArrival,
                    'scheduled_departure' => $scheduledArrival->copy()->addMinutes(0), // možeš dodati zadržavanje
                ]);
            }

            return $trip->load('tripStops');
        });
    }



}
