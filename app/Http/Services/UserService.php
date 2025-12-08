<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Http\Client\Request;

class UserService
{

    public function getUserForId( $id):?User{
        return User::where('id',$id)->firstOrFail();
    }
}
