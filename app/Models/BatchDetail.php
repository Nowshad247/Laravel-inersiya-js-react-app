<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BatchDetail extends Model
{
    protected $fillable = [
        'batch_id',
        'total_classes',
        'price',
        'discount_price',
        'batch_modules',
        'weekdays',
        'class_time',
        'delivery_mode',
        'description',
        'opportunity',
        'faq',
        'instructor_details'
    ];
    protected $casts = [
        'weekdays' => 'array',
        'faq' => 'array',
        'instructor_details' => 'array'
    ];
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
