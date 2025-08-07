<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;

class SetMealGroupItem extends Model
{
    protected $fillable = [
        'set_meal_group_id',
        'product_id',
        'original_price',
        'additional_charge',
        'quantity',
    ];

    public function product(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'id');
    }
}
