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
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->string('device_name');
            $table->string('device_type')->nullable();
            $table->string('device_ip')->nullable();
            $table->unsignedInteger('device_port')->nullable();
            $table->string('device_serial_number')->nullable()->unique();
            $table->string('device_location')->nullable();
            $table->unsignedInteger('sync_interval')->default(5);
            $table->string('device_status')->default('inactive')->index();
            $table->string('connection_type')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
