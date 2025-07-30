<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ModifierItem extends Model
{

    use SoftDeletes;

    protected $fillable = [
        'modifier_name',
        'price',
    ];

}
