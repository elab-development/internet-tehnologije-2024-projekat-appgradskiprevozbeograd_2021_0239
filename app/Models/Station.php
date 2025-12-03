<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

class Station extends Model
{
    use HasFactory;
    protected $fillable = ['name', 'address', 'latitude', 'longitude', 'zone', 'stop_code'];

    public function lines()
    {
        return $this->belongsToMany(Line::class, 'line_station')
            ->withPivot('stop_sequence', 'direction', 'distance_from_start')
            ->withTimestamps();
    }
    public function tripStops(){
        return $this->hasMany(TripStop::class);
    }
}
