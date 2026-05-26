import BillingTabs from '@/components/BillingTabs';
import DashboardCard from '@/components/DashboardCard';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    BookOpen,
    CalendarClock,
    CheckCircle2,
    CreditCard,
    Eye,
    Mail,
    MapPin,
    Phone,
    Receipt,
    TrendingUp,
    User,
    Users,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface BatchInfo {
    name: string;
    code: string;
    course: string | null;
    startDate: string | null;
    endDate: string | null;
    price: number | null;
    status: string | null;
}

interface CourseInfo {
    id: number;
    name: string;
}

interface StudentInfo {
    id: number;
    name: string;
    studentUid: string | null;
    phone: string | null;
    email: string | null;
    address: string | null;
    status: string | null;
    guardianName: string | null;
    guardianPhone: string | null;
    batches: BatchInfo[];
    courses: CourseInfo[];
}

interface BillingSummary {
    totalBilled: number;
    totalPaid: number;
    totalDue: number;
    invoiceCount: number;
}

interface NextPayment {
    type: 'installment' | 'invoice';
    amount: number;
    dueDate: string | null;
    status: string;
    invoiceId?: string;
    invoiceDbId?: number;
    penaltyAmount?: number;
}

interface InvoiceItem {
    feeType: string;
    quantity: number;
    unitPrice: number;
    total: number;
}

interface InvoiceRecord {
    id: number;
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    course: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    status: string;
    items: InvoiceItem[];
}

interface PaymentRecord {
    id: number;
    invoiceNumber: string;
    invoiceId: number;
    amount: number;
    method: string;
    status: string;
    transactionId: string;
    paymentDate: string;
    note: string;
}

interface CourseBreakdown {
    course: string;
    invoiceCount: number;
    totalBilled: number;
    totalPaid: number;
    totalDue: number;
}

