<?php

namespace App\Http\Controllers;

use App\Http\Resources\TripStopResource;
use App\Http\Services\StationService;
use App\Http\Services\TripStopService;
use App\Models\TripStop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class TripStopController extends Controller
{

    protected TripStopService $tripStopService;
    protected StationService $stationService;
    public function __construct(TripStopService $tripStopService){
        $this->tripStopService = $tripStopService;
        $this->stationService = new StationService();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'trip_id' => 'required',
            'station_id' => 'required',
            'scheduled_arrival' => 'required',
            'sequence' => 'required',

        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }
        $tripStop=$this->tripStopService->addTripStop($request->toArray());
        return response()->json(['tripStop'=>new TripStopResource($tripStop)],201);

    }


    /**
     * Display the specified resource.
     */
    public function show( $tripStopId)
    {
        $tripStop=$this->tripStopService->getTripStopById($tripStopId);
        return response()->json(['tripStop'=>new TripStopResource($tripStop)],200);
    }

    protected function getTripStopsForStation($stationId)
    {
        $station=$this->stationService->getStationById($stationId);
        if (is_null($station)){
            return response()->json(['error'=>'Station does not exist.'],404);
        }
        $tripStops=$this->tripStopService->getTripStopForStation($stationId);
        return response()->json(['tripStops'=> TripStopResource::collection($tripStops),"message"=>"Trip stops fetched successfully"],200);
    }
    public function getTripStopsForStationForLine(Request $request, $stationId)
    {
        $station=$this->stationService->getStationById($stationId);
        if (is_null($station)){
            return response()->json(['error'=>'Station does not exist.'],404);
        }
        $lineCode = $request->query('line_code');
        $upcomingOnly = $request->query('upcoming');
        $perPage = $request->query('per_page', 10);

        $tripStops = $this->tripStopService->getTripStopsForStationForCode($stationId, $lineCode, $upcomingOnly, $perPage);


        return response()->json([
            'trip_stops' => TripStopResource::collection($tripStops),
            'message' => 'Trip stops fetched successfully'
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(TripStop $tripStop)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, TripStop $tripStop)
    {
        $updated=$this->tripStopService->updateTripStop($tripStop,$request->toArray());
        return response()->json(['tripStop'=>new TripStopResource($updated),"message"=>'Trip stop updated successfully'],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TripStop $tripStop)
    {
        $deleted= $this->tripStopService->deleteTripStop($tripStop);
        return response()->json(['tripStop'=>$deleted,"message"=>"Trip stop  deleted successfully"],200);
    }
}
