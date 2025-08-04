<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ModifierGroupItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'modifier_group_id',
        'modifier_item_id',
        'modifier_name',
        'modifier_price',
        'default',
        'status',
        'sort_order',
    ];

    public function modifier_items(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(ModifierItem::class, 'modifier_item_id', 'id');
    }
}
