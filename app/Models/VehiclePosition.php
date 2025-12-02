<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VehiclePosition extends Model
{
    protected $fillable = ['vehicle_id', 'line_id', 'latitude', 'longitude', 'speed', 'bearing', 'timestamp'];

    public function vehicle(){
        return $this->belongsTo(Vehicle::class);

    }
    public function line(){
        return $this->belongsTo(Line::class);
    }
}
