<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoleController;
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

Route::middleware(['auth'])->group(function () {
    // Profile routes
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('complete', [ProfileController::class, 'completeProfile'])->name('complete');
        Route::post('complete', [ProfileController::class, 'storeCompletedProfile'])->name('complete.store');
        Route::get('show', [ProfileController::class, 'show'])->name('show');
        Route::get('edit', [ProfileController::class, 'edit'])->name('edit');
        Route::put('update', [ProfileController::class, 'update'])->name('update');
        Route::delete('destroy', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Role management routes
    Route::prefix('roles')->name('roles.')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
        Route::patch('/{role}/status', [RoleController::class, 'updateStatus'])->name('update-status');

        // Bulk operations
        Route::delete('/bulk/delete', [RoleController::class, 'bulkDelete'])->name('bulk.delete');
        Route::put('/bulk/status', [RoleController::class, 'bulkUpdateStatus'])->name('bulk.status');

        // Permissions endpoint
        Route::get('/permissions/list', [RoleController::class, 'getPermissions'])->name('permissions');
    });
});

require __DIR__ . '/auth.php';
