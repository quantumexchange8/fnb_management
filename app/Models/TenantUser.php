<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class TenantUser extends Authenticatable
{
    protected $table = 'users'; // actual table name in tenant DB
    protected $guard = 'tenant'; // uses tenant DB
    protected $fillable = [
        'name', 'email', 'password',
    ];
    protected $hidden = ['password', 'remember_token'];
}
