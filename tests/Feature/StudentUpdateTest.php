<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\Batch;
use App\Models\Course;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class StudentUpdateTest extends TestCase
{
    use RefreshDatabase;

    private Student $student;
    private Batch $batch;
    private Course $course;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        Storage::fake('public');

        // Create permissions
        Permission::create(['name' => 'view_students']);
        Permission::create(['name' => 'edit_students']);
        Permission::create(['name' => 'create_students']);
        Permission::create(['name' => 'delete_students']);

        // Create role with permissions
        $role = Role::create(['name' => 'admin']);
        $role->givePermissionTo(['view_students', 'edit_students', 'create_students', 'delete_students']);

        // Create authenticated user with permissions
        $this->user = User::factory()->create();
        $this->user->assignRole('admin');
        $this->actingAs($this->user);

        // Create test data
        $this->course = Course::factory()->create();
        $this->batch = Batch::factory()->create([
            'course_id' => $this->course->id,
        ]);
        $this->student = Student::factory()->create([
            'batch_id' => $this->batch->id,
            'email' => 'student@example.com',
            'phone' => '1234567890',
        ]);
        $this->student->courses()->attach($this->course->id);
    }

    /**
     * Test successful student update with basic fields
     */
    public function test_student_can_be_updated_successfully(): void
    {
        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
            'address' => 'Updated Address',
            'guardian_name' => 'Guardian Name',
            'guardian_phone' => '5555555555',
            'guardian_relation' => 'Father',
        ]);

        $response->assertRedirect(route('student.index'));
        $response->assertSessionHas('success', 'Student updated successfully.');

        $this->assertDatabaseHas('students', [
            'id' => $this->student->id,
            'name' => 'Updated Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'address' => 'Updated Address',
        ]);
    }

    /**
     * Test student uid is generated correctly
     */
    public function test_student_uid_is_generated_correctly(): void
    {
        $this->put(route('student.update', $this->student->id), [
            'name' => 'John Doe',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'john@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $updatedStudent = $this->student->fresh();
        $this->assertNotNull($updatedStudent->student_uid);
        $this->assertStringContainsString('SDC-', $updatedStudent->student_uid);
        $this->assertStringContainsString('-J', $updatedStudent->student_uid); // First letter of "John"
    }

    /**
     * Test photo upload during update
     */
    public function test_student_photo_can_be_uploaded(): void
    {
        $file = UploadedFile::fake()->image('student.jpg', 100, 100);

        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
            'photo' => $file,
        ]);

        $response->assertRedirect();

        $updatedStudent = $this->student->fresh();
        $this->assertNotNull($updatedStudent->photo);
        $this->assertTrue(Storage::disk('public')->exists($updatedStudent->photo));
    }

    /**
     * Test old photo is deleted when new photo is uploaded
     */
    public function test_old_photo_is_deleted_when_new_photo_uploaded(): void
    {
        // Upload initial photo
        $oldFile = UploadedFile::fake()->image('old.jpg');
        $oldPhotoPath = $oldFile->store('students', 'public');
        
        $this->student->update(['photo' => $oldPhotoPath]);
        $this->assertTrue(Storage::disk('public')->exists($oldPhotoPath));

        // Upload new photo
        $newFile = UploadedFile::fake()->image('new.jpg');

        $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
            'photo' => $newFile,
        ]);

        // Old photo should be deleted
        $this->assertFalse(Storage::disk('public')->exists($oldPhotoPath));
        
        // New photo should exist
        $updatedStudent = $this->student->fresh();
        $this->assertTrue(Storage::disk('public')->exists($updatedStudent->photo));
    }

    /**
     * Test courses are synced correctly
     */
    public function test_student_courses_are_synced(): void
    {
        $course2 = Course::factory()->create();
        $course3 = Course::factory()->create();

        $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$course2->id, $course3->id],
        ]);

        $this->assertDatabaseHas('course_student', [
            'student_id' => $this->student->id,
            'course_id' => $course2->id,
        ]);
        $this->assertDatabaseHas('course_student', [
            'student_id' => $this->student->id,
            'course_id' => $course3->id,
        ]);
        // Old course should be removed
        $this->assertDatabaseMissing('course_student', [
            'student_id' => $this->student->id,
            'course_id' => $this->course->id,
        ]);
    }

    /**
     * Test validation error for missing required fields
     */
    public function test_validation_fails_for_missing_required_fields(): void
    {
        $response = $this->put(route('student.update', $this->student->id), [
            'name' => '',
            'father_name' => '',
            'mother_name' => '',
            'email' => '',
            'status' => 'invalid',
            'batch_id' => 9999, // Non-existent batch
            'course_ids' => [], // Empty courses
        ]);

        $response->assertSessionHasErrors(['name', 'father_name', 'mother_name', 'email', 'status', 'batch_id', 'course_ids']);
    }

    /**
     * Test validation fails for duplicate email
     */
    public function test_validation_fails_for_duplicate_email(): void
    {
        $existingStudent = Student::factory()->create([
            'email' => 'existing@example.com',
            'batch_id' => $this->batch->id,
        ]);

        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'existing@example.com', // This email already exists
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    /**
     * Test validation fails for duplicate phone
     */
    public function test_validation_fails_for_duplicate_phone(): void
    {
        $existingStudent = Student::factory()->create([
            'phone' => '1111111111',
            'batch_id' => $this->batch->id,
        ]);

        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '1111111111', // This phone already exists
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $response->assertSessionHasErrors(['phone']);
    }

    /**
     * Test validation fails for invalid photo
     */
    public function test_validation_fails_for_invalid_photo(): void
    {
        $invalidFile = UploadedFile::fake()->create('document.pdf', 100, 'application/pdf');

        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
            'photo' => $invalidFile,
        ]);

        $response->assertSessionHasErrors(['photo']);
    }

    /**
     * Test validation fails for oversized photo
     */
    public function test_validation_fails_for_oversized_photo(): void
    {
        $largeFile = UploadedFile::fake()->image('large.jpg')->size(3000); // 3MB

        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
            'photo' => $largeFile,
        ]);

        $response->assertSessionHasErrors(['photo']);
    }

    /**
     * Test batch can be changed
     */
    public function test_student_batch_can_be_changed(): void
    {
        $newCourse = Course::factory()->create();
        $newBatch = Batch::factory()->create([
            'course_id' => $newCourse->id,
        ]);

        $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $newBatch->id,
            'course_ids' => [$this->course->id],
        ]);

        $this->assertDatabaseHas('students', [
            'id' => $this->student->id,
            'batch_id' => $newBatch->id,
        ]);
    }

    /**
     * Test student can be set to inactive
     */
    public function test_student_can_be_set_to_inactive(): void
    {
        $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '9876543210',
            'status' => 'inactive',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $this->assertDatabaseHas('students', [
            'id' => $this->student->id,
            'status' => 'inactive',
        ]);
    }

    /**
     * Test optional fields can be null
     */
    public function test_optional_fields_can_be_null(): void
    {
        $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '1234567890',
            'address' => '',
            'guardian_name' => '',
            'guardian_phone' => '',
            'guardian_relation' => '',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $this->assertDatabaseHas('students', [
            'id' => $this->student->id,
            'phone' => '1234567890',
            'address' => null,
            'guardian_name' => null,
        ]);
    }

    /**
     * Test validation fails when phone is empty or null
     */
    public function test_validation_fails_when_phone_is_empty(): void
    {
        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'newemail@example.com',
            'phone' => '',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $response->assertSessionHasErrors(['phone']);
    }

    /**
     * Test validation fails when email is empty or null
     */
    public function test_validation_fails_when_email_is_empty(): void
    {
        $response = $this->put(route('student.update', $this->student->id), [
            'name' => 'Updated Name',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => '',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $response->assertSessionHasErrors(['email']);
    }

    /**
     * Test student uid matches the required regex pattern
     */
    public function test_student_uid_matches_required_pattern(): void
    {
        $this->put(route('student.update', $this->student->id), [
            'name' => 'John Doe',
            'father_name' => 'Father Name',
            'mother_name' => 'Mother Name',
            'email' => 'john@example.com',
            'phone' => '9876543210',
            'status' => 'active',
            'batch_id' => $this->batch->id,
            'course_ids' => [$this->course->id],
        ]);

        $updatedStudent = $this->student->fresh();
        $pattern = '/^SDC-[A-Z0-9-]{2,10}-\d{4}-\d{4}-[A-Z]-\d+$/';
        $this->assertMatchesRegularExpression($pattern, $updatedStudent->student_uid);
    }
}
