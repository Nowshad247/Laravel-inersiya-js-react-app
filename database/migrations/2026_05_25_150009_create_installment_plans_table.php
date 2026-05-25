<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('installment_plans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete()->onUpdate('cascade');
            $table->decimal('total_amount', 14, 2)->default(0);
            $table->unsignedSmallInteger('installment_count')->default(0);
            $table->string('frequency')->nullable();
            $table->date('start_date')->nullable();
            $table->enum('status', ['pending', 'active', 'completed', 'cancelled'])->default('pending');
            $table->json('meta')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['student_id', 'invoice_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('installment_plans');
    }
};
