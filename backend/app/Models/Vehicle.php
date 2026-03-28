<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;
    protected $fillable = ['vehicle_code','user_id','line_id','active'];
    public function line(){
        return $this->belongsTo(Line::class);
    }
    public function positions(){
        return $this->hasMany(VehiclePosition::class);
    }
    public function user(){
        return $this->belongsTo(User::class);
    }

}
