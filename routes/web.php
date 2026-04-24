<?php

// Inertia
use Inertia\Inertia;

// Support
use Illuminate\Support\Facades\Route;

// Foundation
use Illuminate\Foundation\Application;

// Controllers
use App\Http\Controllers\RoleController;
use App\Http\Controllers\AllergyController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MedicalConditionController;

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
        Route::delete('/bulk/delete', [RoleController::class, 'bulkDelete'])->name('bulk.delete');
        Route::put('/bulk/status', [RoleController::class, 'bulkUpdateStatus'])->name('bulk.status');
        Route::get('/permissions/list', [RoleController::class, 'getPermissions'])->name('permissions');
    });

    // Allergy Routes
    Route::prefix('allergies')->name('allergies.')->group(function () {
        Route::get('/', [AllergyController::class, 'index'])->name('index');
        Route::post('/', [AllergyController::class, 'store'])->name('store');
        Route::put('/{allergy}', [AllergyController::class, 'update'])->name('update');
        Route::patch('/{allergy}/status', [AllergyController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{allergy}', [AllergyController::class, 'destroy'])->name('destroy');
        Route::delete('/bulk/delete', [AllergyController::class, 'bulkDelete'])->name('bulk.delete');
        Route::put('/bulk/status', [AllergyController::class, 'bulkUpdateStatus'])->name('bulk.status');
    });

    // Medical Condition Routes
    Route::prefix('medical-conditions')->name('medical-conditions.')->group(function () {
        Route::get('/', [MedicalConditionController::class, 'index'])->name('index');
        Route::post('/', [MedicalConditionController::class, 'store'])->name('store');
        Route::put('/{medicalCondition}', [MedicalConditionController::class, 'update'])->name('update');
        Route::patch('/{medicalCondition}/status', [MedicalConditionController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{medicalCondition}', [MedicalConditionController::class, 'destroy'])->name('destroy');
        Route::delete('/bulk/delete', [MedicalConditionController::class, 'bulkDelete'])->name('bulk.delete');
        Route::put('/bulk/status', [MedicalConditionController::class, 'bulkUpdateStatus'])->name('bulk.status');
    });
});

require __DIR__ . '/auth.php';
