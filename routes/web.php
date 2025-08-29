<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Tenant\DashboardController;
use App\Http\Controllers\Tenant\GlobalController;
use App\Http\Controllers\Tenant\ItemManagementController;
use App\Http\Controllers\Tenant\MemberController;
use App\Http\Middleware\InitializeTenantFromSession;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::get('locale/{locale}', function ($locale) {
    App::setLocale($locale);
    Session::put("locale", $locale);

    return redirect()->back();
});


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
Route::middleware([InitializeTenantFromSession::class, 'auth:tenant'])->group(function () {
    Route::get('/tenant/dashboard', [DashboardController::class, 'dashboard'])->name('tenant.dashboard');

    /**
     * ==============================
     *     Global routes
     * ==============================
    */
    Route::get('/getBranch', [GlobalController::class, 'getBranch'])->name('getBranch');

    /**
     * ==============================
     *     Item Management Routes
     * ==============================
    */
    Route::prefix('items-management')->group(function () {
        Route::get('/category-list', [ItemManagementController::class, 'categoryList'])->name('items-management.category-list');
        Route::get('/create-category', [ItemManagementController::class, 'createCategory'])->name('items-management.create-category');
        Route::get('/product-list', [ItemManagementController::class, 'productList'])->name('items-management.product-list');
        Route::get('/create-product', [ItemManagementController::class, 'createProduct'])->name('items-management.create-product');
        Route::get('/modifier-group-list', [ItemManagementController::class, 'modifierGroupList'])->name('items-management.modifier-group-list');
        Route::get('/create-modifier-group', [ItemManagementController::class, 'createModifierGroup'])->name('items-management.create-modifier-group');
        Route::get('/create-set-meal', [ItemManagementController::class, 'createSetMeal'])->name('items-management.create-set-meal');
        Route::get('/manage-modifier-item', [ItemManagementController::class, 'manageModifierItem'])->name('items-management.manage-modifier-item');
        Route::get('/edit-modifier-group/{id}', [ItemManagementController::class, 'editModifierGroup'])->name('items-management.edit-modifier-group');
        Route::get('/edit-product/{id}', [ItemManagementController::class, 'editProduct'])->name('items-management.edit-product');
        Route::get('/set-meal-listing', [ItemManagementController::class, 'setMealListing'])->name('items-management.set-meal-listing');
        Route::get('/edit-set-meal/{uid}', [ItemManagementController::class, 'editSetMeal'])->name('items-management.edit-set-meal');

        Route::get('/getCategories', [ItemManagementController::class, 'getCategories'])->name('items-management.getCategories');
        Route::get('/getModifier', [ItemManagementController::class, 'getModifier'])->name('items-management.getModifier');
        Route::get('/getProducts', [ItemManagementController::class, 'getProducts'])->name('items-management.getProducts');
        Route::get('/getModifierItem', [ItemManagementController::class, 'getModifierItem'])->name('items-management.getModifierItem');
        Route::get('/getModifierGroup', [ItemManagementController::class, 'getModifierGroup'])->name('items-management.getModifierGroup');
        Route::get('/getMealItem', [ItemManagementController::class, 'getMealItem'])->name('items-management.getMealItem');
        Route::get('/getSetMeal', [ItemManagementController::class, 'getSetMeal'])->name('items-management.getSetMeal');
        Route::get('/getSortCategories', [ItemManagementController::class, 'getSortCategories'])->name('items-management.getSortCategories');
        
        Route::post('/store-category', [ItemManagementController::class, 'storeCategory'])->name('items-management.store-category');
        Route::post('/updateCategoryVisibility', [ItemManagementController::class, 'updateCategoryVisibility'])->name('items-management.updateCategoryVisibility');
        Route::post('/update-category', [ItemManagementController::class, 'updateCategory'])->name('items-management.update-category');
        Route::post('/update-category-orders', [ItemManagementController::class, 'updateCategoryOrders'])->name('items-management.update-category-orders');
        Route::post('/delete-category', [ItemManagementController::class, 'deleteCategory'])->name('items-management.delete-category');
        Route::post('/store-product', [ItemManagementController::class, 'storeProduct'])->name('items-management.store-product');
        Route::post('/updateProductVisibility', [ItemManagementController::class, 'updateProductVisibility'])->name('items-management.updateProductVisibility');
        Route::post('/store-modifier-item', [ItemManagementController::class, 'storeModifierItem'])->name('items-management.store-modifier-item');
        Route::post('/store-modifier-group', [ItemManagementController::class, 'storeModifierGroup'])->name('items-management.store-modifier-group');
        Route::post('/updateModifierItemStatus', [ItemManagementController::class, 'updateModifierItemStatus'])->name('items-management.updateModifierItemStatus');
        Route::post('/update-modifier-item', [ItemManagementController::class, 'updateModifierItem'])->name('items-management.update-modifier-item');
        Route::post('/delete-modifier-item', [ItemManagementController::class, 'deleteModifierItem'])->name('items-management.delete-modifier-item');
        Route::post('/updateModifierGroupStatus', [ItemManagementController::class, 'updateModifierGroupStatus'])->name('items-management.updateModifierGroupStatus');
        Route::post('/update-modifier-group', [ItemManagementController::class, 'updateModifierGroup'])->name('items-management.update-modifier-group');
        Route::post('/delete-modifier-group', [ItemManagementController::class, 'deleteModifierGroup'])->name('items-management.delete-modifier-group');
        Route::post('/update-product', [ItemManagementController::class, 'updateProduct'])->name('items-management.update-product');
        Route::post('/validate-set-meals', [ItemManagementController::class, 'validateSetMeals'])->name('items-management.validate-set-meals');
        Route::post('/store-set-meals', [ItemManagementController::class, 'storeSetMeals'])->name('items-management.store-set-meals');
        Route::post('/updateMealVisibility', [ItemManagementController::class, 'updateMealVisibility'])->name('items-management.updateMealVisibility');
        Route::post('/update-set-meals', [ItemManagementController::class, 'updateSetMeals'])->name('items-management.update-set-meals');
        
    });
  
    /**
     * ==============================
     *     Member Routes
     * ==============================
    */
    Route::prefix('members')->group(function () {
        Route::get('/member-listing', [MemberController::class, 'memberListing'])->name('members.member-listing');
        Route::get('/edit-member/{uid}', [MemberController::class, 'editMember'])->name('members.edit-member');

        Route::get('/getMembers', [MemberController::class, 'getMembers'])->name('members.getMembers');

        Route::post('/updateMemberStatus', [MemberController::class, 'updateMemberStatus'])->name('member.updateMemberStatus');
        Route::post('/updateMemberProfile', [MemberController::class, 'updateMemberProfile'])->name('member.updateMemberProfile');
        
    });
});
    

require __DIR__.'/auth.php';
