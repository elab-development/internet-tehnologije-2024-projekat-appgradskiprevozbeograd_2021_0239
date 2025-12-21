<?php

namespace App\Http\Controllers;

use App\Http\Resources\StationResource;
use App\Http\Services\StationService;
use App\Models\Station;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class StationController extends Controller
{
    protected StationService $stationService;
    public function __construct(StationService $stationService){
        $this->stationService = $stationService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $all=Station::paginate(5);
        return response()->json(['data'=>StationResource::collection($all)],200);
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
            'name'=>'required',
            'latitude'=>'required|numeric',
            'longitude'=>'required|numeric',
            'stop_code'=>'required|numeric',
        ]);
        if($validator->fails()){
            return response()->json($validator->errors()->toJson(),400);
        }
        $station=$this->stationService->addStation($request->toArray());
        return response()->json(['station'=>new StationResource($station),'message'=>"Station added successfully"],201);
    }

    /**
     * Display the specified resource.
     */
    public function show($stationId)
    {
        $station=$this->stationService->getStationById($stationId);
        if(is_null($station)){
            return response()->json(["message"=>"Station not found"],404);
        }
        return response()->json(['station'=>new StationResource($station),'message'=>"Station finded successfully"],200);
    }


    public function showByAddress($address){
        $stations=$this->stationService->getStationByAdress($address);
        if($stations->isEmpty()){
            return response()->json(["message"=>"Station not found"],404);
        }
        return response()->json(['station'=> StationResource::collection($stations),'message'=>"Stations finded successfully"],200);
    }
    public function showByCode($code){
        $stations=$this->stationService->getStationsByStopCode($code,5);
        if($stations->isEmpty()){
            return response()->json(["message"=>"Station not found"],404);
        }
        return response()->json(['stations'=>StationResource::collection($stations),'message'=>"Stations finded successfully"],200);
    }
    public function showByName($name){
        $stations=$this->stationService->getStationsByName($name,5);
        if($stations->isEmpty()){
            return response()->json(["message"=>"Station not found"],404);
        }
        return response()->json(['stations'=>StationResource::collection($stations),'message'=>"Stations finded successfully"],200);
    }
    public function searchStations( $search){

        $stations=$this->stationService->searchStations($search,5);
        if($stations->isEmpty()){
            return response()->json(["message"=>"Station not found"],404);
        }
        return response()->json(['stations'=>StationResource::collection($stations),'message'=>"Stations founded successfully"],200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Station $station)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Station $station)
    {
        $station=$this->stationService->updateStation($station,$request->toArray());
        return response()->json(['station'=>new StationResource($station),'message'=>"Station added successfully"],201);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Station $station)
    {
        $station=$this->stationService->deleteStation($station);
        return response()->json(['message'=>"Station deleted successfully","status"=>true],200);
    }
}
