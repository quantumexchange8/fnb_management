<?php

namespace App\Providers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;
use Monolog\Handler\StreamHandler;

class LogServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Log::extend('tenant', function ($app, array $config) {
            $tenantId = tenant()?->id ?? 'landlord';
            $filePath = storage_path("logs/tenants/{$tenantId}.log");

            $handler = new StreamHandler($filePath, $config['level'] ?? 'debug');
            $logger = new \Monolog\Logger("tenant-{$tenantId}");
            $logger->pushHandler($handler);

            return $logger;
        });
    }
}
