<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\KartuRencanaStudi;
use App\Models\Matkul;
use App\Models\User;
use Illuminate\Database\QueryException;
use Error;

class KartuRencanaStudiController extends Controller
{
    public function index()
    {
        $krs = KartuRencanaStudi::join('users', 'users.nim', '=', 'kartu_rencana_studis.nim')
            ->join('matkuls', 'matkuls.id', '=', 'kartu_rencana_studis.id_matkul')
            ->select(
                'kartu_rencana_studis.id',
                'kartu_rencana_studis.nim',
                'users.name',
                'kartu_rencana_studis.id_matkul',
                'matkuls.nama_matkul',
                'matkuls.mulai_jam',
                'matkuls.akhir_jam',
                'matkuls.hari'
            )
            ->get();

        if (count($krs) == 0) {
            return response([
                'message' => ['No data on database.', 'info']
            ], 404);
        } else {
            $response = [
                'message' => ['Get data success.', 'success'],
                'data' => $krs
            ];
            return response($response, 200);
        }
    }

    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $request->validate([
            'nim' => 'required',
            'id_matkul' => 'required'
        ]);

        try {
            $krs = new KartuRencanaStudi();

            $krs->nim = $request->nim;
            $krs->id_matkul = $request->id_matkul;

            $mahasiswa = User::where('nim', $request->nim)->first();
            $matkul = Matkul::where('id', $request->id_matkul)->first();

            $krs_exist = KartuRencanaStudi::where('nim', $request->nim)->where('id_matkul', $request->id_matkul)->first();

            $onMatkul = Matkul::where('id', $request->id_matkul)->select('mulai_jam', 'akhir_jam', 'hari')->first();
            if ($onMatkul) {
                $mulai = $onMatkul->mulai_jam;
                $akhir = $onMatkul->akhir_jam;
                $hari = $onMatkul->hari;
            } else {
                return response()->json([
                    'message' => ['The courses does not exist', 'error'],
                ], 406);
            }


            $joiningtomatkul_akhir = KartuRencanaStudi::join('matkuls', 'kartu_rencana_studis.id_matkul', '=', 'matkuls.id')
                ->where('kartu_rencana_studis.nim', $request->nim)
                ->where('hari', $hari)
                ->whereRaw("'$akhir' BETWEEN matkuls.mulai_jam AND matkuls.akhir_jam");

            $cek_overlaps = KartuRencanaStudi::join('matkuls', 'kartu_rencana_studis.id_matkul', '=', 'matkuls.id')
                ->where('kartu_rencana_studis.nim', $request->nim)
                ->where('hari', $hari)
                ->whereRaw("'$mulai' BETWEEN matkuls.mulai_jam AND matkuls.akhir_jam")
                ->union($joiningtomatkul_akhir)->get();

            if ($mahasiswa) {
                if ($matkul) {
                    if ($krs_exist) {
                        return response()->json([
                            'message' => ['Study plan card already exist.', 'error'],
                        ], 406);
                    } else {
                        if (count($cek_overlaps) != 0) {
                            return response()->json([
                                'message' => ['The study plan card you enter overlaps with other study plan card.', 'error'],
                            ], 406);
                        } else {
                            $krs->save();
                        }
                    }
                } else {
                    return response()->json([
                        'message' => ['The courses does not exist', 'error'],
                    ], 406);
                }
            } else {
                return response()->json([
                    'message' => ['The student does not exist', 'error'],
                ], 406);
            }
        } catch (QueryException $exception) {
            return response()->json([
                'message' => ['There is something wrong with the data entered.', 'error'],
            ], 406);
        }

