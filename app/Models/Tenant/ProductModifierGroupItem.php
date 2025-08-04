<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class ProductModifierGroupItem extends Model
{
    
    protected $fillable = [
        'product_modifier_group_id',
        'modifier_item_id',
        'modifier_name',
        'modifier_price',
        'status',
    ];

    protected $casts = [
        'modifier_price' => 'float',
    ];

    public function modifier_item(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ModifierGroupItem::class, 'modifier_item_id', 'id');
    }
}
