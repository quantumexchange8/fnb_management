<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class ModifierGroup extends Model
{
    protected $fillable = [
        'modifier_group_id',
        'group_name',
        'display_name',
        'group_type',
        'min_selection',
        'max_selection',
        'overide',
        'status',
    ];

    public function modifier_group_items(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ModifierGroupItem::class, 'modifier_group_id', 'id');
    }

    public function total_link_meal_item(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductModifierGroup::class, 'modifier_group_id', 'id');
    }
}
