<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateSiteSettingsRequest;
use App\Models\settings;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $siteConfig = settings::pluck('value', 'key')->toArray();

        return Inertia::render('settings/SiteSettings', [
            'siteSettings' => $siteConfig,
        ]);
    }

    public function update(UpdateSiteSettingsRequest $request)
    {
        $existing = settings::pluck('value', 'key')->toArray();
        $changed = false;

        $validatedData = $request->validated();

        $fileKeys = ['site_logo', 'site_icon', 'site_cover_image', 'site_favicon'];
        $textKeys = array_diff(array_keys($validatedData), $fileKeys);

        foreach ($textKeys as $key) {
            $value = $validatedData[$key];

            if ($key === 'enable_registration') {
                $value = in_array((string) $value, ['1', 'true'], true) ? 'true' : 'false';
            }

            $old = $existing[$key] ?? null;
            $new = is_bool($value) ? ($value ? 'true' : 'false') : (string) $value;

            if (($old ?? '') === $new) {
                continue;
            }

            settings::updateOrCreate(['key' => $key], ['value' => $new]);
            $changed = true;
        }

        foreach ($fileKeys as $key) {
            if (! $request->hasFile($key)) {
                continue;
            }

            $file = $request->file($key);

            $oldValue = $existing[$key] ?? null;
            $oldPath = $this->storagePathFromSettingValue($oldValue);
            if ($oldPath !== null && Storage::disk('public')->exists($oldPath)) {
                Storage::disk('public')->delete($oldPath);
            }

            $path = $file->storePublicly('site-settings', 'public');
            $url = Storage::url($path);

            settings::updateOrCreate(['key' => $key], ['value' => $url]);
            $changed = true;
        }

        if ($changed) {
            Cache::forget('settings');
            Cache::forget('site_name');
        }

        return redirect()->back()->with('success', 'Site settings updated successfully.');
    }

    private function storagePathFromSettingValue(?string $value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        $path = $value;

        $parts = parse_url($value);
        if (is_array($parts) && isset($parts['path'])) {
            $path = $parts['path'];
        }

        if (! str_starts_with($path, '/storage/')) {
            return null;
        }

        return ltrim(substr($path, strlen('/storage/')), '/');
    }
}