interface PageProps {
    student: StudentInfo;
    summary: BillingSummary;
    nextPayment: NextPayment | null;
    courseBreakdown: CourseBreakdown[];
    invoices: InvoiceRecord[];
    payments: PaymentRecord[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
    '৳' +
    n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

function initials(name: string) {
    return name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('');
}

function StatusBadge({ status }: { status: string }) {
    const s = status?.toLowerCase();
    const cls =
        s === 'paid'
            ? 'bg-emerald-100 text-emerald-700'
            : s === 'sent' || s === 'active'
              ? 'bg-blue-100 text-blue-700'
              : s === 'partial'
                ? 'bg-amber-100 text-amber-700'
                : s === 'overdue'
                  ? 'bg-rose-100 text-rose-700'
                  : s === 'draft'
                    ? 'bg-slate-100 text-slate-500'
                    : 'bg-slate-100 text-slate-700';
    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${cls}`}
        >
            {status}
        </span>
    );
}

function SectionHeader({ label, title }: { label: string; title: string }) {
    return (
        <div className="mb-5">
            <p className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                {label}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                {title}
            </h2>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudentBilling() {
    const {
        student,
        summary,
        nextPayment,
        courseBreakdown,
        invoices,
        payments,
    } = usePage<PageProps>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Billing Dashboard', href: '/billings' },
        { title: 'Student Billing', href: `/billings/student/${student.id}` },
    ];

    const enrolledBatch = student.batches[0] ?? null;
    const isOverdue =
        nextPayment?.dueDate != null &&
        new Date(nextPayment.dueDate) < new Date();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${student.name} — Billing`} />
            <div className="space-y-6">
                <BillingTabs title="Student Billing" />

                {/* Back + heading row */}
                <div className="mx-2 flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => router.get('/billings')}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </button>
                    <div>
                        <p className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                            Individual Account
                        </p>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            {student.name}
                        </h1>
                    </div>
                </div>

                {/* ── Student profile card ─────────────────────────────────── */}
                <section className="m-2 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-6 sm:flex-row">
                        {/* Avatar + identity */}
                        <div className="flex flex-col items-center gap-3 sm:items-start">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-bold text-white">
                                {initials(student.name)}
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-lg font-semibold text-slate-900">
                                    {student.name}
                                </p>
                                {student.studentUid && (
                                    <p className="text-sm text-slate-500">
                                        UID: {student.studentUid}
                                    </p>
                                )}
                                {student.status && (
                                    <div className="mt-2">
                                        <StatusBadge status={student.status} />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details grid */}
                        <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {student.phone && (
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Phone
                                        </p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {student.phone}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {student.email && (
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Email
                                        </p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {student.email}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {student.address && (
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Address
                                        </p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {student.address}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {student.guardianName && (
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <Users className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Guardian
                                        </p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {student.guardianName}
                                            {student.guardianPhone && (
                                                <span className="ml-1 text-slate-500">
                                                    ({student.guardianPhone})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                            {enrolledBatch && (
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <BookOpen className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Batch
                                        </p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {enrolledBatch.name}
                                            {enrolledBatch.code && (
                                                <span className="ml-1 text-slate-500">
                                                    ({enrolledBatch.code})
                                                </span>
                                            )}
                                        </p>
                                        {enrolledBatch.course && (
                                            <p className="text-xs text-slate-500">
                                                {enrolledBatch.course}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {student.courses.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Enrolled Courses
                                        </p>
                                        <p className="text-sm font-medium text-slate-900">
                                            {student.courses
                                                .map((c) => c.name)
                                                .join(', ')}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* ── Summary stats ────────────────────────────────────────── */}
                <section className="m-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardCard
                        title="Total Billed"
                        value={fmt(summary.totalBilled)}
                        icon={<Receipt className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Total Paid"
                        value={fmt(summary.totalPaid)}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Total Due"
                        value={fmt(summary.totalDue)}
                        icon={<AlertCircle className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Total Invoices"
                        value={summary.invoiceCount.toString()}
                        icon={<TrendingUp className="h-5 w-5" />}
                    />
                </section>

                {/* ── Next payment banner ──────────────────────────────────── */}
                {nextPayment && (
                    <section className="mx-2">
                        <div
                            className={`flex flex-col gap-3 rounded-2xl border p-5 sm:flex-row sm:items-center sm:justify-between ${
                                isOverdue
                                    ? 'border-rose-200 bg-rose-50'
                                    : 'border-amber-200 bg-amber-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                        isOverdue
                                            ? 'bg-rose-100 text-rose-600'
                                            : 'bg-amber-100 text-amber-600'
                                    }`}
                                >
                                    <CalendarClock className="h-5 w-5" />
                                </div>
                                <div>
                                    <p
                                        className={`text-xs font-semibold tracking-widest uppercase ${
                                            isOverdue
                                                ? 'text-rose-500'
                                                : 'text-amber-600'
                                        }`}
                                    >
                                        {isOverdue
                                            ? 'Overdue Payment'
                                            : 'Next Payment Due'}
                                    </p>
                                    <p
                                        className={`mt-0.5 text-sm font-medium ${
                                            isOverdue
                                                ? 'text-rose-800'
                                                : 'text-amber-900'
                                        }`}
                                    >
                                        {nextPayment.type === 'invoice'
                                            ? `Invoice ${nextPayment.invoiceId}`
                                            : 'Installment payment'}{' '}
                                        — due on{' '}
                                        <span className="font-semibold">
                                            {nextPayment.dueDate}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-xs text-slate-500">
                                        Amount Due
                                    </p>
                                    <p
                                        className={`text-2xl font-bold ${
                                            isOverdue
                                                ? 'text-rose-700'
                                                : 'text-amber-700'
                                        }`}
                                    >
                                        {fmt(nextPayment.amount)}
                                    </p>
                                </div>
                                {nextPayment.type === 'invoice' &&
                                    nextPayment.invoiceDbId && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                router.get(
                                                    `/billings/invoice/${nextPayment.invoiceDbId}/preview`,
                                                )
                                            }
                                            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
                                        >
                                            <Eye className="h-4 w-4" />
                                            View Invoice
                                        </button>
                                    )}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── Invoice list (full width) ────────────────────────────── */}
                <section className="m-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionHeader
                        label="Billing records"
                        title="Invoice List"
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {[
                                        'Invoice #',
                                        'Course',
                                        'Issued',
                                        'Due',
                                        'Total',
                                        'Paid',
                                        'Due Amt',
                                        'Status',
                                        '',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="pr-4 pb-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase last:pr-0"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="py-8 text-center text-slate-400"
                                        >
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    invoices.map((inv) => (
                                        <tr
                                            key={inv.id}
                                            className="border-b border-slate-50 transition hover:bg-slate-50/60"
                                        >
                                            <td className="py-3 pr-4 font-mono text-xs font-medium text-slate-700">
                                                {inv.invoiceNumber}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700">
                                                {inv.course}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-500">
                                                {inv.issueDate}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-500">
                                                {inv.dueDate}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700">
                                                {fmt(inv.totalAmount)}
                                            </td>
                                            <td className="py-3 pr-4 text-emerald-600">
                                                {fmt(inv.paidAmount)}
                                            </td>
                                            <td className="py-3 pr-4 font-semibold text-rose-600">
                                                {inv.dueAmount > 0
                                                    ? fmt(inv.dueAmount)
                                                    : '—'}
                                            </td>
                                            <td className="py-3 pr-4">
                                                <StatusBadge
                                                    status={inv.status}
                                                />
                                            </td>
                                            <td className="py-3">
                                                <button
                                                    type="button"
                                                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
                                                    onClick={() =>
                                                        router.get(
                                                            `/billings/invoice/${inv.id}/preview`,
                                                        )
                                                    }
                                                >
                                                    <Eye className="h-3.5 w-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Fee breakdown per invoice */}
                    {invoices.some((inv) => inv.items.length > 0) && (
                        <details className="mt-5">
                            <summary className="cursor-pointer text-xs font-semibold tracking-widest text-slate-400 uppercase transition select-none hover:text-slate-600">
                                Show Fee Breakdown
                            </summary>
                            <div className="mt-4 space-y-4">
                                {invoices
                                    .filter((inv) => inv.items.length > 0)
                                    .map((inv) => (
                                        <div key={inv.id}>
                                            <p className="mb-2 text-xs font-semibold text-slate-500">
                                                {inv.invoiceNumber} —{' '}
                                                {inv.course}
                                            </p>
                                            <table className="w-full text-xs">
                                                <thead>
                                                    <tr className="border-b border-slate-100">
                                                        {[
                                                            'Fee Type',
                                                            'Qty',
                                                            'Unit Price',
                                                            'Total',
                                                        ].map((h) => (
                                                            <th
                                                                key={h}
                                                                className="pr-4 pb-2 text-left font-semibold text-slate-400 uppercase last:pr-0"
                                                            >
                                                                {h}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {inv.items.map(
                                                        (item, i) => (
                                                            <tr
                                                                key={i}
                                                                className="border-b border-slate-50"
                                                            >
                                                                <td className="py-2 pr-4 text-slate-700">
                                                                    {
                                                                        item.feeType
                                                                    }
                                                                </td>
                                                                <td className="py-2 pr-4 text-slate-500">
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </td>
                                                                <td className="py-2 pr-4 text-slate-500">
                                                                    {fmt(
                                                                        item.unitPrice,
                                                                    )}
                                                                </td>
                                                                <td className="py-2 font-medium text-slate-700">
                                                                    {fmt(
                                                                        item.total,
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                            </div>
                        </details>
                    )}
                </section>

                {/* ── Course payment breakdown ─────────────────────────────── */}
                <section className="m-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionHeader
                        label="Per course"
                        title="Course Breakdown"
                    />
                    {courseBreakdown.length === 0 ? (
                        <p className="text-sm text-slate-400">
                            No course data available.
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {courseBreakdown.map((cb) => {
                                const pct =
                                    cb.totalBilled > 0
                                        ? Math.min(
                                              100,
                                              Math.round(
                                                  (cb.totalPaid /
                                                      cb.totalBilled) *
                                                      100,
                                              ),
                                          )
                                        : 0;
                                return (
                                    <div
                                        key={cb.course}
                                        className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                                    >
                                        <div className="mb-3 flex items-center gap-2">
                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                                                <CreditCard className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-slate-900">
                                                    {cb.course}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {cb.invoiceCount} invoice
                                                    {cb.invoiceCount !== 1
                                                        ? 's'
                                                        : ''}
                                                </p>
                                            </div>
                                        </div>
                                        {/* Progress bar */}
                                        <div className="mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                                            <div
                                                className="h-full rounded-full bg-emerald-500 transition-all"
                                                style={{ width: `${pct}%` }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 text-center">
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Billed
                                                </p>
                                                <p className="text-xs font-semibold text-slate-700">
                                                    {fmt(cb.totalBilled)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Paid
                                                </p>
                                                <p className="text-xs font-semibold text-emerald-600">
                                                    {fmt(cb.totalPaid)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-slate-400">
                                                    Due
                                                </p>
                                                <p className="text-xs font-semibold text-rose-600">
                                                    {fmt(cb.totalDue)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>

                {/* ── Payment history ──────────────────────────────────────── */}
                <section className="m-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <SectionHeader
                        label="Transactions"
                        title="Payment History"
                    />
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100">
                                    {[
                                        'Invoice',
                                        'Date',
                                        'Amount',
                                        'Method',
                                        'Transaction ID',
                                        'Note',
                                        'Status',
                                    ].map((h) => (
                                        <th
                                            key={h}
                                            className="pr-4 pb-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase last:pr-0"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="py-8 text-center text-slate-400"
                                        >
                                            No payments recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    payments.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-slate-50 transition hover:bg-slate-50/60"
                                        >
                                            <td className="py-3 pr-4">
                                                <button
                                                    type="button"
                                                    className="font-mono text-xs font-medium text-blue-600 hover:underline"
                                                    onClick={() =>
                                                        router.get(
                                                            `/billings/invoice/${p.invoiceId}/preview`,
                                                        )
                                                    }
                                                >
                                                    {p.invoiceNumber}
                                                </button>
                                            </td>
                                            <td className="py-3 pr-4 text-slate-500">
                                                {p.paymentDate}
                                            </td>
                                            <td className="py-3 pr-4 font-semibold text-emerald-600">
                                                {fmt(p.amount)}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700 capitalize">
                                                {p.method}
                                            </td>
                                            <td className="py-3 pr-4 font-mono text-xs text-slate-500">
                                                {p.transactionId}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-500">
                                                {p.note || '—'}
                                            </td>
                                            <td className="py-3">
                                                <StatusBadge
                                                    status={p.status}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
