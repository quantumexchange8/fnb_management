<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProductModifierGroup extends Model
{

    use SoftDeletes;

    
    protected $fillable = [
        'product_id',
        'modifier_group_id',
        'status',
    ];

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }

    public function modifier_group(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ModifierGroup::class, 'modifier_group_id', 'id');
    }

    public function product_modifier_group_item(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductModifierGroupItem::class, 'product_modifier_group_id', 'id');
    }
    
}
