<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Testing\Fluent\Concerns\Has;

class Station extends Model//Eloquent, jedna stanica gradskog prevoza
{
    use HasFactory;
    protected $fillable = ['name', 'address', 'latitude', 'longitude', 'zone', 'stop_code'];


    //veza stationa i line, jedna stanica pripada vise linija, linija ima redosled stanica
    public function lines()
    {
        return $this->belongsToMany(Line::class, 'line_station')
            ->using(LineStation::class)

            ->withPivot('stop_sequence', 'direction', 'distance_from_start')
            ->withTimestamps();
    }

    //veza sa podacima iz tripstops
    public function tripStops(){
        return $this->hasMany(TripStop::class);
    }
}
