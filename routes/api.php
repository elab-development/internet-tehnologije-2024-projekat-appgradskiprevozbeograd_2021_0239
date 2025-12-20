<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\LineStationController;
use App\Http\Controllers\TripStopController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\VehiclePositionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Rute za ČITANJE (GET) koje su dozvoljene svim ulogama:
// 'auth:sanctum' osigurava da je korisnik ulogovan.
// 'role:admin,operator,user' osigurava da je uloga jedna od navedenih.
Route::middleware(['auth:sanctum','role:admin,operator,user'])->group(function () {

    // --- Linije (Lines) ---
    Route::get('/line/{lineId}', [\App\Http\Controllers\LineController::class, 'show']);
    Route::get('/line/code/{code}', [\App\Http\Controllers\LineController::class, 'showLineByCode']);
    Route::get('/line/name/{name}', [\App\Http\Controllers\LineController::class, 'showLineByName']);
    Route::get("/line/mode/{mode}", [\App\Http\Controllers\LineController::class, 'showLinesByMode']);

    // --- Stanice (Stations) ---
    Route::get("/station/{stationid}", [\App\Http\Controllers\StationController::class, 'show']);
    Route::get("/station/code/{code}", [\App\Http\Controllers\StationController::class, 'showByCode']);
    Route::get("/station/address/{address}", [\App\Http\Controllers\StationController::class, 'showByAddress']);
    Route::get("/station/name/{name}", [\App\Http\Controllers\StationController::class, 'showByName']);
    Route::get("/station/search/{search}", [\App\Http\Controllers\StationController::class, 'searchStations']);

    // --- Putovanja (Trips) ---
    Route::get("/trip/{tripId}", [\App\Http\Controllers\TripController::class, 'show']);
    Route::get("/trip/line/{lineId}", [\App\Http\Controllers\TripController::class, 'showTripsForLineId']);
    Route::get('/trip/status/{status}', [\App\Http\Controllers\TripController::class, 'showTripsForStatus']);

    // --- Stajališta na putovanju (TripStops) ---
    Route::get('/tripstop/{tripStopId}', [TripStopController::class, 'show']);
    Route::get('/tripstop/station/{stationId}/filter', [TripStopController::class, 'getTripStopsForStationForLine']);
    // Dodato iz Operator bloka
    Route::get('/tripstop/station/{stationId}', [TripStopController::class, 'getTripStopsForStation']);

    // --- Linije & Stanice (LineStation) ---
    Route::get('lines/{line}/stations', [LineStationController::class, 'index']);

    // --- Vozila (Vehicles) ---
    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::get('/vehicles/{vehicleId}', [VehicleController::class, 'show']);

    // --- Pozicije vozila (VehiclePositions) ---
    Route::get('/vehicle_positions/latest/{vehicleId}', [VehiclePositionController::class, 'latest']);
    Route::get('/vehicle_positions/vehicle/{vehicleId}', [VehiclePositionController::class, 'listForVehicle']);
    Route::get('/vehicle_positions/line/{lineId}', [VehiclePositionController::class, 'vehiclesOnLine']);

    // --- Korisnici (User) ---
    Route::get('/user/{userId}', [\App\Http\Controllers\UserController::class, 'show']);
});
Route::middleware(['auth:sanctum','role:admin,operator'])->group(function () {

    // --- Putovanja (Trips) ---
    Route::post("/trip/add-with-stops", [\App\Http\Controllers\TripController::class, 'storeWithStops']);
    Route::post("/trip/add", [\App\Http\Controllers\TripController::class, 'store']);
    Route::put("/trip/update/{trip}", [\App\Http\Controllers\TripController::class, 'update']);

    // --- Pozicije vozila (VehiclePositions) ---
    Route::post('/vehicle_positions', [VehiclePositionController::class, 'store']);
    Route::put('/vehicle_positions/{vehiclePosition}', [VehiclePositionController::class, 'update']);
});
// Rute za UPRAVLJANJE i BRISANJE koje su dozvoljene samo ulogama: admin
Route::middleware(['auth:sanctum','role:admin'])->group(function () {

    // --- Linije (Lines) ---
    Route::post('/line/add', [\App\Http\Controllers\LineController::class, 'store']);
    Route::put('/line/update/{line}', [\App\Http\Controllers\LineController::class, 'update']);
    Route::delete('/line/delete/{line}', [\App\Http\Controllers\LineController::class, 'destroy']);

    // --- Stanice (Stations) ---
    Route::post("/station/add", [\App\Http\Controllers\StationController::class, 'store']);
    Route::put("/station/update/{station}", [\App\Http\Controllers\StationController::class, 'update']);
    Route::delete("/station/delete/{station}", [\App\Http\Controllers\StationController::class, 'destroy']);

    // --- Putovanja (Trips) ---
    Route::delete("/trip/delete/{trip}", [\App\Http\Controllers\TripController::class, 'destroy']);

    // --- Stajališta na putovanju (TripStops) ---
    Route::post('/tripstop', [TripStopController::class, 'store']);
    Route::put('/tripstop/{tripStop}', [TripStopController::class, 'update']);
    Route::delete('/tripstop/{tripStop}', [TripStopController::class, 'destroy']);

    // --- Linije & Stanice (LineStation) ---
    Route::post('lines/{line}/stations', [LineStationController::class, 'store']);
    Route::patch('lines/{line}/stations/{station}', [LineStationController::class, 'update']);
    Route::delete('lines/{line}/stations/{station}', [LineStationController::class, 'destroy']);
    Route::post('lines/{line}/stations/reorder', [LineStationController::class, 'reorder']);

    // --- Vozila (Vehicles) ---
    Route::post('/vehicles', [VehicleController::class, 'store']);
    Route::put('/vehicles/{vehicle}', [VehicleController::class, 'update']);
    Route::delete('/vehicles/{vehicle}', [VehicleController::class, 'destroy']);

    // --- Pozicije vozila (VehiclePositions) ---
    Route::delete('/vehicle_positions/{vehiclePosition}', [VehiclePositionController::class, 'destroy']);
});
