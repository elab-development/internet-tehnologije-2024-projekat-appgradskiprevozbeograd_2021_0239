<?php

namespace App\Http\Controllers;

use App\Http\Resources\VehicleResource;
use App\Http\Services\VehicleService;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VehicleController extends Controller
{
    protected VehicleService $vehicleService;

    public function __construct(VehicleService $vehicleService)
    {
        $this->vehicleService = $vehicleService;
    }
    public function getVehiclesOnLine($lineId){
        $vehicles = $this->vehicleService->getVehiclesForLine($lineId);
        return response()->json(['vehicles' => VehicleResource::collection($vehicles), 'message' => 'Vehicles founded successfully'], 200);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        $validator = Validator::make($request->all(), [
            'vehicle_code' => 'required|unique:vehicles',
            'line_id' => 'required|exists:lines,id',
            'active' => 'required|boolean'
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $vehicle = $this->vehicleService->addVehicle($request->all());
        return response()->json(['vehicle' => new VehicleResource($vehicle), 'message' => 'Vehicle added successfully'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show( $vehicleId)
    {
        $vehicle = $this->vehicleService->getVehicleById($vehicleId);
        if (!$vehicle) {
            return response()->json(['message' => 'Vehicle not found'], 404);
        }
        return response()->json(['vehicle' => new VehicleResource($vehicle), 'message' => 'Vehicle retrieved successfully'], 200);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicle $vehicle)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicle $vehicle)
    {
        $vehicle = $this->vehicleService->updateVehicle($vehicle, $request->toArray());
        return response()->json(['vehicle' => new VehicleResource($vehicle), 'message' => 'Vehicle updated successfully'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicle $vehicle)
    {
        $this->vehicleService->deleteVehicle($vehicle);
        return response()->json(['message' => 'Vehicle deleted successfully'], 200);

    }
}
