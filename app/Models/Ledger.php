<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    use HasFactory;

    protected $fillable = [
        'entry_date',
        'account_type',
        'description',
        'debit',
        'credit',
        'balance',
        'meta',
    ];

    protected $casts = [
        'entry_date' => 'date',
        'meta' => 'array',
    ];
}
