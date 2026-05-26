<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BillingAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'currency',
        'billing_address',
        'guardian_name',
        'guardian_phone',
        'guardian_relation',
        'billing_notes',
        'preferences',
    ];

    protected $casts = [
        'preferences' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
