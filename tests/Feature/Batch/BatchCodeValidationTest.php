<?php

use App\Models\Course;
use Illuminate\Support\Str;

it('rejects batch_code longer than 10 characters', function () {
    $course = Course::factory()->create();

    $response = $this
        ->withoutMiddleware()
        ->post('/batch/create', [
            'name' => 'Test Batch',
            'batch_code' => Str::random(11),
            'course_id' => $course->id,
            'start_date' => now()->toDateString(),
            'end_date' => now()->addDay()->toDateString(),
            'TotalClass' => 10,
            'batch_status' => 'pending',
        ]);

    $response->assertSessionHasErrors(['batch_code']);
});
