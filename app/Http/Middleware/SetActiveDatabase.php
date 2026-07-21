<?php

namespace App\Http\Middleware;

use Closure;
use App\Services\DatabaseSwitcher;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetActiveDatabase
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set the active database for this request
        DatabaseSwitcher::setAsDefault();
        
        return $next($request);
    }
}
