<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'name',
        'email',
        'batch_id',
    ];


    protected $guarded = [];


    public function courses()
    {
        return $this->belongsToMany(Course::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }
}
