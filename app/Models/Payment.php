<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'invoice_id',
        'student_id',
        'amount',
        'payment_method_id',
        'method',
        'status',
        'transaction_id',
        'payment_date',
        'reference',
        'note',
        'receipt_id',
        'meta',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'meta' => 'array',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function receipt()
    {
        return $this->belongsTo(Receipt::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }
}
