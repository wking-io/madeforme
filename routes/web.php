<?php

use App\Http\Controllers\MediaController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('feed');

Route::get('/dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/posts', [PostController::class, 'index'])->name('post.index');
    Route::get('/admin/posts/create', [PostController::class, 'create'])->name('post.create');
    Route::post('/admin/posts/create', [PostController::class, 'store'])->name('post.store');
    Route::get('/admin/posts/{post:slug}', [PostController::class, 'edit'])->name('post.edit');
    Route::patch('/admin/posts/{post:slug}', [PostController::class, 'update'])->name('post.update');
    Route::delete('/admin/posts/{post:slug}', [PostController::class, 'destroy'])->name('post.destroy');

    Route::get('/admin/media', [MediaController::class, 'index'])->name('media.index');
    Route::get('/admin/media/create', [MediaController::class, 'create'])->name('media.create');
    Route::post('/admin/media/create', [MediaController::class, 'store'])->name('media.store');
    Route::patch('/admin/media/create', [MediaController::class, 'confirm'])->name('media.confirm');
    Route::delete('/admin/media/{post:slug}', [MediaController::class, 'destroy'])->name('media.destroy');
});

require __DIR__.'/auth.php';
