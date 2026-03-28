<?php

namespace App\Models;//sta je namespace u php-u

use Illuminate\Database\Eloquent\Factories\HasFactory;//sta su factorys
use Illuminate\Database\Eloquent\Model;

class Line extends Model //Eloquent model(proveri sta je to)
{
    use HasFactory; //omogucava nam da pravimo tst podatke tipa Line::factory()->create()
    //Korisno jer stiti od mass asignmenta dozvoljava da se samo ovi atributi mogu setovati,
    //ako damo nesto sto nije tu laravel ignorise ili baca gresku
    protected $fillable = ['code','name','mode','color','active'];

    //predstavlja funkciju koja govori da jedna linija ima vise stanica, i jedna stanica ima vise linija
    //pivot tabela koja ih spaja line_station
    public function stations(){
        return $this->belongsToMany(Station::class,'line_station')
            ->using(\App\Models\LineStation::class)
            ->withPivot('stop_sequence','direction','distance_from_start')//kolone u pivotu
            ->withTimestamps();//created i updated at
    }

    //jedna linija ima vise polazaka tripova, trips ima line_id kolonu, objekat linija lista tripova
    public function trips(){
        return $this->hasMany(Trip::class);
    }

    //jedna linija ima vise vozila, vehicles ima line_id kolonu, linija ima listu voizla
    public function vehicles(){
        return $this->hasMany(Vehicle::class);
    }
}
