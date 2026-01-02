<?php

namespace App\Http\Services;

use App\Models\Vehicle;
use Illuminate\Support\Collection;

class VehicleService
{
    public function addVehicle(array $vehicle):Vehicle{
        return Vehicle::create($vehicle);
    }
    public function updateVehicle(Vehicle $vehicle,array $data):Vehicle{
        $vehicle->update($data);
        return $vehicle;
    }
    public function deleteVehicle(Vehicle $vehicle):bool{
        return $vehicle->delete();
    }
    public function getVehicleById( $id):?Vehicle
    {
        return Vehicle::where("id",$id)->first();
    }
    public function getVehiclesForLine($lineId):Collection{
        return Vehicle::where("line_id",$lineId)->get();
    }

}
