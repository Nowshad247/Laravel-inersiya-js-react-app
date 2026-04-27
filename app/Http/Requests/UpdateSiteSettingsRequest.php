<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiteSettingsRequest extends FormRequest
{
    private const array TIMEZONES = [
        'UTC-12:00',
        'UTC-11:00',
        'UTC-10:00',
        'UTC-09:00',
        'UTC-08:00',
        'UTC-07:00',
        'UTC-06:00',
        'UTC-05:00',
        'UTC-04:00',
        'UTC-03:00',
        'UTC-02:00',
        'UTC-01:00',
        'UTC+00:00',
        'UTC+01:00',
        'UTC+02:00',
        'UTC+03:00',
        'UTC+04:00',
        'UTC+05:00',
        'UTC+06:00',
        'UTC+07:00',
        'UTC+08:00',
        'UTC+09:00',
        'UTC+10:00',
        'UTC+11:00',
        'UTC+12:00',
        'UTC+13:00',
        'UTC+14:00',
    ];

    private const array DATE_FORMATS = [
        'Y-m-d',
        'd-m-Y',
        'm-d-Y',
        'd/m/Y',
        'm/d/Y',
        'Y/m/d',
    ];

    private const array TIME_FORMATS = [
        'H:i',
        'h:i A',
    ];

    private const array LANGUAGES = [
        'en',
        'bn',
    ];

    private const array CURRENCY_CODES = [
        'BDT',
        'USD',
        'EUR',
        'GBP',
        'INR',
        'JPY',
        'AUD',
    ];

    private const array CURRENCY_SYMBOLS = [
        '৳',
        '$',
        '€',
        '£',
        '₹',
        '¥',
        'A$',
    ];

    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'site_name' => ['sometimes', 'string', 'max:255'],
            'site_title' => ['sometimes', 'string', 'max:255'],
            'site_description' => ['sometimes', 'string', 'max:2000'],
            'site_keywords' => ['sometimes', 'string', 'max:1000'],
            'site_author' => ['sometimes', 'string', 'max:255'],
            'site_url' => ['sometimes', 'url', 'max:255'],

            'site_logo' => ['sometimes', 'file', 'image', 'max:4096'],
            'site_icon' => ['sometimes', 'file', 'image', 'max:4096'],
            'site_cover_image' => ['sometimes', 'file', 'image', 'max:6144'],
            'site_favicon' => ['sometimes', 'file', 'max:2048', 'mimes:png,svg,ico'],

            'contact_email' => ['sometimes', 'nullable', 'email', 'max:255'],
            'contact_phone' => ['sometimes', 'string', 'max:50'],
            'address' => ['sometimes', 'string', 'max:255'],

            'facebook_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'twitter_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'linkedin_url' => ['sometimes', 'nullable', 'url', 'max:255'],
            'instagram_url' => ['sometimes', 'nullable', 'url', 'max:255'],

            'meta_title' => ['sometimes', 'string', 'max:255'],
            'meta_keywords' => ['sometimes', 'string', 'max:1000'],
            'meta_description' => ['sometimes', 'string', 'max:2000'],

            'google_analytics_id' => ['sometimes', 'nullable', 'string', 'max:255'],

            'maintenance_mode' => ['sometimes', 'in:on,off'],
            'timezone' => ['sometimes', 'string', Rule::in(self::TIMEZONES)],
            'date_format' => ['sometimes', 'string', Rule::in(self::DATE_FORMATS)],
            'time_format' => ['sometimes', 'string', Rule::in(self::TIME_FORMATS)],
            'default_language' => ['sometimes', 'string', Rule::in(self::LANGUAGES)],
            'default_user_role' => ['sometimes', 'string', 'max:50'],

            'currency' => ['sometimes', 'string', Rule::in(self::CURRENCY_CODES)],
            'currency_symbol' => ['sometimes', 'string', Rule::in(self::CURRENCY_SYMBOLS)],
            'currency_position' => ['sometimes', 'in:left,right'],
            'decimal_separator' => ['sometimes', 'string', 'max:5'],
            'thousand_separator' => ['sometimes', 'string', 'max:5'],
            'number_of_decimals' => ['sometimes', 'integer', 'min:0', 'max:6'],
            'enable_registration' => ['sometimes', 'string', Rule::in(['true', 'false', '1', '0'])],

            'SMTP' => ['sometimes', 'in:on,off'],
            'SMTP_HOST' => ['sometimes', 'nullable', 'string', 'max:255'],
            'SMTP_PORT' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:65535'],
            'SMTP_USERNAME' => ['sometimes', 'nullable', 'string', 'max:255'],
            'SMTP_PASSWORD' => ['sometimes', 'nullable', 'string', 'max:255'],
            'SMTP_ENCRYPTION' => ['sometimes', 'nullable', Rule::in(['tls', 'ssl', ''])],
        ];
    }
}
