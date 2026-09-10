import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    Filter,
    Phone,
    RefreshCcw,
    Search,
    UserRound,
    X,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
    { title: 'Lead Follow-Ups', href: '/lead/FollowUp' },
];

type UserOption = { id: number; name: string };
type Option = { id: number; name: string };
type Note = { id: number; note: string; created_at: string; user?: UserOption };
type Reminder = {
    id: number;
    remind_at: string;
    created_at: string | null;
    date_status: 'today' | 'upcoming' | 'overdue';
    is_completed: boolean;
    assigned_user?: UserOption;
    lead: {
        id: number;
        name: string;
        email?: string | null;
        phone?: string | null;
        whatsapp_number?: string | null;
        town?: string | null;
        address?: string | null;
        status?: Option;
        source?: Option;
        profile?: {
            interest?: string | null;
            occupation?: string | null;
            company?: string | null;
        };
        assignee?: UserOption;
        notes?: Note[];
    };
};
type Filters = Record<string, string>;
type Page<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
};
type Props = {
    reminders: Page<Reminder>;
    filters: Filters;
    summary: { total: number; today_pending: number; today_new: number };
    options: {
        statuses: Option[];
        sources: Option[];
        users: UserOption[];
        interests: string[];
    };
};

const dateLabel = (date: string) =>
    new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
const inputClass = 'h-9';

