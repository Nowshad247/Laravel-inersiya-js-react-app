<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseFeeRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'course_id',
        'batch_id',
        'registration_fee',
        'admission_fee',
        'monthly_tuition_fee',
        'certification_fee',
        'exam_fee',
        'workshop_fee',
        'other_fee',
        'installment_plan_info',
    ];

    protected $casts = [
        'installment_plan_info' => 'array',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
