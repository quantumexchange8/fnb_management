<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Category extends Model
{

    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'type',
        'visibility',
        'color',
        'description',
        'status',
        'order_no'
    ];

    public function product(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(Product::class, 'category_id', 'id');
    }

}
