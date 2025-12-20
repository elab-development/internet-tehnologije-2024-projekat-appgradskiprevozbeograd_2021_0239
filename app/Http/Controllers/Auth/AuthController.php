<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{

    public function register(Request $request){
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role_id' => 'required|exists:roles,id',
        ]);
        $user=User::create([
            'name'=>request('name'),
            'email'=>request('email'),
            'password'=>Hash::make(request('password')),
            'role_id'=>request('role_id'),
        ]);
        $token=$user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'=>'User registered Successfully',
            'user'=>$user,
            'token'=>$token,
        ],201);
    }
    public function login(Request $request){
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);
        $user=User::where('email',$request->email)->first();
        if(!$user||!Hash::check($request->password,$user->password)){
            throw ValidationException::withMessages([
                'email' => ['Neispravan email ili lozinka.'],
            ]);
        }
        $token=$user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message'=>'User logged in successfully',
            'user'=>$user,
            'token'=>$token,
        ]);
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