        return response()->json([
            'message' => ['Create data success.', 'success']
        ], 200);
    }

    public function show($id)
    {
        try {
            $krs = KartuRencanaStudi::join('users', 'users.nim', '=', 'kartu_rencana_studis.nim')
                ->join('matkuls', 'matkuls.id', '=', 'kartu_rencana_studis.id_matkul')
                ->select(
                    'kartu_rencana_studis.id',
                    'kartu_rencana_studis.nim',
                    'users.name',
                    'kartu_rencana_studis.id_matkul',
                    'matkuls.nama_matkul',
                    'matkuls.mulai_jam',
                    'matkuls.akhir_jam',
                    'matkuls.hari'
                )
                ->where('kartu_rencana_studis.id',$id)->first();

            if (!$krs) {
                return response([
                    'message' => ['No data on database.', 'info']
                ], 404);
            }
        } catch (Error $exception) {
            return response([
                'message' => ['No data on database.', 'info']
            ], 404);
        }

        $response = [
            'message' => ['Get data success.', 'success'],
            'data' => $krs,
        ];
        return response($response, 200);
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $krs = KartuRencanaStudi::where('id', $id)->first();
        if (!$krs) {
            return response([
                'message' => ['Nothing updated.', 'info']
            ], 404);
        } else {

            $request->validate([
                'nim' => 'required',
                'id_matkul' => 'required'
            ]);

            try {

                $mahasiswa = User::where('nim', $request->nim)->first();
                $matkul = Matkul::where('id', $request->id_matkul)->first();

                $krs_exist = KartuRencanaStudi::where('nim', $request->nim)->where('id_matkul', $request->id_matkul)->where('id', '!=', $id)->first();

                $onMatkul = Matkul::where('id', $request->id_matkul)->select('mulai_jam', 'akhir_jam', 'hari')->first();
                if ($onMatkul) {
                    $mulai = $onMatkul->mulai_jam;
                    $akhir = $onMatkul->akhir_jam;
                    $hari = $onMatkul->hari;
                } else {
                    return response()->json([
                        'message' => ['The courses does not exist', 'error'],
                    ], 406);
                }

                $joiningtomatkul_akhir = KartuRencanaStudi::join('matkuls', 'kartu_rencana_studis.id_matkul', '=', 'matkuls.id')
                    ->where('kartu_rencana_studis.nim', $request->nim)
                    ->where('matkuls.hari', $hari)
                    ->whereRaw("'$akhir' BETWEEN matkuls.mulai_jam AND matkuls.akhir_jam")
                    ->where('kartu_rencana_studis.id', '!=', $id);

                $cek_overlaps = KartuRencanaStudi::join('matkuls', 'kartu_rencana_studis.id_matkul', '=', 'matkuls.id')
                    ->where('kartu_rencana_studis.nim', $request->nim)
                    ->where('matkuls.hari', $hari)
                    ->whereRaw("'$mulai' BETWEEN matkuls.mulai_jam AND matkuls.akhir_jam")
                    ->where('kartu_rencana_studis.id', '!=', $id)
                    ->union($joiningtomatkul_akhir)->get();

                if ($mahasiswa) {
                    if ($matkul) {
                        if ($krs_exist) {
                            return response()->json([
                                'message' => ['Study plan card already exist.', 'error'],
                            ], 406);
                        } else {
                            if (count($cek_overlaps) != 0) {
                                return response()->json([
                                    'message' => ['The study plan card you enter overlaps with other study plan card.', 'error'],
                                ], 406);
                            } else {
                                $krs->update([
                                    'nim' => $request->nim,
                                    'id_matkul' => $request->id_matkul
                                ]);
                            }
                        }
                    } else {
                        return response()->json([
                            'message' => ['The courses does not exist', 'error'],
                        ], 406);
                    }
                } else {
                    return response()->json([
                        'message' => ['The student does not exist', 'error'],
                    ], 406);
                }
            } catch (QueryException $exception) {
                return response()->json([
                    'message' => ['There is something wrong with the data entered.', 'error'],
                ], 406);
            }

            return response()->json([
                'message' => ['Update data success.', 'success']
            ], 200);
        }
    }

    public function destroy($id)
    {
        $krs = KartuRencanaStudi::find($id);
        if ($krs) {
            $krs->delete();
            return response()->json([
                'message' => ['Delete data success.', 'success'],
            ], 200);
        } else {
            return response()->json([
                'message' => ['Nothing is deleted.', 'error'],
            ], 404);
        }
    }
}
