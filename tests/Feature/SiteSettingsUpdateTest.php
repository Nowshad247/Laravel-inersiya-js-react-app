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

test('site settings currency selection stores code and symbol', function () {
    $user = User::factory()->create();

    settings::create(['key' => 'currency', 'value' => 'BDT']);
    settings::create(['key' => 'currency_symbol', 'value' => '৳']);

    $this
        ->actingAs($user)
        ->post(route('admin.settings.update'), [
            'currency' => 'USD',
            'currency_symbol' => '$',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(settings::where('key', 'currency')->value('value'))->toBe('USD');
    expect(settings::where('key', 'currency_symbol')->value('value'))->toBe('$');
});

test('site settings currency validation rejects unsupported currency code', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->post(route('admin.settings.update'), [
            'currency' => 'BTC',
            'currency_symbol' => '₿',
        ])
        ->assertSessionHasErrors(['currency', 'currency_symbol'])
        ->assertRedirect();
});

test('site settings timezone, date format, time format, and language are stored', function () {
    $user = User::factory()->create();

    $this
        ->actingAs($user)
        ->post(route('admin.settings.update'), [
            'timezone' => 'UTC+06:00',
            'date_format' => 'd-m-Y',
            'time_format' => 'h:i A',
            'default_language' => 'bn',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(settings::where('key', 'timezone')->value('value'))->toBe('UTC+06:00');
    expect(settings::where('key', 'date_format')->value('value'))->toBe('d-m-Y');
    expect(settings::where('key', 'time_format')->value('value'))->toBe('h:i A');
    expect(settings::where('key', 'default_language')->value('value'))->toBe('bn');
});
