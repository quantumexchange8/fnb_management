<?php

namespace App\Providers;

use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Stancl\Tenancy\Events\TenancyBootstrapped;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Event::listen(TenancyBootstrapped::class, function () {

            if (!tenancy()->initialized) {
                return; 
            }

            Auth::shouldUse('tenant'); // 👈 force tenant guard

            // Force reload user from tenant DB
            if (Auth::guard('tenant')->check()) {
                $userId = Auth::guard('tenant')->id();
                $freshUser = \App\Models\TenantUser::find($userId);

                if ($freshUser) {
                    Auth::guard('tenant')->setUser($freshUser);
                } else {
                    Auth::guard('tenant')->logout();
                }
            }
        });

        if (App::environment('production') || App::environment('staging')) {
            resolve(\Illuminate\Routing\UrlGenerator::class)->forceScheme('https');
            $this->app['request']->server->set('HTTPS', true);
        }

        Vite::prefetch(concurrency: 3);
    }
}
