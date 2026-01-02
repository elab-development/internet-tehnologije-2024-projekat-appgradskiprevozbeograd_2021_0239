<?php

namespace App\Http\Controllers;

use App\Http\Resources\LineResource;
use App\Http\Resources\StationResource;
use App\Http\Services\LineStationService;
use App\Models\Line;
use App\Models\LineStation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LineStationController extends Controller
{
    protected LineStationService $service;

    public function __construct(LineStationService $service){
        $this->service = $service;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, Line $line)
    {
        $direction = $request->query('direction');
        $stations = $this->service->getStationsForLine($line, $direction);

        return response()->json(['stations' => StationResource::collection($stations)], 200);
    }
    public function showLinesForStation($stationId){
        $lines=$this->service->getLinesForStation($stationId);
        return response()->json(['lines' => LineResource::collection($lines)], 200);
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
    public function store(Request $request,Line $line)
    {
        $v = Validator::make($request->all(), [
            'station_id' => 'required|exists:stations,id',
            'stop_sequence' => 'required|integer|min:1',
            'direction' => 'required|string',
            'distance_from_start' => 'nullable|numeric|min:0'
        ]);

        if ($v->fails()) {
            return response()->json($v->errors(), 400);
        }

        $stationId = (int)$request->input('station_id');
        $direction = $request->input('direction');

        if ($this->service->isStationAttached($line, $stationId, $direction)) {
            return response()->json(['message' => 'Station already attached for this direction'], 409);
        }

        $this->service->attachStationToLine($line, $stationId, $request->only([
            'stop_sequence', 'direction', 'distance_from_start'
        ]));

        return response()->json(['message' => 'Station attached to line'], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(LineStation $lineStation)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(LineStation $lineStation)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Line $line, $stationId)
    {
        $v = Validator::make($request->all(), [
            'stop_sequence' => 'nullable|integer|min:1',
            'direction' => 'nullable|string',
            'distance_from_start' => 'nullable|numeric|min:0'
        ]);

        if ($v->fails()) {
            return response()->json($v->errors(), 400);
        }

        if (! $this->service->isStationAttached($line, (int)$stationId)) {
            return response()->json(['message' => 'Station not attached to this line'], 404);
        }

        $updated = $this->service->updatePivot($line, (int)$stationId, $request->only([
            'stop_sequence', 'direction', 'distance_from_start'
        ]));

        if ($updated === false) {
            return response()->json(['message' => 'Pivot update failed'], 500);
        }

        return response()->json(['message' => 'Pivot updated'], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Line $line, $stationId)
    {
        if (! $this->service->isStationAttached($line, (int)$stationId)) {
            return response()->json(['message' => 'Station not attached to this line'], 404);
        }

        $this->service->detachStationFromLine($line, (int)$stationId);

        return response()->json(['message' => 'Station detached from line'], 200);
    }
    public function reorder(Request $request, Line $line)
    {
        $v = Validator::make($request->all(), [
            'order' => 'required|array|min:1',
            'order.*.station_id' => 'required|integer|exists:stations,id',
            'order.*.stop_sequence' => 'required|integer|min:1',
        ]);

        if ($v->fails()) {
            return response()->json($v->errors(), 400);
        }

        $this->service->reorderStations($line, $request->input('order'));

        return response()->json(['message' => 'Stations reordered'], 200);
    }
}
