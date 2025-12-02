<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Line extends Model
{
    protected $fillable = ['code','name','mode','color','active'];
    public function stations(){
        return $this->belongsTo(Station::class,'line_station')
            ->withPivot('stop_sequence','direction','distance_from_start')
            ->withTimestamps();
    }
    public function trips(){
        return $this->hasMany(Trip::class);
    }
    public function vehicles(){
        return $this->hasMany(Vehicle::class);
    }
}
