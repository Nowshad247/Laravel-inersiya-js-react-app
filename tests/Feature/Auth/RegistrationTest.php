<?php

use Illuminate\Support\Facades\Route;

test('registration screen can be rendered', function () {
    if (! Route::has('register')) {
        $this->markTestSkipped('Registration is disabled for this application.');
    }

    $response = $this->get(route('register'));

    $response->assertOk();
});

test('new users can register', function () {
    if (! Route::has('register.store')) {
        $this->markTestSkipped('Registration is disabled for this application.');
    }

    $response = $this->post(route('register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
