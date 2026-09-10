<?php

use App\Models\Lead;
use App\Models\LeadNote;
use App\Models\LeadProfile;
use App\Models\LeadReminder;
use App\Models\LeadSource;
use App\Models\LeadStatus;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

function followUpFixture(): array
{
    $user = User::factory()->create();
    $status = LeadStatus::create(['name' => 'Interested']);
    $source = LeadSource::create(['name' => 'Website']);
    $lead = Lead::create([
        'name' => 'Ada Lovelace',
        'email' => 'ada@example.test',
        'phone' => '555-0100',
        'status_id' => $status->id,
        'source_id' => $source->id,
        'assigned_to' => $user->id,
    ]);
    LeadProfile::create(['lead_id' => $lead->id, 'interest' => 'Web Development']);
    $reminder = LeadReminder::create([
        'lead_id' => $lead->id,
        'user_id' => $user->id,
        'remind_at' => Carbon::today(),
        'is_completed' => false,
    ]);

    return compact('user', 'lead', 'reminder');
}

test('follow-up results are filtered and filter state persists in the session', function () {
    $fixture = followUpFixture();

    $this->actingAs($fixture['user'])
        ->get(route('lead.FollowUpScheduled', ['search' => 'Ada', 'interest' => 'Web Development']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('lead/FollowUpScheduled')
            ->where('filters.search', 'Ada')
            ->where('filters.interest', 'Web Development')
            ->where('reminders.data.0.id', $fixture['reminder']->id)
            ->where('summary.today_pending', 1));

    $this->actingAs($fixture['user'])
        ->get(route('lead.FollowUpScheduled'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('filters.search', 'Ada')
            ->where('filters.interest', 'Web Development'));
});

test('follow-up dialog actions update the existing reminder and note records', function () {
    $fixture = followUpFixture();

    $this->actingAs($fixture['user'])
        ->post(route('lead.FollowUp.note', $fixture['reminder']), ['note' => 'Call again tomorrow.'])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->actingAs($fixture['user'])
        ->patch(route('lead.FollowUp.status', $fixture['reminder']), ['status' => 'completed'])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->actingAs($fixture['user'])
        ->patch(route('lead.FollowUp.reminder', $fixture['reminder']), ['remind_at' => '2030-05-12'])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(LeadNote::where('lead_id', $fixture['lead']->id)->where('note', 'Call again tomorrow.')->exists())->toBeTrue();
    expect($fixture['reminder']->fresh()->is_completed)->toBeTrue();
    expect($fixture['reminder']->fresh()->remind_at->toDateString())->toBe('2030-05-12');
});

test('lost and not interested update the lead status and complete the reminder', function () {
    $fixture = followUpFixture();

    $this->actingAs($fixture['user'])
        ->patch(route('lead.FollowUp.status', $fixture['reminder']), ['status' => 'lost'])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($fixture['lead']->fresh()->status->name)->toBe('Lost');
    expect($fixture['reminder']->fresh()->is_completed)->toBeTrue();

    $secondFixture = followUpFixture();

    $this->actingAs($secondFixture['user'])
        ->patch(route('lead.FollowUp.status', $secondFixture['reminder']), ['status' => 'not_interested'])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect($secondFixture['lead']->fresh()->status->name)->toBe('Not Interested');
    expect($secondFixture['reminder']->fresh()->is_completed)->toBeTrue();
});
