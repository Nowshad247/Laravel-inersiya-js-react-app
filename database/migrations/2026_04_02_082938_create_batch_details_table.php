<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('batch_details', function (Blueprint $table) {
            $table->charset('utf8mb4');
            $table->collation('utf8mb4_unicode_ci');
            $table->id();
            $table->foreignId('batch_id')->constrained()->onDelete('cascade')->onUpdate('cascade');
            $table->integer('total_classes')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->text('batch_modules')->nullable(); // Bangla text   
            $table->json('weekdays')->nullable();
            $table->string('class_time')->nullable();
            $table->enum('delivery_mode', ['online', 'offline'])->nullable();
            $table->text('description')->nullable(); 
            $table->text('opportunity')->nullable(); 
            $table->json('faq')->nullable(); 
            $table->json('instructor_details')->nullable(); 
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('batch_details');
    }
};
