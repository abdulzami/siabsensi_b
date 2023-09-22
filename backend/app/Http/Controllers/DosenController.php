<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Error;
use Illuminate\Database\QueryException;

class DosenController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $dosen = User::where('level', 'Dosen')
                ->select(['id','nip','name','jenis_kelamin','alamat','no_hp','jurusan','email','created_at','updated_at'])
                ->get();

         if(count($dosen) == 0){
            return response([
                'message' => ['No data on database.','info']
            ], 404);
        }else{
            $response = [
                'message' => ['Get data success.','success'],
                'data' => $dosen,
            ];
            return response($response, 200);
        }
    }

    public function store(Request $request)
    {
        $request->validate([
            'nip' => 'required',
            'name' => 'required',
            'jenis_kelamin' => 'required',
            'alamat' => 'required',
            'no_hp' => 'required',
            'jurusan' => 'required',
            'email' => 'required|email',
            'password' => 'required'
        ]);
                
        try {
            $dosen = new User;
            $dosen->nip =  $request->nip;
            $dosen->name = $request->name;
            $dosen->jenis_kelamin = $request->jenis_kelamin;
            $dosen->alamat = $request->alamat;
            $dosen->no_hp = $request->no_hp;
            $dosen->level = 'Dosen';
            $dosen->jurusan = $request->jurusan;
            $dosen->email = $request->email;
            $dosen->password = Hash::make($request->password);
            $dosen->save();
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
        $dosen = User::where('id', $id)
                    ->where('level','Dosen')
                    ->select(['id','name','jenis_kelamin','alamat','no_hp','jurusan','email','updated_at','created_at'])
                    ->first();

        if(!$dosen)
        {
            return response([
                'message' => ['No data on database.','info']
            ], 404);
        }
        else
        {
            $response = [
                'message' => ['Get data success.','success'],
                'data' => $dosen,
            ];
            return response($response, 200);
        }
    }

    public function edit($id)
    {
        $dosen = User::where('id', $id)
                        ->where('level','Dosen')
                        ->select(['id','name','jenis_kelamin','alamat','no_hp','jurusan','updated_at'])
                        ->first();

        if(!$dosen)
        {
            return response([
                'message' => ['No data on database.','info']
            ], 404);
        }
        else
        {
            $response = [
                'message' => ['Get data success.','success'],
                'data' => $dosen,
            ];
            return response($response, 200);
        }
    }

    public function update(Request $request, $id)
    {
        $dosen = User::where('id', $id)
                        ->where('level','Dosen')
                        ->select(['id','name','jenis_kelamin','alamat','no_hp','jurusan','updated_at'])
                        ->first();             
        if(!$dosen)
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
                $dosen->update([
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
        $dosen = User::where('level','Dosen')->where('id', $id)->first();

        if(!$dosen){
            return response()->json([
                'message' => ['Nothing is deleted.','error'],                
            ],404);
        }else{

            $dosen->delete();
            return response()->json([
            'message' => ['Delete data success.','success'],
            ],200);  

        }
    }
}
