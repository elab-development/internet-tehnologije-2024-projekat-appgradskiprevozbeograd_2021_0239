<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model//Eloquent, ovo je tip korisnika
{
    use HasFactory;//testovi i seederi vidi kako radi to?
    protected $fillable = ['name','description'];//dozvoljava create sa ovim podacima

    //veza role i users, jedna rola ima vise korisnika, user tabela ima role_id
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
