<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class SetMealGroup extends Model
{
    protected $fillable = [
        'set_meal_id',
        'group_name',
        'group_type',
        'group_selectable_type',
        'min_select',
        'max_select',
        'sort_order',
    ];

    public function set_meal_group_item(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SetMealGroupItem::class, 'set_meal_group_id', 'id');
    }
}
