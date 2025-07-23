<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Tenant\DashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

/**
 * ==============================
 *     Super Admin Routes
 * ==============================
*/
Route::middleware('auth:web')->group(function () {
    Route::get('/superadmin/dashboard', [AdminDashboardController::class, 'dashboard'])->name('superadmin.dashboard');
    Route::post('/create-merchant', [AdminDashboardController::class, 'createMerchant'])->name('create-merchant');
    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

/**
 * ==============================
 *     Tenant Routes
 * ==============================
*/
Route::middleware('auth:tenant')->group(function () {
    Route::get('/tenant/dashboard', [DashboardController::class, 'dashboard'])->name('tenant.dashboard');
});

require __DIR__.'/auth.php';
