<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class InitializeTenantFromSession
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip for logout routes
        if ($request->is('tenant/logout') || $request->is('logout')) {
            return $next($request);
        }

        // Try to restore tenant from session
        if (! tenancy()->initialized && $request->session()->has('tenant_id')) {
            $tenantId = $request->session()->get('tenant_id');

            // Tenant::find() works if tenant primary key = UUID
            $tenant = Tenant::find($tenantId);

            if ($tenant) {
                tenancy()->initialize($tenant);
            }
        }

        // Always set correct auth guard based on tenancy state
        if (tenancy()->initialized) {
            Auth::shouldUse('tenant');
        } else {
            Auth::shouldUse('web');
        }

        return $next($request);
    }
}
