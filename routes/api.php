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
   Route::get('/line/code/{code}', [\App\Http\Controllers\LineController::class, 'showLineByCode']);
    Route::get('/line/{lineId}', [\App\Http\Controllers\LineController::class, 'show']);
    Route::get('/line/name/{name}', [\App\Http\Controllers\LineController::class, 'showLineByName']);
    Route::post('/line/add', [\App\Http\Controllers\LineController::class, 'store']);
    Route::put('/line/update/{line}', [\App\Http\Controllers\LineController::class, 'update']);
    Route::delete('/line/delete/{line}', [\App\Http\Controllers\LineController::class, 'destroy']);
    Route::get("/line/mode/{mode}", [\App\Http\Controllers\LineController::class, 'showLinesByMode']);
});

