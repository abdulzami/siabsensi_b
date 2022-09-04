<?php

use App\Http\Controllers\AbsensiController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MahasiswaController;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\KartuRencanaStudiController;
use App\Http\Controllers\MatkulController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });
Route::group(['middleware' => 'auth:sanctum'], function(){
    Route::post("logout",[UserController::class,'logout']);
    Route::apiResource('mahasiswa',MahasiswaController::class);
    Route::apiResource('dosen',DosenController::class);
    Route::apiResource('matkul',MatkulController::class);
    Route::apiResource('krs',KartuRencanaStudiController::class);
    Route::post('absensi-dosen',[AbsensiController::class,'showAbsensiDosen']);
    Route::post('dosen-absen',[AbsensiController::class,'AbsensiDosen']);
    Route::get('dev-absensi',[AbsensiController::class,'showAbsen']);
    Route::delete('dev-del-absensi/{id}',[AbsensiController::class,'deleteAbsen']);
    // Route::post('absensi-mahasiswa',[AbsensiController::class,'showAbsensiMahasiswa']);
});

Route::post("login",[UserController::class,'login']);