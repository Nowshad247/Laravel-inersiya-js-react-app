<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LeadReminder extends Model
{
    protected $fillable = ['lead_id','user_id','remind_at','is_completed','is_call'];
    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
