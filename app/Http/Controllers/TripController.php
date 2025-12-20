<?php

namespace App\Http\Controllers;

use App\Http\Resources\TripResource;
use App\Http\Services\LineService;
use App\Http\Services\TripService;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use function PHPUnit\Framework\isNull;

class TripController extends Controller
{
    protected TripService $tripService;
    protected LineService $lineService;
    public function __construct(TripService $tripService,LineService $lineService){
        $this->tripService = $tripService;
        $this->lineService = new LineService();
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $trips=Trip::all();
        return response()->json(["trips"=>TripResource::collection($trips)],200);
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
            'line_id'=>'required',
            'service_date'=>'required|date',
            'scheduled_start_time'=>'required',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);
        }
        $trip=$this->tripService->addTrip($request->toArray());
        return response()->json(["trip"=>new TripResource($trip),"message"=>"Trip added successfully"],201);

    }

    /**
     * Display the specified resource.
     */
    public function show( $tripId)
    {
        $trip=$this->tripService->getTrip($tripId);
        if (is_null($trip)) {
            return response()->json(["message"=>"Trip not found"],404);
        }
        return response()->json(["trip"=>new TripResource($trip),'message'=>"Trip founded successfully"],200);
    }
    public function showTripsForLineId( $lineId){
        $line=$this->lineService->getLineById($lineId);
        if(is_null($line)){
            return response()->json(["message"=>"Line not exist"],404);
        }
        $trips=$this->tripService->getTripsForLineId($lineId);
        if($trips->isEmpty()){
            return response()->json(["message"=>"No trips found for this line"],404);
        }
        return response()->json(["trips"=>TripResource::collection($trips),'message'=>"Trips founded successfully"],200);

    }
    public function showTripsForStatus( $status){

        if (!in_array($status,['scheduled','active','finished','cancelled'])){
            return response()->json(["message"=>"Invalid status of trip"],400);
        }
        $trips=$this->tripService->getTripsForStatus($status);
        if($trips->isEmpty()){
            return response()->json(["message"=>"No trips found for this status"],404);
        }
        return response()->json(["trips"=>TripResource::collection($trips),'message'=>"Trips founded successfully"],200);

    }


    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Trip $trip)
    {
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Trip $trip)
    {
        $trip=$this->tripService->updateTrip($trip,$request->toArray());
        return response()->json(["trip"=>new TripResource($trip),"message"=>"Trip updated successfully"],200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Trip $trip)
    {
        $deleted=$this->tripService->deleteTrip($trip);
        return response()->json(["message"=>"Trip deleted successfully"],200);
    }
    public function storeWithStops(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'line_id' => 'required|exists:lines,id',
            'service_date' => 'required|date',
            'scheduled_start_time' => 'required',
            'direction' => 'nullable|in:A,B', // opcionalno, default A
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $trip = $this->tripService->createTripWithStops($request->all());

        return response()->json([
            'trip' => $trip, // možeš koristiti TripResource ako želiš
            'message' => 'Trip with stops created successfully'
        ], 201);
    }

}
