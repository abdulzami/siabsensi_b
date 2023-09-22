<?php

namespace App\Http\Controllers;

use App\Models\KartuRencanaStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\Matkul;
use App\Models\DosenAbsensi;
use Illuminate\Support\Facades\DB;

class AbsensiController extends Controller
{
    public function showAbsensiDosen(Request $request)
    {
        $request->validate([
            'nip' => 'required'
        ]);

        $nip = $request->nip;

        $dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $date = Carbon::now();
        $day = $dayNames[$date->dayOfWeek];
        $jam = $date->format('H:i:m');
        $tanggal = $date->format('Y-m-d');

        $matkul = Matkul::where('nip', $nip)->where('hari', $day)
            ->leftJoin('dosen_absensis', 'dosen_absensis.id_matkul', '=', 'matkuls.id')
            ->select(
                'matkuls.id',
                'matkuls.nama_matkul',
                'matkuls.mulai_jam',
                'matkuls.akhir_jam',
                'matkuls.jumlah_pertemuan',
                'matkuls.jurusan',
                'matkuls.nip',
                'dosen_absensis.id as id_masuk',
                'dosen_absensis.status',
                'dosen_absensis.jam_masuk'

            )
            ->get();

        if (count($matkul) != 0) {
            $response = [
                'message' => ['Get data success.', 'success'],
                'data' => $matkul
            ];
            return response($response, 200);
        } else {
            return response([
                'message' => ['No courses that you teach today.', 'info']
            ], 404);
        }
    }

    public function showAbsensiMahasiswa(Request $request)
    {
        // $request->validate([
        //     'nim' => 'required'
        // ]);

        // $nim = $request->nim;

        // $dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        // $date = Carbon::now();
        // $day = $dayNames[$date->dayOfWeek];

        // $matkul = KartuRencanaStudi::join('matkuls', 'kartu_rencana_studis.id_matkul', '=', 'matkuls.id')
        //     ->join('users', 'matkuls.nip', '=', 'users.nip')
        //     ->where('kartu_rencana_studis.nim', $nim)->where('matkuls.hari', $day)
        //     ->select('matkuls.id', 'matkuls.nama_matkul', 'users.name', 'matkuls.mulai_jam', 'matkuls.akhir_jam')
        //     ->get();

        // if (count($matkul) != 0) {
        //     $response = [
        //         'message' => ['Get data success.', 'success'],
        //         'data' => $matkul,
        //     ];
        //     return response($response, 200);
        // } else {
        //     return response([
        //         'message' => ['No courses today.', 'info']
        //     ], 404);
        // }
    }

    public function AbsensiDosen(Request $request)
    {
        $request->validate([
            'id_matkul' => 'required',
            'status' => 'required',
        ]);
        $date = Carbon::now();
        $jam = $date->format('H:i:m');
        $tanggal = $date->format('Y-m-d');

        $dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $day = $dayNames[$date->dayOfWeek];

        $mode = NULL;
        $deskripsi = NULL;
        $latitude = NULL;
        $longitude = NULL;

        $matkul = Matkul::where('id', $request->id_matkul)->first();
        $absensi_dosen = DosenAbsensi::where('id_matkul', $request->id_matkul)->where('tanggal_masuk', $tanggal)->first();

        if ($absensi_dosen) {
            return response()->json([
                'message' => ["This attendance already exists", 'error'],
            ], 406);
        } else {
            if ($matkul) {
                if ($matkul->jumlah_pertemuan > 0) {
                    if ($matkul->hari == $day) {
                        if ($request->status == "masuk") {
                            if ($request->mode == "tatap_muka") {
                                $request->validate([
                                    'mode' => 'required',
                                    'latitude' => 'required',
                                    'longitude' => 'required'
                                ]);
                                $mode = $request->mode;
                                $latitude = $request->latitude;
                                $latitude = $request->longitude;
                            } else if ($request->mode == "daring") {
                                $request->validate([
                                    'mode' => 'required'
                                ]);
                                $mode = $request->mode;
                            }
                        } else if ($request->status == "sakit") {
                            $request->validate([
                                'deskripsi' => 'required'
                            ]);
                            $deskripsi = $request->deskripsi;
                        } else if ($request->status == "izin") {
                            $request->validate([
                                'deskripsi' => 'required'
                            ]);
                            $deskripsi = $request->deskripsi;
                        } else {
                            return response()->json([
                                'message' => ['There is something wrong with the data entered.', 'error'],
                            ], 406);
                        }
                    } else {
                        return response()->json([
                            'message' => ["Can't attend today.", 'error'],
                        ], 406);
                    }
                } else {
                    return response()->json([
                        'message' => ["Number of meetings 0.", 'error'],
                    ], 406);
                }
            } else {
                return response()->json([
                    'message' => ['The courses does not exist.', 'error'],
                ], 406);
            }
        }
        $dosen_absensi = new DosenAbsensi();
        $dosen_absensi->id_matkul = $request->id_matkul;
        $dosen_absensi->mode = $mode;
        $dosen_absensi->status = $request->status;
        $dosen_absensi->jam_masuk = $jam;
        $dosen_absensi->tanggal_masuk = $tanggal;
        $dosen_absensi->deskripsi = $deskripsi;
        $dosen_absensi->latitude = $latitude;
        $dosen_absensi->longitude = $longitude;
        $dosen_absensi->save();

        if ($request->status == "masuk" || $request->status == "daring") {
            $affected = DB::update("update matkuls set jumlah_pertemuan = (jumlah_pertemuan - 1) where id = $request->id_matkul ");
            if ($affected) {
                return response()->json([
                    'message' => ['Successfull attendence and number of meetings of this course minus 1', 'success'],
                ], 200);
            } else {
                return response()->json([
                    'message' => ['Successfull attendence, the number of meetings of this course is error', 'success']
                ], 200);
            }
        } else {
            return response()->json([
                'message' => ['Successfull attendence, the number of meetings of this course is no less', 'success']
            ], 200);
        }
    }

    public function deleteAbsen($id)
    {
        $absensi = DosenAbsensi::where('id', $id)->first();

        if (!$absensi) {
            return response()->json([
                'message' => ['Nothing is deleted.', 'error'],
            ], 404);
        } else {

            $absensi->delete();
            return response()->json([
                'message' => ['Delete data success.', 'success'],
            ], 200);
        }
    }

    public function showAbsen()
    {
        $absensi = DosenAbsensi::all();
        $response = [
            'message' => ['Get data success.', 'success'],
            'data' => $absensi,
        ];
        return response($response, 200);
    }
}
