<?php

namespace App\Http\Services;

use App\Models\Vehicle;
use App\Models\VehiclePosition;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Collection;

class VehiclePositionService
{
    public function addPosition(array $request): VehiclePosition
    {
        return VehiclePosition::create($request);
    }
    public function updatePosition(VehiclePosition $vehicle,array $data): VehiclePosition{
        $vehicle->update($data);
        return $vehicle;
    }
    public function deletePosition(VehiclePosition $vehicle): bool{
        return $vehicle->delete();
    }
    public function getLatestPosition($vehicleId): VehiclePosition
    {
        return VehiclePosition::where("vehicle_id",$vehicleId)->first();
    }
    public function getPositionsForVehicle($vehicleId):Collection{
        return VehiclePosition::where("vehicle_id",$vehicleId)->get();
    }

}
