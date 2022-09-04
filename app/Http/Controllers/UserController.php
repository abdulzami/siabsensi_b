<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response([
                'message' => ['These credentials do not match our records.', 'error', 'Oops...']
            ], 200);
        }

        $token = $user->createToken('token')->plainTextToken;

        $response = [
            'message' => ['Login success.', 'success', 'Welcome'],
            'user' => $user,
            'token' => $token
        ];

        return response($response, 200);
    }

    function logout(Request $request)
    {
        $user = $request->user();
        $user->currentAccessToken()->delete();

        return response()->json([
            'message' => ['Logout success.', 'success', 'See you...']
        ], 200);
    }
}
