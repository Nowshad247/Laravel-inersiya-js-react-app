import BillingTabs from '@/components/BillingTabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowDownToLine,
    BarChart3,
    BookOpen,
    CalendarClock,
    CheckCircle2,
    CreditCard,
    FileSpreadsheet,
    FileText,
    Printer,
    Receipt,
    RefreshCw,
    RotateCcw,
    TrendingUp,
    Users,
    Wallet,
} from 'lucide-react';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Option {
    value: string | number;
    label: string;
}

interface Filters {
    period: string;
    date_from: string | null;
    date_to: string | null;
    student_id: number | null;
    course_id: number | null;
    batch_id: number | null;
    payment_method: string | null;
    status: string | null;
}

interface RevenueSummary {
    totalRevenue: number;
    totalPaid: number;
    totalDue: number;
    totalDiscount: number;
    invoiceCount: number;
}
interface PeriodRow {
    period: string;
    total: number;
    paid: number;
    due: number;
    count: number;
}
interface CourseRow {
    course: string;
    total: number;
    paid: number;
    due: number;
    count: number;
}
interface BatchRow {
    batch: string;
    total: number;
    paid: number;
    due: number;
    count: number;
}
interface MonthRow {
    month: string;
    total: number;
    paid: number;
    count: number;
}
interface PaymentSummary {
    totalPayments: number;
    totalAmount: number;
    verified: number;
    pending: number;
    avgPayment: number;
}
interface MethodRow {
    method: string;
    count: number;
    total: number;
}
interface StatusRow {
    status: string;
    count: number;
    total: number;
}
interface DailyRow {
    date: string;
    count: number;
    total: number;
}
interface InvoiceSummary {
    total: number;
    paid: number;
    unpaid: number;
    overdue: number;
    cancelled: number;
    draft: number;
}
interface StatusBreakRow {
    status: string;
    count: number;
    total: number;
    paid: number;
    due: number;
}
interface AgingRow {
    bucket: string;
    count: number;
    amount: number;
}
interface StudentRow {
    student: string;
    uid: string | null;
    total: number;
    paid: number;
    due: number;
    invoices: number;
    id: number;
}
interface PayerRow {
    student: string;
    uid: string | null;
    totalPaid: number;
    payments: number;
    id: number;
}
interface DueSummary {
    totalDue: number;
    overdueAmount: number;
    overdueCount: number;
    onTimeCount: number;
    recoveryRate: number;
}
interface DueCourse {
    course: string;
    due: number;
    count: number;
}
interface DueBatch {
    batch: string;
    due: number;
    count: number;
}
interface InstallSummary {
    upcomingAmount: number;
    upcomingCount: number;
    missedAmount: number;
    missedCount: number;
}
interface InstallRow {
    student: string;
    amount: number;
    dueDate: string;
    status: string;
    daysOverdue?: number;
}
interface CourseFin {
    course: string;
    revenue: number;
    paid: number;
    due: number;
    discount: number;
    invoices: number;
}
interface BatchFin {
    batch: string;
    revenue: number;
    paid: number;
    due: number;
    invoices: number;
}

interface PageProps extends Record<string, unknown> {
    filters: Filters;
    periodLabel: string;
    revenue: {
        summary: RevenueSummary;
        byPeriod: PeriodRow[];
        byCourse: CourseRow[];
        byBatch: BatchRow[];
        byMonth: MonthRow[];
    };
    payments: {
        summary: PaymentSummary;
        byMethod: MethodRow[];
        byStatus: StatusRow[];
        dailyCollection: DailyRow[];
    };
    invoices: {
        summary: InvoiceSummary;
        byStatus: StatusBreakRow[];
        aging: AgingRow[];
    };
    students: { outstanding: StudentRow[]; topPayers: PayerRow[] };
    dueCollection: {
        summary: DueSummary;
        byCourse: DueCourse[];
        byBatch: DueBatch[];
    };
    installments: {
        summary: InstallSummary;
        upcoming: InstallRow[];
        missed: InstallRow[];
    };
    courseBatch: { byCourse: CourseFin[]; byBatch: BatchFin[] };
    options: {
        students: Option[];
        courses: Option[];
        batches: Option[];
        paymentMethods: Option[];
        statuses: Option[];
    };
}

