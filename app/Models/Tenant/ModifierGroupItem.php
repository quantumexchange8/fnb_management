<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class ModifierGroupItem extends Model
{
    protected $fillable = [
        'modifier_group_id',
        'modifier_item_id',
        'modifier_name',
        'modifier_price',
        'default',
        'status',
        'sort_order',
    ];
}
