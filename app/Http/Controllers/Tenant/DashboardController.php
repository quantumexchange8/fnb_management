<?php

namespace App\Http\Controllers\Tenant;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function dashboard()
    {

        $user = Auth::user();

        // Log::channel('tenant')->info('User logged in', ['user_id' => $user->id]);


        return Inertia::render('Tenant/Dashboard');
    }
}
