<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Error;
use Illuminate\Database\QueryException;

class MahasiswaController extends Controller
{

    public function index()
    {
        $mahasiswa = User::where('level', 'Mahasiswa')
                    ->select(['id','nim','name','jenis_kelamin','alamat','no_hp','jurusan','email','created_at','updated_at'])
                    ->get();

        if(count($mahasiswa) == 0){
            return response([
                'message' => ['No data on database.','info']
            ], 404);
        }else{
            $response = [
                'message' => ['Get data success.','success'],
                'data' => $mahasiswa,
            ];
            return response($response, 200);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'nim' => 'required',
            'name' => 'required',
            'jenis_kelamin' => 'required',
            'alamat' => 'required',
            'no_hp' => 'required',
            'jurusan' => 'required',
            'email' => 'required|email',
            'password' => 'required'
        ]);
                
        try {
            $mahasiswa = new User;
            $mahasiswa->nim =  $request->nim;
            $mahasiswa->name = $request->name;
            $mahasiswa->jenis_kelamin = $request->jenis_kelamin;
            $mahasiswa->alamat = $request->alamat;
            $mahasiswa->no_hp = $request->no_hp;
            $mahasiswa->level = 'Mahasiswa';
            $mahasiswa->jurusan = $request->jurusan;
            $mahasiswa->email = $request->email;
            $mahasiswa->password = Hash::make($request->password);
            $mahasiswa->save();
        } catch (QueryException $exception) {
            return response()->json([
                'message' => ['There is something wrong with the data entered.','error'],                
            ],406);
        }

        return response()->json([
            'message' => ['Create data success.','success']
        ],200);
    }

    public function show($id)
    {
        $mahasiswa = User::where('id', $id)
                    ->where('level','Mahasiswa')
                    ->select(['id','name','jenis_kelamin','alamat','no_hp','jurusan','email','updated_at','created_at'])
                    ->first();

        if(!$mahasiswa)
        {
            return response([
                'message' => ['No data on database.','info']
            ], 404);
        }
        else
        {
            $response = [
                'message' => ['Get data success.','success'],
                'data' => $mahasiswa,
            ];
            return response($response, 200);
        }
    }

    public function edit($id)
    {
        $mahasiswa = User::where('id', $id)
                        ->where('level','Mahasiswa')
                        ->select(['id','name','jenis_kelamin','alamat','no_hp','jurusan','updated_at'])
                        ->first();

        if(!$mahasiswa)
        {
            return response([
                'message' => ['No data on database.','info']
            ], 404);
        }
        else
        {
            $response = [
                'message' => ['Get data success.','success'],
                'data' => $mahasiswa,
            ];
            return response($response, 200);
        }
    }

    public function update(Request $request, $id)
    {
        $mahasiswa = User::where('id', $id)
                        ->where('level','Mahasiswa')
                        ->select(['id','name','jenis_kelamin','alamat','no_hp','jurusan','updated_at'])
                        ->first();             
        if(!$mahasiswa)
        {
            return response([
                'message' => ['No data on database.','info']
            ], 404);
        }
        else
        {
            $request->validate([
                'name' => 'required',
                'jenis_kelamin' => 'required',
                'alamat' => 'required',
                'no_hp' => 'required',
                'jurusan' => 'required',
            ]);
    
            try {
                $mahasiswa->update([
                    'name' => $request->name,
                    'jenis_kelamin' => $request->jenis_kelamin,
                    'alamat' => $request->alamat,
                    'no_hp' => $request->no_hp,
                    'jurusan' => $request->jurusan,
                ]);
            } catch (QueryException $exception) {
                return response()->json([
                    'message' => ['There is something wrong with the data entered.','error'],                
                ],406);
            }
    
            return response()->json([
                'message' => ['Update data success.','success']
            ],200);   
        }

    }

    public function destroy($id)
    {
        $mahasiswa = User::where('level','Mahasiswa')->where('id', $id)->first();

        if(!$mahasiswa){
            return response()->json([
                'message' => ['Nothing is deleted.','error'],                
            ],404);
        }else{

            $mahasiswa->delete();
            return response()->json([
            'message' => ['Delete data success.','success'],
            ],200);  

        }
    }
}
