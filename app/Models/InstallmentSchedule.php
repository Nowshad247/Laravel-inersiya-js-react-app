<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InstallmentSchedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'installment_plan_id',
        'due_date',
        'amount',
        'status',
        'paid_date',
        'penalty_amount',
        'meta',
    ];

    protected $casts = [
        'due_date' => 'date',
        'paid_date' => 'date',
        'meta' => 'array',
    ];

    public function installmentPlan()
    {
        return $this->belongsTo(InstallmentPlan::class);
    }
}
