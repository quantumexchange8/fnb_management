<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;

class TenantUser extends Authenticatable
{
    protected $table = 'users'; // actual table name in tenant DB
    protected $guard = 'tenant'; // uses tenant DB
    protected $fillable = [
        'uid', 
        'customer_id', 
        'name',
        'last_name',
        'email',
        'email_verified_at',
        'verify',
        'password',
        'role',
        'role_id',
        'member_id',
        'dial_code',
        'phone',
        'phone_number',
        'existing_phone_pos',
        'dob',
        'gender',
        'referral_code',
        'hierarchyList',
        'upline_id',
        'point',
        'rank_id',
        'address1',
        'address2',
        'address3',
        'city',
        'state',
        'zip',
        'status',
        'voided',
        'sync',
        'branch',
        'remark',
        'joined_date',
        'expired_date',
        'pin',
    ];
    protected $hidden = ['password', 'remember_token'];
}
