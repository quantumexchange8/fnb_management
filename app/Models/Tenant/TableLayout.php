<?php

namespace App\Models\Tenant;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class TableLayout extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'order_no',
        'layout_json',
        'floor',
        'table_id',
    ];
}
