<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstallmentPlan extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'invoice_id',
        'total_amount',
        'installment_count',
        'frequency',
        'start_date',
        'status',
        'meta',
    ];

    protected $casts = [
        'start_date' => 'date',
        'meta' => 'array',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }

    public function schedules()
    {
        return $this->hasMany(InstallmentSchedule::class);
    }
}
