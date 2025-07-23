<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use App\Models\TenantUser;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Str;

class DashboardController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function createMerchant(Request $request)
    {

        // Validate input
        $validated = $request->validate([
            'name' => ['required', 'string', 'unique:tenants,id'],
            'domain' => ['required', 'string', 'unique:domains,domain'],
            'admin_name' => ['required', 'string'],
            'admin_email' => ['required', 'email', 'unique:users,email'], // landlord users
            'admin_password' => ['required', 'string', 'min:8'],
        ]);

        $tenant = Tenant::create([
            'id' => Str::slug(Str::lower($request->name)), // e.g. "Merchant 1" → "merchant-1"
        ]);

        $tenant->domains()->create([
            'domain' => $request->domain,
        ]);

        $createMerchant = User::create([
            'name' => $request->admin_name,
            'email' => $request->admin_name,
            'client_uuid' => $tenant->id,
            'password' => Hash::make($request->admin_password),
        ]);

        // Run tenant migrations (so users table exists)
        $tenant->run(function () {
            Artisan::call('tenants:migrate'); // or Tenancy::migrate()
        });

        $tenant->run(function () use ($validated) {
            $userModel = TenantUser::class; // Your tenant user model
            $userModel::create([
                'name' => $validated['admin_name'],
                'email' => $validated['admin_email'],
                'password' => Hash::make($validated['admin_password']),
            ]);
        });

        return redirect()->back();
    }
}
