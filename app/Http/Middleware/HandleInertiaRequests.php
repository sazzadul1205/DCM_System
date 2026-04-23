<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'flash' => [
                'status' => fn () => $request->session()->get('status'),
            ],
            'auth' => [
                'user' => $user ? [
                    'uid' => $user->uid,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_primary' => $user->phone_primary,
                    'profile_completed' => $user->profile_completed,
                    'role' => $user->role ? [
                        'name' => $user->role->name,
                        'permissions' => $user->role->permissions,
                    ] : null,
                ] : null,
            ],
        ];
    }
}
