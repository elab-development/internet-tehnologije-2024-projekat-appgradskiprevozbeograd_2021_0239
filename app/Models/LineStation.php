<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class LineStation extends Pivot
{
    protected $table = 'line_stations';
    protected $fillable = ['line_id', 'station_id', 'stop_sequence', 'direction', 'distance_from_start'];
}
