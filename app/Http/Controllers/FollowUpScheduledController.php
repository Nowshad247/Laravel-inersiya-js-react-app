<?php

namespace App\Http\Controllers;

use App\Models\Lead;
use App\Models\LeadReminder;
use App\Models\LeadSource;
use App\Models\LeadStatus;
use App\Models\User;
use Carbon\CarbonImmutable;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class FollowUpScheduledController extends Controller
{
    private const FILTER_KEYS = [
        'search', 'phone', 'interest', 'follow_up_date', 'reminder_date',
        'assign_to', 'follow_up_status', 'lead_status', 'source',
    ];

    public function index(Request $request): Response
    {
        $filters = $this->filters($request);
        $today = CarbonImmutable::today();

        $query = LeadReminder::query()
            ->with([
                'user:id,name',
                'lead:id,name,email,phone,whatsapp_number,status_id,source_id,assigned_to,town,address',
                'lead.status:id,name',
                'lead.source:id,name',
                'lead.profile:id,lead_id,interest,occupation,company',
                'lead.assignee:id,name',
                'lead.notes' => fn ($notes) => $notes->latest(),
                'lead.notes.user:id,name',
            ])
            ->when($filters['follow_up_status'] === 'pending', fn ($query) => $query->where('is_completed', false))
            ->when($filters['follow_up_status'] === 'completed', fn ($query) => $query->where('is_completed', true))
            ->when($filters['search'], fn ($query, $value) => $query->whereHas('lead', fn ($lead) => $lead->where('name', 'like', "%{$value}%")))
            ->when($filters['phone'], fn ($query, $value) => $query->whereHas('lead', fn ($lead) => $lead->where('phone', 'like', "%{$value}%")))
            ->when($filters['interest'], fn ($query, $value) => $query->whereHas('lead.profile', fn ($profile) => $profile->where('interest', $value)))
            ->when($filters['follow_up_date'], fn ($query, $value) => $query->whereDate('remind_at', $value))
            ->when($filters['reminder_date'], fn ($query, $value) => $query->whereDate('remind_at', $value))
            ->when($filters['assign_to'], fn ($query, $value) => $query->where('user_id', $value))
            ->when($filters['lead_status'], fn ($query, $value) => $query->whereHas('lead', fn ($lead) => $lead->where('status_id', $value)))
            ->when($filters['source'], fn ($query, $value) => $query->whereHas('lead', fn ($lead) => $lead->where('source_id', $value)))
            ->orderByRaw('CASE WHEN DATE(remind_at) = ? THEN 0 WHEN DATE(remind_at) > ? THEN 1 ELSE 2 END', [$today->toDateString(), $today->toDateString()])
            ->orderBy('remind_at')
            ->orderByDesc('id');

        $reminders = $query->paginate(24)->withQueryString()->through(fn (LeadReminder $reminder) => $this->serializeReminder($reminder, $today));
        $pending = LeadReminder::query()->where('is_completed', false);

        return Inertia::render('lead/FollowUpScheduled', [
            'reminders' => $reminders,
            'filters' => $filters,
            'summary' => [
                'total' => (clone $pending)->count(),
                'today_pending' => (clone $pending)->whereDate('remind_at', $today)->count(),
                'today_new' => (clone $pending)->whereDate('created_at', $today)->count(),
            ],
            'options' => [
                'statuses' => LeadStatus::query()->orderBy('name')->get(['id', 'name']),
                'sources' => LeadSource::query()->orderBy('name')->get(['id', 'name']),
                'users' => User::query()->orderBy('name')->get(['id', 'name']),
                'interests' => Lead::query()
                    ->join('lead_profiles', 'leads.id', '=', 'lead_profiles.lead_id')
                    ->whereNotNull('lead_profiles.interest')
                    ->distinct()
                    ->orderBy('lead_profiles.interest')
                    ->pluck('lead_profiles.interest'),
            ],
        ]);
    }

    public function addNote(Request $request, LeadReminder $reminder): RedirectResponse
    {
        $validated = $request->validate(['note' => ['required', 'string', 'max:2000']]);
        $reminder->lead->notes()->create(['note' => $validated['note'], 'user_id' => $request->user()->id]);

        return back()->with('success', 'Note added successfully.');
    }

    public function updateStatus(Request $request, LeadReminder $reminder): RedirectResponse
    {
        $validated = $request->validate(['status' => ['required', 'in:pending,completed,lost,not_interested']]);

        if (in_array($validated['status'], ['lost', 'not_interested'], true)) {
            $leadStatus = LeadStatus::firstOrCreate([
                'name' => $validated['status'] === 'lost' ? 'Lost' : 'Not Interested',
            ]);

            $reminder->lead->update(['status_id' => $leadStatus->id]);
            $reminder->update(['is_completed' => true]);
        } else {
            $reminder->update(['is_completed' => $validated['status'] === 'completed']);
        }

        return back()->with('success', 'Follow-up status updated successfully.');
    }

    public function updateReminder(Request $request, LeadReminder $reminder): RedirectResponse
    {
        $validated = $request->validate(['remind_at' => ['required', 'date']]);
        $reminder->update(['remind_at' => CarbonImmutable::parse($validated['remind_at'])->startOfDay()]);

        return back()->with('success', 'Reminder date updated successfully.');
    }

    private function filters(Request $request): array
    {
        $defaults = array_fill_keys(self::FILTER_KEYS, '');
        $defaults['follow_up_status'] = 'pending';

        if ($request->boolean('clear_filters')) {
            $request->session()->forget('follow_up_filters');
        } elseif ($request->hasAny(self::FILTER_KEYS)) {
            $request->session()->put('follow_up_filters', array_filter($request->only(self::FILTER_KEYS), fn ($value) => $value !== null && $value !== ''));
        }

        return array_merge($defaults, $request->session()->get('follow_up_filters', []), $request->only(self::FILTER_KEYS));
    }

    private function serializeReminder(LeadReminder $reminder, CarbonImmutable $today): array
    {
        $date = CarbonImmutable::parse($reminder->remind_at);

        return [
            'id' => $reminder->id,
            'remind_at' => $date->toDateString(),
            'date_status' => $date->isSameDay($today) ? 'today' : ($date->greaterThan($today) ? 'upcoming' : 'overdue'),
            'is_completed' => $reminder->is_completed,
            'created_at' => $reminder->created_at?->toISOString(),
            'assigned_user' => $reminder->user,
            'lead' => [
                ...$reminder->lead->only(['id', 'name', 'email', 'phone', 'whatsapp_number', 'town', 'address']),
                'status' => $reminder->lead->status,
                'source' => $reminder->lead->source,
                'profile' => $reminder->lead->profile,
                'assignee' => $reminder->lead->assignee,
                'notes' => $reminder->lead->notes,
            ],
        ];
    }
}
