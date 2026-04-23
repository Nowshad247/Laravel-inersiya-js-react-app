<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSiteSettingsRequest extends FormRequest
{
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

            'site_logo' => ['sometimes', 'file', 'max:4096', 'mimes:svg,png,jpg,jpeg'],
            'site_icon' => ['sometimes', 'file', 'max:4096', 'mimes:svg,png,jpg,jpeg'],
            'site_cover_image' => ['sometimes', 'file', 'max:6144', 'mimes:svg,png,jpg,jpeg'],
            'site_favicon' => ['sometimes', 'file', 'max:2048', 'mimes:svg,png,jpg,jpeg'],

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
            'timezone' => ['sometimes', 'string', 'max:100'],
            'date_format' => ['sometimes', 'string', 'max:50'],
            'time_format' => ['sometimes', 'string', 'max:50'],
            'default_language' => ['sometimes', 'string', 'max:10'],
            'default_user_role' => ['sometimes', 'string', 'max:50'],

            'currency' => ['sometimes', 'string', 'max:10'],
            'currency_symbol' => ['sometimes', 'string', 'max:10'],
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
