<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Receipt extends Model
{
    use HasFactory;

    protected $fillable = [
        'receipt_number',
        'issued_at',
        'download_url',
        'verification_code',
        'meta',
    ];

    protected $casts = [
        'issued_at' => 'datetime',
        'meta' => 'array',
    ];

    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
