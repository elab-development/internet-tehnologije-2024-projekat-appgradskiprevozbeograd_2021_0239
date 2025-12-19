<?php


use App\Http\Controllers\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {
   Route::get('/user/{userId}', [\App\Http\Controllers\UserController::class, 'show']);
   //line routes
   Route::get('/line/code/{code}', [\App\Http\Controllers\LineController::class, 'showLineByCode']);
    Route::get('/line/{lineId}', [\App\Http\Controllers\LineController::class, 'show']);
    Route::get('/line/name/{name}', [\App\Http\Controllers\LineController::class, 'showLineByName']);
    Route::post('/line/add', [\App\Http\Controllers\LineController::class, 'store']);
    Route::put('/line/update/{line}', [\App\Http\Controllers\LineController::class, 'update']);
    Route::delete('/line/delete/{line}', [\App\Http\Controllers\LineController::class, 'destroy']);
    Route::get("/line/mode/{mode}", [\App\Http\Controllers\LineController::class, 'showLinesByMode']);
    //station rute
    Route::post("/station/add", [\App\Http\Controllers\StationController::class, 'store']);
    Route::put("/station/update/{station}", [\App\Http\Controllers\StationController::class, 'update']);
    Route::delete("/station/delete/{station}", [\App\Http\Controllers\StationController::class, 'destroy']);
    Route::get("/station/{stationid}", [\App\Http\Controllers\StationController::class, 'show']);
    Route::get("/station/code/{code}", [\App\Http\Controllers\StationController::class, 'showByCode']);
    Route::get("/station/address/{address}", [\App\Http\Controllers\StationController::class, 'showByAddress']);
    Route::get("/station/name/{name}", [\App\Http\Controllers\StationController::class, 'showByName']);
    Route::get("/station/search/{search}", [\App\Http\Controllers\StationController::class, 'searchStations']);
    //trip routes
    Route::post("/trip/add", [\App\Http\Controllers\TripController::class, 'store']);
    Route::put("/trip/update/{trip}", [\App\Http\Controllers\TripController::class, 'update']);
    Route::delete("/trip/delete/{trip}", [\App\Http\Controllers\TripController::class, 'destroy']);
    Route::get("/trip/{tripId}", [\App\Http\Controllers\TripController::class, 'show']);
    Route::get("/trip/line/{lineId}", [\App\Http\Controllers\TripController::class, 'showTripsForLineId']);
    Route::get('/trip/status/{status}', [\App\Http\Controllers\TripController::class, 'showTripsForStatus']);




});

