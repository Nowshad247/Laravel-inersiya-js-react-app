<?php

use App\Models\settings;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('site settings update only changes submitted keys', function () {
    $user = User::factory()->create();

    settings::create(['key' => 'site_name', 'value' => 'LaraCraft']);
    settings::create(['key' => 'site_title', 'value' => 'Old title']);

    $this
        ->actingAs($user)
        ->post(route('admin.settings.update'), [
            'site_title' => 'New title',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(settings::where('key', 'site_name')->value('value'))->toBe('LaraCraft');
    expect(settings::where('key', 'site_title')->value('value'))->toBe('New title');
});

test('site settings file uploads replace old file and update value', function () {
    Storage::fake('public');

    $user = User::factory()->create();

    $oldPath = 'site-settings/old-logo.png';
    Storage::disk('public')->put($oldPath, 'old');
    settings::create(['key' => 'site_logo', 'value' => Storage::url($oldPath)]);

    $this
        ->actingAs($user)
        ->post(route('admin.settings.update'), [
            'site_logo' => UploadedFile::fake()->image('new-logo.png', 200, 200),
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    Storage::disk('public')->assertMissing($oldPath);

    $value = settings::where('key', 'site_logo')->value('value');
    expect($value)->toStartWith('/storage/site-settings/');

    $newPath = ltrim(str_replace('/storage/', '', $value), '/');
    Storage::disk('public')->assertExists($newPath);
});