export default function FollowUpScheduled({
    reminders,
    filters: initialFilters,
    summary,
    options,
}: Props) {
    const [filters, setFilters] = useState<Filters>(initialFilters);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [note, setNote] = useState('');
    const [reminderDate, setReminderDate] = useState('');

    const selected =
        reminders.data.find((reminder) => reminder.id === selectedId) ?? null;

    const visitWithFilters = (
        next: Filters,
        extra: Record<string, string | number> = {},
    ) => {
        const params = Object.fromEntries(
            Object.entries(next).filter(([, value]) => value),
        );
        router.get(
            '/lead/FollowUp',
            { ...params, ...extra },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const updateFilter = (key: string, value: string) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        visitWithFilters(next, { page: 1 });
    };

    const clearFilters = () => {
        const cleared = { ...filters };
        Object.keys(cleared).forEach((key) => {
            cleared[key] = '';
        });
        cleared.follow_up_status = 'pending';
        setFilters(cleared);
        router.get(
            '/lead/FollowUp',
            { clear_filters: '1' },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const openReminder = (reminder: Reminder) => {
        setSelectedId(reminder.id);
        setReminderDate(reminder.remind_at);
        setNote('');
    };

    const onError = (errors: Record<string, string>) =>
        toast.error(
            Object.values(errors)[0] ?? 'Please check the submitted values.',
        );

    const submitNote = (event: FormEvent) => {
        event.preventDefault();
        router.post(
            `/lead/FollowUp/${selectedId}/note`,
            { note },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setNote('');
                    toast.success('Note added successfully.');
                },
                onError,
            },
        );
    };

    const updateStatus = (
        status: 'pending' | 'completed' | 'lost' | 'not_interested',
    ) => {
        router.patch(
            `/lead/FollowUp/${selectedId}/status`,
            { status },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Follow-up status updated.');
                    setSelectedId(null);
                },
                onError,
            },
        );
    };

    const updateReminderDate = (event: FormEvent) => {
        event.preventDefault();
        router.patch(
            `/lead/FollowUp/${selectedId}/reminder`,
            { remind_at: reminderDate },
            {
                preserveScroll: true,
                onSuccess: () => toast.success('Reminder date updated.'),
                onError,
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Follow-Ups" />
            <div className="space-y-6 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Lead workflow
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Follow-up desk
                        </h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() =>
                            router.reload({ only: ['reminders', 'summary'] })
                        }
                    >
                        <RefreshCcw className="mr-2 size-4" /> Refresh
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <SummaryCard
                        title="Total follow-ups"
                        value={summary.total}
                        icon={<CalendarDays className="size-5" />}
                        tone="text-primary"
                    />
                    <SummaryCard
                        title="Today's pending"
                        value={summary.today_pending}
                        icon={<Clock3 className="size-5" />}
                        tone="text-amber-600"
                    />
                    <SummaryCard
                        title="Today's new"
                        value={summary.today_new}
                        icon={<CheckCircle2 className="size-5" />}
                        tone="text-emerald-600"
                    />
                </div>

                <Card className="gap-4 py-4">
                    <CardHeader className="flex-row items-center justify-between py-0">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Filter className="size-4" /> Filters
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                        >
                            <X className="mr-1 size-4" /> Clear
                        </Button>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
                        <FilterInput
                            label="Lead name"
                            icon={<Search className="size-3.5" />}
                            value={filters.search}
                            onChange={(value) => updateFilter('search', value)}
                            placeholder="Search name"
                        />
                        <FilterInput
                            label="Phone"
                            value={filters.phone}
                            onChange={(value) => updateFilter('phone', value)}
                            placeholder="Phone number"
                        />
                        <FilterSelect
                            label="Interest"
                            value={filters.interest}
                            onChange={(value) =>
                                updateFilter('interest', value)
                            }
                            options={options.interests.map((value) => ({
                                id: value,
                                name: value,
                            }))}
                        />
                        <FilterInput
                            label="Follow-up date"
                            type="date"
                            value={filters.follow_up_date}
                            onChange={(value) =>
                                updateFilter('follow_up_date', value)
                            }
                        />
                        <FilterInput
                            label="Reminder date"
                            type="date"
                            value={filters.reminder_date}
                            onChange={(value) =>
                                updateFilter('reminder_date', value)
                            }
                        />
                        <FilterSelect
                            label="Assign to"
                            value={filters.assign_to}
                            onChange={(value) =>
                                updateFilter('assign_to', value)
                            }
                            options={options.users}
                        />
                        <FilterSelect
                            label="Follow-up status"
                            value={filters.follow_up_status}
                            onChange={(value) =>
                                updateFilter('follow_up_status', value)
                            }
                            options={[
                                { id: 'pending', name: 'Pending' },
                                { id: 'completed', name: 'Completed' },
                                { id: 'all', name: 'All statuses' },
                            ]}
                        />
                        <FilterSelect
                            label="Lead status"
                            value={filters.lead_status}
                            onChange={(value) =>
                                updateFilter('lead_status', value)
                            }
                            options={options.statuses}
                        />
                        <FilterSelect
                            label="Source"
                            value={filters.source}
                            onChange={(value) => updateFilter('source', value)}
                            options={options.sources}
                        />
                    </CardContent>
                </Card>

                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Follow-up queue
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Today first, then upcoming, then overdue.
                        </p>
                    </div>
                    <Badge variant="outline">{reminders.total} results</Badge>
                </div>

                {reminders.data.length ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 2xl:grid-cols-8">
                        {reminders.data.map((reminder) => (
                            <ReminderCard
                                key={reminder.id}
                                reminder={reminder}
                                onClick={() => openReminder(reminder)}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="items-center justify-center py-12 text-center">
                        <CardContent>
                            <CheckCircle2 className="mx-auto mb-3 size-8 text-emerald-600" />
                            <p className="font-medium">
                                No follow-ups match these filters.
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Clear a filter or add a new reminder to
                                continue.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {reminders.last_page > 1 && <Pagination page={reminders} />}
            </div>

            <Dialog
                open={Boolean(selected)}
                onOpenChange={(open) => !open && setSelectedId(null)}
            >
                <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
                    {selected && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selected.lead.name}</DialogTitle>
                                <p className="text-sm text-muted-foreground">
                                    Follow-up #{selected.id}
                                </p>
                            </DialogHeader>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Detail
                                    label="Phone"
                                    value={selected.lead.phone}
                                    icon={<Phone className="size-4" />}
                                />
                                <Detail
                                    label="Email"
                                    value={selected.lead.email}
                                />
                                <Detail
                                    label="Interest"
                                    value={selected.lead.profile?.interest}
                                />
                                <Detail
                                    label="Source"
                                    value={selected.lead.source?.name}
                                />
                                <Detail
                                    label="Lead status"
                                    value={selected.lead.status?.name}
                                />
                                <Detail
                                    label="Assigned user"
                                    value={
                                        selected.assigned_user?.name ??
                                        selected.lead.assignee?.name
                                    }
                                    icon={<UserRound className="size-4" />}
                                />
                                <Detail
                                    label="Address"
                                    value={[
                                        selected.lead.town,
                                        selected.lead.address,
                                    ]
                                        .filter(Boolean)
                                        .join(', ')}
                                />
                            </div>
                            <div className="grid gap-4 rounded-lg border bg-muted/30 p-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-xs font-medium text-muted-foreground uppercase">
                                        Current status
                                    </p>
                                    <Badge
                                        className="mt-2"
                                        variant={
                                            selected.is_completed
                                                ? 'secondary'
                                                : 'default'
                                        }
                                    >
                                        {selected.is_completed
                                            ? 'Completed'
                                            : 'Pending'}
                                    </Badge>
                                </div>
                                <form
                                    onSubmit={updateReminderDate}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="reminder-date">
                                        Next reminder date
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="reminder-date"
                                            type="date"
                                            value={reminderDate}
                                            onChange={(event) =>
                                                setReminderDate(
                                                    event.target.value,
                                                )
                                            }
                                            required
                                        />
                                        <Button type="submit" size="sm">
                                            Save
                                        </Button>
                                    </div>
                                </form>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    variant={
                                        selected.is_completed
                                            ? 'outline'
                                            : 'secondary'
                                    }
                                    onClick={() => updateStatus('pending')}
                                >
                                    Make pending
                                </Button>
                                <Button
                                    variant={
                                        selected.is_completed
                                            ? 'secondary'
                                            : 'outline'
                                    }
                                    onClick={() => updateStatus('completed')}
                                >
                                    Make completed
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => updateStatus('lost')}
                                >
                                    Lost
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() =>
                                        updateStatus('not_interested')
                                    }
                                >
                                    Not Interested
                                </Button>
                            </div>
                            <section className="space-y-3">
                                <h3 className="font-semibold">Notes</h3>
                                <div className="space-y-2">
                                    {selected.lead.notes?.length ? (
                                        selected.lead.notes.map((item) => (
                                            <div
                                                key={item.id}
                                                className="rounded-md border p-3"
                                            >
                                                <p className="text-sm">
                                                    {item.note}
                                                </p>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    {item.user?.name ??
                                                        'Team member'}{' '}
                                                    ·{' '}
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No notes yet.
                                        </p>
                                    )}
                                </div>
                                <form
                                    onSubmit={submitNote}
                                    className="space-y-2"
                                >
                                    <Label htmlFor="new-note">Add note</Label>
                                    <Textarea
                                        id="new-note"
                                        value={note}
                                        onChange={(event) =>
                                            setNote(event.target.value)
                                        }
                                        placeholder="Write a useful follow-up note..."
                                        required
                                    />
                                    <Button type="submit">Save note</Button>
                                </form>
                            </section>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}

function SummaryCard({
    title,
    value,
    icon,
    tone,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
    tone: string;
}) {
    return (
        <Card className="gap-3 py-4">
            <CardContent className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>
                <div className={`rounded-md bg-muted p-2 ${tone}`}>{icon}</div>
            </CardContent>
        </Card>
    );
}

function ReminderCard({
    reminder,
    onClick,
}: {
    reminder: Reminder;
    onClick: () => void;
}) {
    const colors = {
        today: 'border-primary/60 bg-primary/5',
        upcoming:
            'border-sky-200 bg-sky-50/50 dark:border-sky-900 dark:bg-sky-950/20',
        overdue:
            'border-amber-300 bg-amber-50/60 dark:border-amber-900 dark:bg-amber-950/20',
    };
    const labels = { today: 'Today', upcoming: 'Upcoming', overdue: 'Overdue' };
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex min-h-44 flex-col gap-3 rounded-lg border p-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${colors[reminder.date_status]}`}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="line-clamp-2 font-semibold">
                    {reminder.lead.name}
                </span>
                <Badge
                    variant={
                        reminder.date_status === 'overdue'
                            ? 'destructive'
                            : 'outline'
                    }
                >
                    {labels[reminder.date_status]}
                </Badge>
            </div>
            <div className="space-y-2 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />{' '}
                    {dateLabel(reminder.remind_at)}
                </p>
                <p className="flex items-center gap-1.5">
                    <UserRound className="size-3.5" />{' '}
                    {reminder.assigned_user?.name ??
                        reminder.lead.assignee?.name ??
                        'Unassigned'}
                </p>
                <p className="truncate">
                    {reminder.lead.profile?.interest ?? 'Interest not recorded'}
                </p>
            </div>
            <div className="mt-auto flex items-center justify-between border-t pt-2 text-xs">
                <span>{reminder.lead.status?.name ?? 'No lead status'}</span>
                {reminder.lead.phone && (
                    <span className="flex items-center gap-1">
                        <Phone className="size-3" /> {reminder.lead.phone}
                    </span>
                )}
            </div>
        </button>
    );
}

function FilterInput({
    label,
    value,
    onChange,
    placeholder,
    type = 'text',
    icon,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <div className="relative">
                {icon && (
                    <span className="absolute top-2.5 left-2 text-muted-foreground">
                        {icon}
                    </span>
                )}
                <Input
                    className={`${inputClass} ${icon ? 'pl-7' : ''}`}
                    type={type}
                    value={value ?? ''}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                />
            </div>
        </div>
    );
}

function FilterSelect({
    label,
    value,
    onChange,
    options,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { id: string | number; name: string }[];
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <select
                className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                value={value ?? ''}
                onChange={(event) => onChange(event.target.value)}
            >
                <option value="">All</option>
                {options.map((option) => (
                    <option key={option.id} value={option.id}>
                        {option.name}
                    </option>
                ))}
            </select>
        </div>
    );
}

function Detail({
    label,
    value,
    icon,
}: {
    label: string;
    value?: string | null;
    icon?: React.ReactNode;
}) {
    return (
        <div>
            <p className="text-xs font-medium text-muted-foreground uppercase">
                {label}
            </p>
            <p className="mt-1 flex items-center gap-1.5 text-sm">
                {icon}
                {value || 'Not provided'}
            </p>
        </div>
    );
}

function Pagination({ page }: { page: Page<Reminder> }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-1 pt-2">
            {page.links.map((link, index) =>
                link.url ? (
                    <Button
                        key={`${link.label}-${index}`}
                        variant={link.active ? 'default' : 'outline'}
                        size="sm"
                        onClick={() =>
                            router.visit(link.url!, {
                                preserveState: true,
                                preserveScroll: true,
                            })
                        }
                        dangerouslySetInnerHTML={{
                            __html: link.label.includes('Previous')
                                ? '<'
                                : link.label.includes('Next')
                                  ? '>'
                                  : link.label,
                        }}
                    />
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="px-2 text-sm text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ),
            )}
        </div>
    );
}