// ─── Shared helpers ───────────────────────────────────────────────────────────

const fmt = (n: number) =>
    '৳' +
    n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
const pct = (part: number, total: number) =>
    total > 0 ? ((part / total) * 100).toFixed(1) + '%' : '—';

function StatusPill({ label }: { label: string }) {
    const map: Record<string, string> = {
        Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Sent: 'bg-sky-50 text-sky-700 border-sky-200',
        Partial: 'bg-amber-50 text-amber-700 border-amber-200',
        Cancelled: 'bg-slate-100 text-slate-500 border-slate-200',
        Draft: 'bg-slate-50 text-slate-400 border-slate-100',
        Verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Pending: 'bg-amber-50 text-amber-700 border-amber-200',
        Failed: 'bg-rose-50 text-rose-600 border-rose-200',
    };
    return (
        <span
            className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${map[label] ?? 'border-slate-200 bg-slate-50 text-slate-600'}`}
        >
            {label}
        </span>
    );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
    const w = max > 0 ? Math.min(100, (value / max) * 100) : 0;
    return (
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
            <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{ width: `${w}%` }}
            />
        </div>
    );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function Stat({
    label,
    value,
    sub,
    icon,
    variant = 'default',
}: {
    label: string;
    value: string;
    sub?: string;
    icon: React.ReactNode;
    variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
}) {
    const iconBg: Record<string, string> = {
        default: 'bg-slate-100 text-slate-500',
        success: 'bg-emerald-100 text-emerald-600',
        danger: 'bg-rose-100 text-rose-600',
        warning: 'bg-amber-100 text-amber-600',
        info: 'bg-sky-100 text-sky-600',
    };
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
            <div
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${iconBg[variant]}`}
            >
                {icon}
            </div>
            <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-500">
                    {label}
                </p>
                <p className="mt-0.5 text-xl font-semibold text-slate-900 tabular-nums">
                    {value}
                </p>
                {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
            </div>
        </div>
    );
}

// ─── Report table ─────────────────────────────────────────────────────────────

