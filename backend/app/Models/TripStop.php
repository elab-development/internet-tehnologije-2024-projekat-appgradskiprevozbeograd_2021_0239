<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripStop extends Model
{
    use HasFactory;
    protected $fillable = ['trip_id', 'station_id', 'stop_sequence', 'scheduled_arrival', 'scheduled_departure'];

    public function station(){
        return $this->belongsTo(Station::class);
    }
    public function trip(){
        return $this->belongsTo(Trip::class);
    }
}
