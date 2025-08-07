<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use App\Models\Tenant\Branch;
use Illuminate\Http\Request;

class GlobalController extends Controller
{
    public function getBranch()
    {

        $branches = Branch::get();

        return response()->json($branches);
    }
}
