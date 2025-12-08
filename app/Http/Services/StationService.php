<?php

namespace App\Http\Services;

use App\Models\Line;
use App\Models\Station;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class StationService
{

    public function addStation(array $station)
    {
        $station=Station::create([
            'name'=>$station['name'],
            'address'=>$station['address']?? null,
            'latitude'=>$station['latitude'],
            'longitude'=>$station['longitude'],
            'zone'=>$station['zone']??null,
            'stop_code'=>$station['stop_code'],
        ]);
        return $station;
    }
    public function getStationById($id):?Station{
        return Station::where('id',$id)->first();
    }
    public function getStationsByStopCode($code,int $perPage):LengthAwarePaginator{
        $search=$code;
        $query=Station::query();
        if($search!==''){
            $query->whereRaw('LOWER(stop_code) LIKE ?', [ mb_strtolower($search) . '%']);
        }
        return $query->paginate($perPage);
    }
    public function getStationByAdress($address):Collection{
        return Station::whereRaw('LOWER(address) LIKE ?', ['%' . mb_strtolower($address) . '%'])
            ->get();
    }
    public function getStationsByName($name,int $perPage):LengthAwarePaginator{
        $search=trim(preg_replace('/\s+/', ' ', $name));
        $query=Station::query();
        if($search!==''){
            $query->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($search) . '%']);
        }
        return $query->paginate($perPage);
    }
    public function updateStation(Station $station, array $data):Station{
         $station->update($data);
         return $station;
    }
    public function deleteStation(Station $station):bool{
        return $station->delete();
    }
    public function searchStations(string $search,int $perPage):LengthAwarePaginator{
        $search=trim(preg_replace('/\s+/', ' ', $search));
        $query=Station::query();
        if($search!==''){
            $query->whereRaw('LOWER(stop_code) LIKE ?', [ mb_strtolower($search) . '%'])
            ->orWhereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($search) . '%']);
        }
        return $query->paginate($perPage);
    }
}
