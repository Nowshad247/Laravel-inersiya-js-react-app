<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('student_additional_information', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->unique()->constrained('students')->onDelete('cascade');

            // Personal Info
            $table->string('name_bangla')->nullable();
            $table->string('nid')->nullable();
            $table->string('blood_group')->nullable();
            $table->string('religion')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('marital_status')->nullable();
            $table->boolean('is_pwd')->nullable();
            $table->string('nationality')->nullable();

            // Parents Info
            $table->string('father_occupation')->nullable();
            $table->string('mother_occupation')->nullable();

            // Present Address
            $table->string('present_district')->nullable();
            $table->string('present_division')->nullable();
            $table->string('present_upazila')->nullable();

            // Permanent Address
            $table->text('permanent_address')->nullable();

            // Education
            $table->string('last_certificate')->nullable();
            $table->string('school_name')->nullable();
            $table->string('college_name')->nullable();
            $table->string('university_name')->nullable();

            // Extra / Flexible Data
            $table->json('meta')->nullable();

            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('student_additional_information');
    }
};
