<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('course_fee_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('course_id')->nullable()->constrained()->nullOnDelete()->onUpdate('cascade');
            $table->foreignId('batch_id')->nullable()->constrained()->nullOnDelete()->onUpdate('cascade');
            $table->decimal('registration_fee', 14, 2)->default(0);
            $table->decimal('admission_fee', 14, 2)->default(0);
            $table->decimal('monthly_tuition_fee', 14, 2)->default(0);
            $table->decimal('certification_fee', 14, 2)->default(0);
            $table->decimal('exam_fee', 14, 2)->default(0);
            $table->decimal('workshop_fee', 14, 2)->default(0);
            $table->decimal('other_fee', 14, 2)->default(0);
            $table->json('installment_plan_info')->nullable();
            $table->timestamps();

            $table->index(['course_id', 'batch_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_fee_rules');
    }
};
