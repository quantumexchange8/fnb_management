<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class SetMeal extends Model implements HasMedia
{

    use InteractsWithMedia;

    protected $fillable = [
        'set_name',
        'set_code',
        'no_of_pax',
        'category_id',
        'visibility',
        'description',
        'price_setting',
        'base_price',
        'branch_id',
        'available_days',
        'specific_days',
        'available_time',
        'available_from',
        'available_to',
        'stock_alert',
        'low_stock_threshold',
        'status',
    ];


    protected $casts = [
        'branch_id' => 'array',
        'specific_days' => 'array'
    ];

    public function set_meal_item(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SetMealItem::class, 'set_meal_id', 'id');
    }

    public function set_meal_group(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(SetMealGroup::class, 'set_meal_id', 'id');
    }

}
