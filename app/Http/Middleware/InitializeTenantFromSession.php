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
        if ($request->is('tenant/logout') || $request->is('logout')) {
            return $next($request);
        } else {
            if (!tenancy()->initialized && $request->session()->has('tenant_id')) {
                $tenantId = $request->session()->get('tenant_id');
                $tenant = Tenant::find($tenantId);
                
                if ($tenant) {
                    tenancy()->initialize($tenant);
                    // Auth::shouldUse('tenant');
                }
            } else {
                Auth::shouldUse('web');
            }
            
            return $next($request);
        }
    }
}
