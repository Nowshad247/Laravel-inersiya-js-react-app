<?php

/**
 * Example: Get a setting value by key from the database
 */

use App\Models\settings;

if (!function_exists('get_setting')) {
    function get_setting($key, $default = null)
    {
        return settings::where('key', $key)->value('value') ?? $default;
    }
}