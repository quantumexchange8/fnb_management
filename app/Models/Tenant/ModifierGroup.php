<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class ModifierGroup extends Model
{
    protected $fillable = [
        'group_name',
        'display_name',
        'group_type',
        'min_selection',
        'max_selection',
        'overide',
        'status',
    ];
}