function RTable({
    heads,
    rows,
    rightCols = [],
    empty = 'No data available.',
}: {
    heads: string[];
    rows: (string | number | React.ReactNode)[][];
    rightCols?: number[];
    empty?: string;
}) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-100">
                        {heads.map((h, i) => (
                            <th
                                key={h + i}
                                className={`pr-4 pb-2 text-xs font-semibold text-slate-400 uppercase last:pr-0 ${rightCols.includes(i) ? 'text-right' : 'text-left'}`}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={heads.length}
                                className="py-10 text-center text-sm text-slate-400"
                            >
                                {empty}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, i) => (
                            <tr
                                key={i}
                                className="transition-colors hover:bg-slate-50/70"
                            >
                                {row.map((cell, j) => (
                                    <td
                                        key={j}
                                        className={`py-2.5 pr-4 text-slate-700 last:pr-0 ${rightCols.includes(j) ? 'text-right tabular-nums' : ''}`}
                                    >
                                        {cell}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Panel({
    title,
    sub,
    children,
    className = '',
}: {
    title: string;
    sub?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-2xl border border-slate-200 bg-white ${className}`}
        >
            <div className="border-b border-slate-100 px-5 py-4">
                <p className="text-sm font-semibold text-slate-800">{title}</p>
                {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
            </div>
            <div className="p-5">{children}</div>
        </div>
    );
}

// ─── Stats row ────────────────────────────────────────────────────────────────

function StatsRow({
    items,
}: {
    items: {
        label: string;
        value: string;
        sub?: string;
        icon: React.ReactNode;
        variant?: 'default' | 'success' | 'danger' | 'warning' | 'info';
    }[];
}) {
    return (
        <div
            className={`grid gap-3 ${items.length <= 4 ? 'sm:grid-cols-2 lg:grid-cols-4' : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'}`}
        >
            {items.map((s) => (
                <Stat key={s.label} {...s} />
            ))}
        </div>
    );
}

// ─── Tab components ───────────────────────────────────────────────────────────

function RevenueTab({
    data,
    periodLabel,
}: {
    data: PageProps['revenue'];
    periodLabel: string;
}) {
    const { summary, byPeriod, byCourse, byBatch, byMonth } = data;
    const collectionRate =
        summary.totalRevenue > 0
            ? ((summary.totalPaid / summary.totalRevenue) * 100).toFixed(1)
            : '0';

    return (
        <div className="space-y-5">
            <StatsRow
                items={[
                    {
                        label: 'Total Revenue',
                        value: fmt(summary.totalRevenue),
                        sub: `${summary.invoiceCount} invoices`,
                        icon: <Receipt className="h-4 w-4" />,
                    },
                    {
                        label: 'Collected',
                        value: fmt(summary.totalPaid),
                        sub: `${collectionRate}% collection rate`,
                        icon: <CheckCircle2 className="h-4 w-4" />,
                        variant: 'success',
                    },
                    {
                        label: 'Outstanding Due',
                        value: fmt(summary.totalDue),
                        sub: 'Across all unpaid invoices',
                        icon: <AlertCircle className="h-4 w-4" />,
                        variant: 'danger',
                    },
                    {
                        label: 'Discount Given',
                        value: fmt(summary.totalDiscount),
                        icon: <ArrowDownToLine className="h-4 w-4" />,
                        variant: 'warning',
                    },
                    {
                        label: 'Invoices',
                        value: summary.invoiceCount.toString(),
                        icon: <FileText className="h-4 w-4" />,
                        variant: 'info',
                    },
                ]}
            />

            {/* Collection rate bar */}
            <div className="rounded-xl border border-slate-200 bg-white px-5 py-3">
                <div className="mb-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span>Collection Rate</span>
                    <span className="font-semibold text-slate-700">
                        {pct(summary.totalPaid, summary.totalRevenue)}
                    </span>
                </div>
                <ProgressBar
                    value={summary.totalPaid}
                    max={summary.totalRevenue}
                />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Revenue by Period" sub={`Period: ${periodLabel}`}>
                    <RTable
                        heads={['Period', 'Invoices', 'Revenue', 'Paid', 'Due']}
                        rightCols={[1, 2, 3, 4]}
                        rows={byPeriod.map((r) => [
                            r.period,
                            r.count,
                            fmt(r.total),
                            <span className="text-emerald-600">
                                {fmt(r.paid)}
                            </span>,
                            <span className="text-rose-500">{fmt(r.due)}</span>,
                        ])}
                    />
                </Panel>
                <Panel title="Revenue by Month" sub="Last 12 months">
                    <RTable
                        heads={['Month', 'Invoices', 'Revenue', 'Paid']}
                        rightCols={[1, 2, 3]}
                        rows={byMonth.map((r) => [
                            r.month,
                            r.count,
                            fmt(r.total),
                            <span className="text-emerald-600">
                                {fmt(r.paid)}
                            </span>,
                        ])}
                    />
                </Panel>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Revenue by Course">
                    <RTable
                        heads={[
                            'Course',
                            'Inv.',
                            'Revenue',
                            'Paid',
                            'Due',
                            'Rate',
                        ]}
                        rightCols={[1, 2, 3, 4, 5]}
                        rows={byCourse.map((r) => [
                            r.course,
                            r.count,
                            fmt(r.total),
                            fmt(r.paid),
                            <span className="text-rose-500">{fmt(r.due)}</span>,
                            pct(r.paid, r.total),
                        ])}
                    />
                </Panel>
                <Panel title="Revenue by Batch">
                    <RTable
                        heads={['Batch', 'Inv.', 'Revenue', 'Paid', 'Due']}
                        rightCols={[1, 2, 3, 4]}
                        rows={byBatch.map((r) => [
                            r.batch,
                            r.count,
                            fmt(r.total),
                            fmt(r.paid),
                            <span className="text-rose-500">{fmt(r.due)}</span>,
                        ])}
                    />
                </Panel>
            </div>
        </div>
    );
}

function PaymentsTab({ data }: { data: PageProps['payments'] }) {
    const { summary, byMethod, byStatus, dailyCollection } = data;
    return (
        <div className="space-y-5">
            <StatsRow
                items={[
                    {
                        label: 'Total Transactions',
                        value: summary.totalPayments.toString(),
                        icon: <CreditCard className="h-4 w-4" />,
                    },
                    {
                        label: 'Total Collected',
                        value: fmt(summary.totalAmount),
                        icon: <Wallet className="h-4 w-4" />,
                        variant: 'success',
                    },
                    {
                        label: 'Verified Amount',
                        value: fmt(summary.verified),
                        icon: <CheckCircle2 className="h-4 w-4" />,
                        variant: 'success',
                    },
                    {
                        label: 'Pending Amount',
                        value: fmt(summary.pending),
                        icon: <CalendarClock className="h-4 w-4" />,
                        variant: 'warning',
                    },
                    {
                        label: 'Avg. Payment',
                        value: fmt(summary.avgPayment),
                        sub: 'Per transaction',
                        icon: <BarChart3 className="h-4 w-4" />,
                        variant: 'info',
                    },
                ]}
            />

            <div className="grid gap-5 lg:grid-cols-3">
                <Panel title="By Payment Method">
                    <RTable
                        heads={['Method', 'Count', 'Amount']}
                        rightCols={[1, 2]}
                        rows={byMethod.map((r) => [
                            <span className="capitalize">{r.method}</span>,
                            r.count,
                            fmt(r.total),
                        ])}
                    />
                </Panel>
                <Panel title="By Status">
                    <RTable
                        heads={['Status', 'Count', 'Amount']}
                        rightCols={[1, 2]}
                        rows={byStatus.map((r) => [
                            <StatusPill label={r.status} />,
                            r.count,
                            fmt(r.total),
                        ])}
                    />
                </Panel>
                <Panel title="Daily Collection" sub="All activity days">
                    <div className="max-h-72 overflow-y-auto">
                        <RTable
                            heads={['Date', 'Txns', 'Total']}
                            rightCols={[1, 2]}
                            rows={dailyCollection.map((r) => [
                                r.date,
                                r.count,
                                <span className="font-medium text-emerald-600">
                                    {fmt(r.total)}
                                </span>,
                            ])}
                        />
                    </div>
                </Panel>
            </div>
        </div>
    );
}

function InvoicesTab({ data }: { data: PageProps['invoices'] }) {
    const { summary, byStatus, aging } = data;
    const statusCards = [
        {
            label: 'Total',
            value: summary.total,
            cls: 'border-slate-200 text-slate-800',
        },
        {
            label: 'Paid',
            value: summary.paid,
            cls: 'border-emerald-200 text-emerald-700',
        },
        {
            label: 'Unpaid',
            value: summary.unpaid,
            cls: 'border-sky-200 text-sky-700',
        },
        {
            label: 'Overdue',
            value: summary.overdue,
            cls: 'border-rose-200 text-rose-600',
        },
        {
            label: 'Cancelled',
            value: summary.cancelled,
            cls: 'border-slate-200 text-slate-400',
        },
        {
            label: 'Draft',
            value: summary.draft,
            cls: 'border-amber-200 text-amber-600',
        },
    ];
    return (
        <div className="space-y-5">
            {/* Status count strip */}
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {statusCards.map(({ label, value, cls }) => (
                    <div
                        key={label}
                        className={`rounded-xl border bg-white px-3 py-3 text-center ${cls}`}
                    >
                        <p className="text-xs font-medium text-slate-400">
                            {label}
                        </p>
                        <p
                            className={`mt-1 text-2xl font-bold ${cls.includes('text-') ? cls.split(' ').find((c) => c.startsWith('text-')) : 'text-slate-800'}`}
                        >
                            {value}
                        </p>
                    </div>
                ))}
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel
                    title="Invoice Status Breakdown"
                    sub="Count and amounts by status"
                >
                    <RTable
                        heads={['Status', 'Count', 'Billed', 'Paid', 'Due']}
                        rightCols={[1, 2, 3, 4]}
                        rows={byStatus.map((r) => [
                            <StatusPill label={r.status} />,
                            r.count,
                            fmt(r.total),
                            fmt(r.paid),
                            <span className="text-rose-500">{fmt(r.due)}</span>,
                        ])}
                    />
                </Panel>
                <Panel
                    title="Invoice Aging Report"
                    sub="Overdue invoices by age range"
                >
                    <RTable
                        heads={['Age Bucket', 'Count', 'Outstanding']}
                        rightCols={[1, 2]}
                        rows={aging.map((r) => [
                            r.bucket,
                            r.count,
                            <span
                                className={
                                    r.amount > 0
                                        ? 'font-semibold text-rose-500'
                                        : 'text-slate-400'
                                }
                            >
                                {fmt(r.amount)}
                            </span>,
                        ])}
                    />
                </Panel>
            </div>
        </div>
    );
}

function StudentsTab({ data }: { data: PageProps['students'] }) {
    const { outstanding, topPayers } = data;
    return (
        <div className="space-y-5">
            <Panel
                title="Student Outstanding Balances"
                sub="Top 20 students ranked by due amount"
            >
                <RTable
                    heads={[
                        'Student',
                        'UID',
                        'Invoices',
                        'Billed',
                        'Paid',
                        'Due',
                        'Recovery',
                    ]}
                    rightCols={[2, 3, 4, 5, 6]}
                    rows={outstanding.map((r) => [
                        <button
                            type="button"
                            className="font-medium text-slate-800 underline-offset-2 hover:underline"
                            onClick={() =>
                                router.get(`/billings/student/${r.id}`)
                            }
                        >
                            {r.student}
                        </button>,
                        <span className="font-mono text-xs text-slate-400">
                            {r.uid ?? '—'}
                        </span>,
                        r.invoices,
                        fmt(r.total),
                        fmt(r.paid),
                        <span className="font-semibold text-rose-500">
                            {fmt(r.due)}
                        </span>,
                        pct(r.paid, r.total),
                    ])}
                />
            </Panel>
            <Panel
                title="Top Paying Students"
                sub="Students with highest total verified payments"
            >
                <RTable
                    heads={['Student', 'UID', 'Payments', 'Total Paid']}
                    rightCols={[2, 3]}
                    rows={topPayers.map((r) => [
                        <button
                            type="button"
                            className="font-medium text-slate-800 underline-offset-2 hover:underline"
                            onClick={() =>
                                router.get(`/billings/student/${r.id}`)
                            }
                        >
                            {r.student}
                        </button>,
                        <span className="font-mono text-xs text-slate-400">
                            {r.uid ?? '—'}
                        </span>,
                        r.payments,
                        <span className="font-semibold text-emerald-600">
                            {fmt(r.totalPaid)}
                        </span>,
                    ])}
                />
            </Panel>
        </div>
    );
}

function DueCollectionTab({ data }: { data: PageProps['dueCollection'] }) {
    const { summary, byCourse, byBatch } = data;
    return (
        <div className="space-y-5">
            <StatsRow
                items={[
                    {
                        label: 'Total Due',
                        value: fmt(summary.totalDue),
                        icon: <AlertCircle className="h-4 w-4" />,
                        variant: 'danger',
                    },
                    {
                        label: 'Overdue Amount',
                        value: fmt(summary.overdueAmount),
                        sub: `${summary.overdueCount} invoices`,
                        icon: <CalendarClock className="h-4 w-4" />,
                        variant: 'danger',
                    },
                    {
                        label: 'Not Yet Due',
                        value: summary.onTimeCount.toString(),
                        sub: 'Invoices within deadline',
                        icon: <CheckCircle2 className="h-4 w-4" />,
                        variant: 'success',
                    },
                    {
                        label: 'Recovery Rate',
                        value: `${summary.recoveryRate}%`,
                        sub: 'Overall collection efficiency',
                        icon: <TrendingUp className="h-4 w-4" />,
                        variant: 'info',
                    },
                    {
                        label: 'Overdue Invoices',
                        value: summary.overdueCount.toString(),
                        icon: <FileText className="h-4 w-4" />,
                        variant: 'warning',
                    },
                ]}
            />

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel title="Due by Course">
                    <RTable
                        heads={['Course', 'Invoices', 'Due Amount']}
                        rightCols={[1, 2]}
                        rows={byCourse.map((r) => [
                            r.course,
                            r.count,
                            <span className="font-semibold text-rose-500">
                                {fmt(r.due)}
                            </span>,
                        ])}
                    />
                </Panel>
                <Panel title="Due by Batch">
                    <RTable
                        heads={['Batch', 'Invoices', 'Due Amount']}
                        rightCols={[1, 2]}
                        rows={byBatch.map((r) => [
                            r.batch,
                            r.count,
                            <span className="font-semibold text-rose-500">
                                {fmt(r.due)}
                            </span>,
                        ])}
                    />
                </Panel>
            </div>
        </div>
    );
}

function InstallmentsTab({ data }: { data: PageProps['installments'] }) {
    const { summary, upcoming, missed } = data;
    return (
        <div className="space-y-5">
            <StatsRow
                items={[
                    {
                        label: 'Upcoming (30 days)',
                        value: summary.upcomingCount.toString(),
                        sub: fmt(summary.upcomingAmount),
                        icon: <CalendarClock className="h-4 w-4" />,
                        variant: 'info',
                    },
                    {
                        label: 'Upcoming Amount',
                        value: fmt(summary.upcomingAmount),
                        icon: <Wallet className="h-4 w-4" />,
                        variant: 'success',
                    },
                    {
                        label: 'Missed',
                        value: summary.missedCount.toString(),
                        sub: fmt(summary.missedAmount),
                        icon: <AlertCircle className="h-4 w-4" />,
                        variant: 'danger',
                    },
                    {
                        label: 'Missed Amount',
                        value: fmt(summary.missedAmount),
                        icon: <AlertCircle className="h-4 w-4" />,
                        variant: 'danger',
                    },
                ]}
            />

            <div className="grid gap-5 lg:grid-cols-2">
                <Panel
                    title="Upcoming Installments"
                    sub="Due within the next 30 days"
                >
                    <RTable
                        heads={['Student', 'Due Date', 'Amount', 'Status']}
                        rightCols={[2]}
                        rows={upcoming.map((r) => [
                            r.student,
                            r.dueDate,
                            fmt(r.amount),
                            <StatusPill label={r.status} />,
                        ])}
                    />
                </Panel>
                <Panel
                    title="Missed Installments"
                    sub="Past due — not yet paid"
                >
                    <RTable
                        heads={[
                            'Student',
                            'Due Date',
                            'Amount',
                            'Days Overdue',
                        ]}
                        rightCols={[2, 3]}
                        rows={missed.map((r) => [
                            r.student,
                            r.dueDate,
                            fmt(r.amount),
                            <span className="font-semibold text-rose-500">
                                {r.daysOverdue}d
                            </span>,
                        ])}
                    />
                </Panel>
            </div>
        </div>
    );
}

function CourseBatchTab({ data }: { data: PageProps['courseBatch'] }) {
    const { byCourse, byBatch } = data;
    return (
        <div className="space-y-5">
            <Panel
                title="Course Financial Summary"
                sub="Revenue, collection, and discount per course"
            >
                <RTable
                    heads={[
                        'Course',
                        'Invoices',
                        'Revenue',
                        'Paid',
                        'Due',
                        'Discount',
                        'Rate',
                    ]}
                    rightCols={[1, 2, 3, 4, 5, 6]}
                    rows={byCourse.map((r) => [
                        r.course,
                        r.invoices,
                        fmt(r.revenue),
                        fmt(r.paid),
                        <span className="text-rose-500">{fmt(r.due)}</span>,
                        fmt(r.discount),
                        pct(r.paid, r.revenue),
                    ])}
                />
            </Panel>
            <Panel
                title="Batch Financial Summary"
                sub="Revenue and collection per batch"
            >
                <RTable
                    heads={[
                        'Batch',
                        'Invoices',
                        'Revenue',
                        'Paid',
                        'Due',
                        'Rate',
                    ]}
                    rightCols={[1, 2, 3, 4, 5]}
                    rows={byBatch.map((r) => [
                        r.batch,
                        r.invoices,
                        fmt(r.revenue),
                        fmt(r.paid),
                        <span className="text-rose-500">{fmt(r.due)}</span>,
                        pct(r.paid, r.revenue),
                    ])}
                />
            </Panel>
        </div>
    );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
    { key: 'revenue', label: 'Revenue', icon: TrendingUp },
    { key: 'payments', label: 'Payments', icon: CreditCard },
    { key: 'invoices', label: 'Invoices', icon: FileText },
    { key: 'students', label: 'Students', icon: Users },
    { key: 'due', label: 'Due & Collection', icon: AlertCircle },
    { key: 'installments', label: 'Installments', icon: CalendarClock },
    { key: 'coursebatch', label: 'Course & Batch', icon: BookOpen },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Billing Dashboard', href: '/billings' },
    { title: 'Reports', href: '/billings/reports' },
];

const PERIOD_OPTIONS = [
    { key: 'monthly', label: 'This Month' },
    { key: 'yearly', label: 'This Year' },
    { key: 'all', label: 'All Time' },
    { key: 'custom', label: 'Custom Range' },
] as const;

// ─── Main page ────────────────────────────────────────────────────────────────

export default function Reports() {
    const {
        filters,
        periodLabel,
        revenue,
        payments,
        invoices,
        students,
        dueCollection,
        installments,
        courseBatch,
        options,
    } = usePage<PageProps>().props;

    const [activeTab, setActiveTab] = useState<TabKey>('revenue');
    const [local, setLocal] = useState({ ...filters });

    const sel = (field: keyof typeof local, value: string | null) =>
        setLocal((p) => ({ ...p, [field]: value || null }));

    const apply = () => {
        const q: Record<string, string> = { period: local.period };
        if (local.period === 'custom') {
            if (local.date_from) q.date_from = local.date_from;
            if (local.date_to) q.date_to = local.date_to;
        }
        if (local.student_id) q.student_id = String(local.student_id);
        if (local.course_id) q.course_id = String(local.course_id);
        if (local.batch_id) q.batch_id = String(local.batch_id);
        if (local.payment_method) q.payment_method = local.payment_method;
        if (local.status) q.status = local.status;
        router.get('/billings/reports', q, { preserveState: false });
    };

    const reset = () => {
        setLocal({
            period: 'monthly',
            date_from: null,
            date_to: null,
            student_id: null,
            course_id: null,
            batch_id: null,
            payment_method: null,
            status: null,
        });
        router.get(
            '/billings/reports',
            { period: 'monthly' },
            { preserveState: false },
        );
    };

    const exportUrl = (type: string) => {
        const p = new URLSearchParams({ type, period: local.period });
        if (local.period === 'custom') {
            if (local.date_from) p.set('date_from', local.date_from);
            if (local.date_to) p.set('date_to', local.date_to);
        }
        if (local.student_id) p.set('student_id', String(local.student_id));
        if (local.course_id) p.set('course_id', String(local.course_id));
        if (local.batch_id) p.set('batch_id', String(local.batch_id));
        if (local.payment_method) p.set('payment_method', local.payment_method);
        if (local.status) p.set('status', local.status);
        return `/billings/reports/export?${p.toString()}`;
    };

    const filterCount = [
        local.course_id,
        local.batch_id,
        local.payment_method,
        local.status,
    ].filter(Boolean).length;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Reports" />

            <div className="space-y-4">
                <BillingTabs title="Reports" />

                {/* ── Controls panel ──────────────────────────────────────── */}
                <div className="mx-2 rounded-3xl border border-slate-200 bg-white shadow-sm">
                    {/* Row 1 — Period + period label + action buttons */}
                    <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-5 py-4">
                        {/* Period segmented control */}
                        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50 p-0.5">
                            {PERIOD_OPTIONS.map(({ key, label }) => (
                                <button
                                    key={key}
                                    type="button"
                                    onClick={() => sel('period', key)}
                                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${local.period === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Date inputs (custom only) */}
                        {local.period === 'custom' && (
                            <div className="flex items-center gap-2">
                                <input
                                    type="date"
                                    value={local.date_from ?? ''}
                                    onChange={(e) =>
                                        sel('date_from', e.target.value)
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-slate-300 focus:outline-none"
                                />
                                <span className="text-xs text-slate-400">
                                    to
                                </span>
                                <input
                                    type="date"
                                    value={local.date_to ?? ''}
                                    onChange={(e) =>
                                        sel('date_to', e.target.value)
                                    }
                                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-700 focus:ring-2 focus:ring-slate-300 focus:outline-none"
                                />
                            </div>
                        )}

                        {/* Spacer + period label */}
                        <div className="ml-auto flex items-center gap-3">
                            <span className="hidden text-xs text-slate-400 sm:block">
                                Showing data for{' '}
                                <span className="font-semibold text-slate-600">
                                    {periodLabel}
                                </span>
                            </span>
                            <button
                                type="button"
                                onClick={apply}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
                            >
                                <RefreshCw className="h-3.5 w-3.5" />
                                Apply
                            </button>
                            <button
                                type="button"
                                onClick={reset}
                                title="Clear all filters"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>

                    {/* Row 2 — Dimension filters */}
                    <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
                        {[
                            {
                                label: 'Course',
                                field: 'course_id',
                                opts: options.courses,
                            },
                            {
                                label: 'Batch',
                                field: 'batch_id',
                                opts: options.batches,
                            },
                            {
                                label: 'Payment Method',
                                field: 'payment_method',
                                opts: options.paymentMethods,
                            },
                            {
                                label: 'Invoice Status',
                                field: 'status',
                                opts: options.statuses,
                            },
                        ].map(({ label, field, opts }) => (
                            <div key={field}>
                                <label className="mb-1 block text-xs font-medium text-slate-500">
                                    {label}
                                </label>
                                <select
                                    value={String(
                                        (local as Record<string, unknown>)[
                                            field
                                        ] ?? '',
                                    )}
                                    onChange={(e) =>
                                        sel(
                                            field as keyof typeof local,
                                            e.target.value,
                                        )
                                    }
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:ring-2 focus:ring-slate-300 focus:outline-none"
                                >
                                    <option value="">All {label}s</option>
                                    {opts.map((o) => (
                                        <option
                                            key={String(o.value)}
                                            value={String(o.value)}
                                        >
                                            {o.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))}
                    </div>

                    {/* Row 3 — Export strip */}
                    <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-5 py-3">
                        <span className="text-xs font-medium text-slate-400">
                            Export as CSV:
                        </span>
                        {[
                            { label: 'Revenue', type: 'revenue' },
                            { label: 'Payments', type: 'payments' },
                            { label: 'Invoices', type: 'invoices' },
                            { label: 'Students', type: 'students' },
                            { label: 'Due', type: 'due' },
                        ].map(({ label, type }) => (
                            <a
                                key={type}
                                href={exportUrl(type)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                            >
                                <FileSpreadsheet className="h-3 w-3" />
                                {label}
                            </a>
                        ))}
                        <div className="mx-1 h-3.5 w-px bg-slate-200" />
                        <button
                            type="button"
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                        >
                            <Printer className="h-3 w-3" />
                            Print
                        </button>
                        {filterCount > 0 && (
                            <span className="ml-auto rounded-md bg-slate-900 px-2 py-0.5 text-xs font-medium text-white">
                                {filterCount} filter{filterCount > 1 ? 's' : ''}{' '}
                                active
                            </span>
                        )}
                    </div>
                </div>

                {/* ── Report category tabs ─────────────────────────────────── */}
                <div className="mx-2 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex gap-0 border-b border-slate-100">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveTab(key)}
                                className={`inline-flex shrink-0 items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                                    activeTab === key
                                        ? 'border-slate-900 text-slate-900'
                                        : 'border-transparent text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                <Icon className="h-4 w-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                    {/* Active tab description */}
                    <div className="px-5 py-3">
                        <p className="text-xs text-slate-400">
                            {
                                {
                                    revenue: `Revenue summary, period breakdown, and course/batch analysis — ${periodLabel}`,
                                    payments: `Payment transactions, methods, and daily collection — ${periodLabel}`,
                                    invoices: `Invoice status overview and aging report — ${periodLabel}`,
                                    students:
                                        'Students ranked by outstanding balance and top payers',
                                    due: `Due amounts, overdue analysis, and collection performance — ${periodLabel}`,
                                    installments:
                                        'Upcoming (next 30 days) and missed installment schedules',
                                    coursebatch: `Course and batch financial performance — ${periodLabel}`,
                                }[activeTab]
                            }
                        </p>
                    </div>
                </div>

                {/* ── Tab content ──────────────────────────────────────────── */}
                <div className="mx-2 pb-8">
                    {activeTab === 'revenue' && (
                        <RevenueTab data={revenue} periodLabel={periodLabel} />
                    )}
                    {activeTab === 'payments' && (
                        <PaymentsTab data={payments} />
                    )}
                    {activeTab === 'invoices' && (
                        <InvoicesTab data={invoices} />
                    )}
                    {activeTab === 'students' && (
                        <StudentsTab data={students} />
                    )}
                    {activeTab === 'due' && (
                        <DueCollectionTab data={dueCollection} />
                    )}
                    {activeTab === 'installments' && (
                        <InstallmentsTab data={installments} />
                    )}
                    {activeTab === 'coursebatch' && (
                        <CourseBatchTab data={courseBatch} />
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
