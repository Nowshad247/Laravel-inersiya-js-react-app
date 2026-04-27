<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'mysql') {
            return;
        }

        DB::statement("ALTER TABLE lead_calls MODIFY result ENUM('answered','no_answer','busy','missed','unavailable','not_reachable','interested','not_interested','maybe_interested','call_back_later','follow_up_required','meeting_scheduled','qualified','not_qualified','proposal_sent','negotiation','converted','won','lost','wrong_person','invalid_number','duplicate_lead','rejected')");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
