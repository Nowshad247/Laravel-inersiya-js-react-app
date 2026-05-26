<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete()->onUpdate('cascade');
            $table->foreignId('student_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->decimal('amount', 14, 2)->default(0);
            $table->foreignId('payment_method_id')->nullable()->constrained('payment_methods')->nullOnDelete()->onUpdate('cascade');
            $table->string('method')->nullable();
            $table->enum('status', ['pending', 'verified', 'failed', 'approved'])->default('pending');
            $table->string('transaction_id')->nullable();
            $table->dateTime('payment_date')->nullable();
            $table->string('reference')->nullable();
            $table->text('note')->nullable();
            $table->foreignId('receipt_id')->nullable()->constrained('receipts')->nullOnDelete()->onUpdate('cascade');
            $table->json('meta')->nullable();
            $table->softDeletes();
            $table->timestamps();

            $table->index(['invoice_id', 'student_id', 'receipt_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
