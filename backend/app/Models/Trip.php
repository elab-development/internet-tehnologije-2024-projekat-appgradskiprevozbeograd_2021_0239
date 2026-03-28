<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;
    protected $fillable = ['line_id', 'service_date', 'scheduled_start_time', 'status'];

    public function line(){
        return $this->belongsTo(Line::class);
    }
    public function tripStops(){
        return $this->hasMany(TripStop::class);
    }
}
