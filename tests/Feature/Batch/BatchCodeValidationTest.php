<?php

use App\Models\Course;
use Illuminate\Support\Str;

it('accepts batch_code up to 20 characters', function () {
    $course = Course::factory()->create();

    $response = $this
        ->withoutMiddleware()
        ->post('/batch/create', [
            'name' => 'Test Batch',
            'batch_code' => Str::random(20),
            'course_id' => $course->id,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDay()->toDateString(),
            'TotalClass' => 10,
            'batch_status' => 'pending',
        ]);

    $response->assertSessionDoesntHaveErrors(['batch_code']);
});

it('rejects batch_code longer than 20 characters', function () {
    $course = Course::factory()->create();

    $response = $this
        ->withoutMiddleware()
        ->post('/batch/create', [
            'name' => 'Test Batch',
            'batch_code' => Str::random(21),
            'course_id' => $course->id,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDay()->toDateString(),
            'TotalClass' => 10,
            'batch_status' => 'pending',
        ]);

    $response->assertSessionHasErrors(['batch_code']);
});
