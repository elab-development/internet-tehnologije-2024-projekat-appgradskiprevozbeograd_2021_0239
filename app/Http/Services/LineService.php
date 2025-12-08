<?php

namespace App\Http\Services;


use App\Models\Line;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

class LineService
{

    public function addLine(array $request):Line
    {
        return Line::create(
            [
                'code'=>$request['code'],
                'name'=>$request['name'],
                'mode'=>$request['mode'],
                'color'=>$request['color'],
                'active'=>$request['active']
            ]
        );
    }
    public function updateLine(Line $line,array $data):Line{
         $line->update($data);
         return $line;
    }
    public function deleteLine(Line $line):bool{
        return $line->delete();
    }
    public function getLineById( $lineId):?Line{
        return Line::where('id',$lineId)->first();
    }
    public function getLineByCode( $lineCode):?Line{
        return Line::where('code',$lineCode)->first();

    }
    public function getLinesByName( $lineName,int $perPage=3): LengthAwarePaginator
    {
        $search=trim(preg_replace('/\s+/', ' ', $lineName));
        $query=Line::query();
        if($search!==''){
            $query->whereRaw('LOWER(name) LIKE ?', ['%' . mb_strtolower($search) . '%']);
        }
       return $query->paginate($perPage);
    }
    public function getLinesByMode( $lineMode):Collection{
        return Line::where('mode',$lineMode)->get();
    }

}
