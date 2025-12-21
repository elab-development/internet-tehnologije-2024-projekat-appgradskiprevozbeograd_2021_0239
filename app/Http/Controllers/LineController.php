<?php

namespace App\Http\Controllers;

use App\Http\Resources\LineResource;
use App\Http\Services\LineService;
use App\Models\Line;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use function PHPUnit\Framework\isEmpty;

class LineController extends Controller
{
    protected LineService $lineService;
    public function __construct(LineService $lineService){
        $this->lineService = $lineService;
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $lines=Line::all();
        return response()->json(["lines" => LineResource::collection($lines), 'message' => "Lines founded successfully"], 200);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator=Validator::make($request->all(),[
            'code'=>'required|unique:lines',
            'name'=>'required',
            'mode'=>'required',

        ]);
        if($validator->fails()){
            return response()->json($validator->errors(),400);

        }
        $line=$this->lineService->addLine($request->toArray());
        return response()->json(["line"=>new LineResource($line),'message'=>"Line added successfully"],201);
    }

    /**
     * Display the specified resource.
     */
    public function show($lineId)
    {
        $line = $this->lineService->getLineById($lineId);
        if (is_null($line)) {
            return response()->json(["message" => "Line not found"], 404);
        }

        $line->load(['stations' => function ($q) {
            $q->orderBy('line_station.stop_sequence');
        }]);

        return response()->json(["line" => new LineResource($line), 'message' => "Line founded successfully"], 200);
    }
    public function showLineByCode( $code)
    {
        $line=$this->lineService->getLineByCode($code);
        if (is_null($line)) {
            return response()->json(["message"=>"Line not found"],404);
        }
        return response()->json(["line"=>new LineResource($line),'message'=>"Line founded successfully"],200);
    }
    public function showLineByName( Request $request,string $name)
    {
        $perPage = (int) $request->query('per_page', 3);

        $paginator = $this->lineService->getLinesByName($name, $perPage);
        if ($paginator->isEmpty()) {
            return response()->json(["message"=>"Lines not found"],404);
        }


        return response()->json(['lines'=>$paginator,'message'=>"Lines founded successfully"],200);
    }
    public function showLinesByMode( $mode)
    {

        if (!in_array($mode,['bus','tram','trolley'])) {
            return response()->json(["message"=>"Invalid mode"],400);
        }
        $lines=$this->lineService->getLinesByMode($mode);
        if ($lines->isEmpty()) {
            return response()->json(["message"=>"Lines not found"],404);
        }
        return response()->json(["line"=> LineResource::collection($lines),'message'=>"Line founded successfully"],200);
    }
    public function showLineForStation($stationId)
    {

    }



    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Line $line)
    {

    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Line $line)
    {
        $lineEdited=$this->lineService->updateLine($line,$request->toArray());
        return response()->json(['line'=>new LineResource($lineEdited),'message'=>"Line was updated successfully "],200);

    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Line $line)
    {
        $deleted=$this->lineService->deleteLine($line);
        return response()->json(["line"=>$deleted,'message'=>"Line was deleted successfully"],200);
    }
}
