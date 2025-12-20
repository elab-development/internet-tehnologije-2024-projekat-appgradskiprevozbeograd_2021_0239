<?php

namespace App\Http\Controllers;

use App\Http\Resources\VehiclePositionResource;
use App\Http\Resources\VehicleResource;
use App\Http\Services\VehiclePositionService;
use App\Models\VehiclePosition;
use Illuminate\Http\Request;

class VehiclePositionController extends Controller
{
    protected VehiclePositionService $positionService;

    public function __construct(VehiclePositionService $positionService)
    {
        $this->positionService = $positionService;
    }

    public function store(Request $request)
    {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'line_id' => 'required|exists:lines,id',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'timestamp' => 'required|date'
        ]);

        $position = $this->positionService->addPosition($request->toArray());
        return response()->json(['position' => new VehiclePositionResource($position), 'message' => 'Position added successfully'], 201);
    }

    public function show($positionId)
    {
        $position = VehiclePosition::find($positionId);
        if (!$position) {
            return response()->json(['message' => 'Position not found'], 404);
        }
        return response()->json(['position' => new VehiclePositionResource($position), 'message' => 'Position retrieved successfully'], 200);
    }

    public function update(Request $request, VehiclePosition $vehiclePosition)
    {
        $vehiclePosition = $this->positionService->updatePosition($vehiclePosition, $request->toArray());
        return response()->json(['position' => new VehiclePositionResource($vehiclePosition), 'message' => 'Position updated successfully'], 200);
    }

    public function destroy(VehiclePosition $vehiclePosition)
    {
        $this->positionService->deletePosition($vehiclePosition);
        return response()->json(['message' => 'Position deleted successfully'], 200);
    }

    public function latest($vehicleId)
    {
        $position = $this->positionService->getLatestPosition($vehicleId);
        return response()->json(['position' => new VehiclePositionResource($position), 'message' => 'Latest position retrieved successfully'], 200);
    }

    public function listForVehicle($vehicleId)
    {
        $positions = $this->positionService->getPositionsForVehicle($vehicleId);
        return response()->json(['positions' => VehiclePositionResource::collection($positions), 'message' => 'Positions retrieved successfully'], 200);
    }

    public function vehiclesOnLine($lineId)
    {
        $vehicles = $this->positionService->getVehiclesOnLine($lineId);
        return response()->json(['vehicles' => VehicleResource::collection($vehicles), 'message' => 'Vehicles on line retrieved successfully'], 200);
    }
}
