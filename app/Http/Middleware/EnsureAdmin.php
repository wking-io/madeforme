<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user()->is_admin) {
            return $next($request);
        }

        return redirect()->route('feed')->with('toasts', ['kind' => 'warning', 'message' => 'You are not King.']);
    }
}
