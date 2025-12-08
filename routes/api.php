<?php

<<<<<<< HEAD
=======
use App\Http\Controllers\Auth\AuthController;
>>>>>>> e4356dd (Dodata logika za registraciju i logovanje)
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
<<<<<<< HEAD
=======
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
>>>>>>> e4356dd (Dodata logika za registraciju i logovanje)
