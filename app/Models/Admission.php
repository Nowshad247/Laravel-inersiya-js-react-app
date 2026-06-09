<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Admission extends Model
{
    protected $fillable = [
        'name',
        'father_name',
        'mother_name',
        'email',
        'phone',
        'address',
        'guardian_name',
        'guardian_phone',
        'guardian_relation',
        'status',
        'batch_id',
        'course_ids',
        'photo',
        'approved_by',
        'approved_status',
    ];

    protected $casts = [
        'course_ids' => 'array',
    ];

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
