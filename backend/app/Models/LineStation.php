<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class LineStation extends Pivot//pivot model, spona izmedju linija i stanica, belongsToMany
{
    protected $table = 'line_station';//ime tabele
    protected $fillable = ['line_id', 'station_id', 'stop_sequence', 'direction', 'distance_from_start'];
}
