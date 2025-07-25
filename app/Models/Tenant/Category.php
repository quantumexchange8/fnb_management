<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{

    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'visibility',
        'color',
        'description',
        'status',
    ];

}
