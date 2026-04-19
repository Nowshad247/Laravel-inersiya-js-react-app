<?php

namespace App\Http\Middleware;

use App\Models\settings;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        $fallbackAppName = config('app.name', 'Portal');

        return [
            ...parent::share($request),
            'name' => cache()->remember('site_name', 3600, function () {
                return settings::where('key', 'site_name')->value('value');
            }),
            // 'quote' => ['message' => trim($message), 'author' => trim($author)],
            'settings' => cache()->remember('settings', 3600, function () use ($fallbackAppName) {
                $values = settings::pluck('value', 'key')->toArray();

                $enableRegistration = $values['enable_registration'] ?? null;
                $enableRegistrationBool = in_array((string) $enableRegistration, ['1', 'true'], true);

                return [
                    // Website details
                    'site_name' => $values['site_name'] ?? $fallbackAppName,
                    'site_title' => $values['site_title'] ?? $fallbackAppName,
                    'site_description' => $values['site_description'] ?? '',
                    'site_keywords' => $values['site_keywords'] ?? '',
                    'site_author' => $values['site_author'] ?? '',
                    'site_url' => $values['site_url'] ?? '',

                    // Media
                    'site_logo' => $values['site_logo'] ?? null,
                    'site_icon' => $values['site_icon'] ?? null,
                    'site_cover_image' => $values['site_cover_image'] ?? null,
                    'site_favicon' => $values['site_favicon'] ?? null,

                    // Contact / social
                    'contact_email' => $values['contact_email'] ?? '',
                    'contact_phone' => $values['contact_phone'] ?? '',
                    'address' => $values['address'] ?? '',
                    'facebook_url' => $values['facebook_url'] ?? '',
                    'twitter_url' => $values['twitter_url'] ?? '',
                    'linkedin_url' => $values['linkedin_url'] ?? '',
                    'instagram_url' => $values['instagram_url'] ?? '',

                    // SEO
                    'meta_title' => $values['meta_title'] ?? '',
                    'meta_description' => $values['meta_description'] ?? '',
                    'meta_keywords' => $values['meta_keywords'] ?? '',

                    // Platform settings
                    'maintenance_mode' => $values['maintenance_mode'] ?? 'off',
                    'timezone' => $values['timezone'] ?? 'UTC',
                    'date_format' => $values['date_format'] ?? 'Y-m-d',
                    'time_format' => $values['time_format'] ?? 'H:i:s',
                    'default_language' => $values['default_language'] ?? 'en',
                    'default_user_role' => $values['default_user_role'] ?? 'student',
                    'currency' => $values['currency'] ?? 'TK',
                    'currency_symbol' => $values['currency_symbol'] ?? '৳',
                    'currency_position' => $values['currency_position'] ?? 'right',
                    'decimal_separator' => $values['decimal_separator'] ?? '.',
                    'thousand_separator' => $values['thousand_separator'] ?? ',',
                    'number_of_decimals' => isset($values['number_of_decimals']) ? (int) $values['number_of_decimals'] : 2,
                    'enable_registration' => $enableRegistrationBool,
                ];
            }),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'auth' => [
                'user' => $request->user(),
                'permissions' => $request->user()
                ? $request->user()->getAllPermissions()->pluck('name')
                : [],
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }
}
