<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasRoles;

class Student extends Model
{
    use HasFactory;
    use HasRoles;


    protected $fillable = [
        'name',
        'father_name',
        'mother_name',
        'student_uid',
        'phone',
        'status',
        'email',
        'photo',
        'address',
        'guardian_name',
        'guardian_phone',
        'guardian_relation',
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

    public function billingAccounts()
    {
        return $this->hasMany(BillingAccount::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function installmentPlans()
    {
        return $this->hasMany(InstallmentPlan::class);
    }

    public function refunds()
    {
        return $this->hasMany(Refund::class);
    }
   
}
