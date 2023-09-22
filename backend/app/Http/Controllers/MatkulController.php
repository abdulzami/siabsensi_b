<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Matkul;
use App\Models\User;
use App\Models\KartuRencanaStudi;
use Illuminate\Database\QueryException;
use Error;

class MatkulController extends Controller
{

    public function index()
    {
        $matkul = Matkul::join('users', 'users.nip', '=', 'matkuls.nip')
            ->select(
                'matkuls.id',
                'matkuls.nama_matkul',
                'matkuls.hari',
                'matkuls.mulai_jam',
                'matkuls.akhir_jam',
                'matkuls.jumlah_pertemuan',
                'matkuls.jurusan',
                'matkuls.nip',
                'users.name'
            )->get();

        if (count($matkul) == 0) {
            return response([
                'message' => ['No data on database.', 'info']
            ], 404);
        } else {
            $response = [
                'message' => ['Get data success.', 'success'],
                'data' => $matkul
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
            'nama_matkul' => 'required',
            'hari' => 'required',
            'mulai_jam' => 'required',
            'akhir_jam' => 'required',
            'jumlah_pertemuan' => 'required',
            'jurusan' => 'required',
            'nip' => 'required'
        ]);
        try {
            $matkul = new Matkul();
            $matkul->nama_matkul =  $request->nama_matkul;
            $matkul->hari = $request->hari;
            $matkul->mulai_jam = $request->mulai_jam;
            $matkul->akhir_jam = $request->akhir_jam;
            $matkul->jumlah_pertemuan = $request->jumlah_pertemuan;
            $matkul->jurusan = $request->jurusan;
            $matkul->nip = $request->nip;

            $dosen = User::where('nip', $request->nip)->first();

            $akhir = Matkul::whereRaw("'$request->akhir_jam' BETWEEN mulai_jam AND akhir_jam")->where('nip', $request->nip)->where('hari', $request->hari);

            $cek_overlaps = Matkul::whereRaw("'$request->mulai_jam' BETWEEN mulai_jam AND akhir_jam")->where('nip', $request->nip)->where('hari', $request->hari)
                ->union($akhir)->get();

            $cek_exist_nama_matkul = Matkul::where('nama_matkul', $request->nama_matkul)->first();

            if ($dosen) {
                if ($cek_exist_nama_matkul) {
                    return response()->json([
                        'message' => ['Courses already exist.', 'error'],
                    ], 406);
                } else {
                    if (count($cek_overlaps) != 0) {
                        return response()->json([
                            'message' => ['The time you enter overlaps with other courses.', 'error'],
                        ], 406);
                    } else {
                        $matkul->save();
                    }
                }
            } else {
                return response()->json([
                    'message' => ['The lecturer does not exist', 'error'],
                ], 406);
            }
        } catch (QueryException  $exception) {
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
            $matkul = Matkul::where('matkuls.id', $id)
                ->join('users', 'users.nip', '=', 'matkuls.nip')
                ->select(
                    'matkuls.id',
                    'matkuls.nama_matkul',
                    'matkuls.hari',
                    'matkuls.mulai_jam',
                    'matkuls.akhir_jam',
                    'matkuls.jumlah_pertemuan',
                    'matkuls.jurusan',
                    'matkuls.nip',
                    'users.name'
                )->first();

            if (!$matkul) {
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
            'data' => $matkul,
        ];
        return response($response, 200);
    }

    public function edit($id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $matkul = Matkul::where('id', $id)->first();
        if (!$matkul) {
            return response([
                'message' => ['Nothing updated.', 'info']
            ], 404);
        } else {

            $adadikrs = KartuRencanaStudi::where('id_matkul', $id)->get();

            if (count($adadikrs) != 0) {
                return response([
                    'message' => ['First delete the study plan card that uses this course to modify this course.', 'warning']
                ], 404);
            } else {
                $request->validate([
                    'nama_matkul' => 'required',
                    'hari' => 'required',
                    'mulai_jam' => 'required',
                    'akhir_jam' => 'required',
                    'jumlah_pertemuan' => 'required',
                    'jurusan' => 'required',
                    'nip' => 'required'
                ]);
                try {
                    $dosen = User::where('nip', $request->nip)->first();

                    $akhir = Matkul::whereRaw("'$request->akhir_jam' BETWEEN mulai_jam AND akhir_jam")->where('nip', $request->nip)->where('hari', $request->hari)
                        ->where('id', '!=', $id);

                    $cek_overlaps = Matkul::whereRaw("'$request->mulai_jam' BETWEEN mulai_jam AND akhir_jam")->where('nip', $request->nip)->where('id', '!=', $id)
                        ->where('hari', $request->hari)->union($akhir)->get();

                    $cek_exist_nama_matkul = Matkul::where('nama_matkul', $request->nama_matkul)->where('id', '!=', $id)->first();

                    if ($dosen) {
                        if ($cek_exist_nama_matkul) {
                            return response()->json([
                                'message' => ['Courses already exist.', 'error'],
                            ], 406);
                        } else {
                            if (count($cek_overlaps) != 0) {
                                return response()->json([
                                    'message' => ['The time you enter overlaps with other courses.', 'error'],
                                ], 406);
                            } else {

                                $matkul->update([
                                    'nama_matkul' => $request->nama_matkul,
                                    'hari' => $request->hari,
                                    'mulai_jam' => $request->mulai_jam,
                                    'akhir_jam' => $request->akhir_jam,
                                    'jumlah_pertemuan' => $request->jumlah_pertemuan,
                                    'jurusan' => $request->jurusan,
                                    'nip' => $request->nip
                                ]);
                            }
                        }
                    } else {
                        return response()->json([
                            'message' => ['The lecturer does not exist', 'error'],
                        ], 406);
                    }
                } catch (QueryException  $exception) {
                    return response()->json([
                        'message' => ['There is something wrong with the data entered.', 'error'],
                    ], 406);
                }
            }

            return response()->json([
                'message' => ['Update data success.', 'success']
            ], 200);
        }
    }

    public function destroy($id)
    {
        $matkul = Matkul::find($id);
        if ($matkul) {
            $matkul->delete();
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
