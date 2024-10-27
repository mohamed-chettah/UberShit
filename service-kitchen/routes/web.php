<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return view('test');
});

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

// Middleware 'auth.jwt' appliqué à ce groupe de routes
Route::middleware('auth.jwt')->group(function () {
    Route::get('user', [AuthController::class, 'getUser']);
});