<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_name',
        'device_type',
        'device_ip',
        'device_port',
        'device_serial_number',
        'device_location',
        'sync_interval',
        'device_status',
        'connection_type',
        'last_communication_at',
        'last_communication_ip',
    ];

    protected $casts = [
        'device_port' => 'integer',
        'sync_interval' => 'integer',
        'last_communication_at' => 'datetime',
    ];
}
