<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{

    use InteractsWithMedia;

    protected $fillable = [
        'name',
        'item_code',
        'category_id',
        'prices', 
        'visibility',
        'description',
        'status',
    ];

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }
    public function product_modifier_group(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(ProductModifierGroup::class, 'product_id', 'id');
    }
}
