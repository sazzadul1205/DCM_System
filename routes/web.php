<?php

use App\Http\Controllers\ProfileController;
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
    });
});

require __DIR__ . '/auth.php';
