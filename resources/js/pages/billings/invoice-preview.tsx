import BillingTabs from '@/components/BillingTabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CreditCard,
    Download,
    Pencil,
    Printer,
    X,
} from 'lucide-react';
import { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface PreviewProps {
    invoice: {
        id: number;
        invoice_number: string;
        status: 'draft' | 'sent' | 'paid' | 'cancelled';
        issue_date: string | null;
        due_date: string | null;
        sub_total: number;
        discount_amount: number;
        tax_amount: number;
        total_amount: number;
        paid_amount: number;
        due_amount: number;
        notes: string | null;
        meta: Record<string, unknown>;
    };
    student: {
        id: number;
        name: string;
        student_uid: string | null;
        phone: string | null;
        email: string;
        address: string | null;
        guardian_name: string | null;
    };
    items: Array<{
        id: number;
        fee_type: string;
        description: string | null;
        quantity: number;
        unit_price: number;
        total: number;
    }>;
    payments: Array<{
        id: number;
        amount: number;
        method: string | null;
        status: string;
        transaction_id: string | null;
        payment_date: string | null;
    }>;
    site: {
        name: string;
        logo: string | null;
        email: string | null;
        phone: string | null;
        address: string | null;
    };
    generatedBy: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (v: number) =>
    v.toLocaleString('en-BD', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

function StatusBadge({
    status,
}: {
    status: PreviewProps['invoice']['status'];
}) {
    const map: Record<string, string> = {
        draft: 'bg-slate-100 text-slate-600 border-slate-200',
        sent: 'bg-blue-50 text-blue-700 border-blue-200',
        paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
    };
    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold tracking-wide uppercase ${map[status] ?? map.draft}`}
        >
            {status}
        </span>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InvoicePreview({
    invoice,
    student,
    items,
    payments,
    site,
    generatedBy,
}: PreviewProps) {
    const { props } = usePage<{ flash?: { success?: string } }>();
    const flash = props.flash;

    const [showPayForm, setShowPayForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        amount: '' as number | '',
        method: '',
        transaction_id: '',
        payment_date: new Date().toISOString().split('T')[0],
        note: '',
    });

    function submitPayment(e: React.FormEvent) {
        e.preventDefault();
        post(`/billings/invoice/${invoice.id}/pay`, {
            onSuccess: () => {
                setShowPayForm(false);
                reset();
            },
        });
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Billing Dashboard', href: '/billings' },
        { title: 'Invoices', href: '/billings/invoices' },
        {
            title: invoice.invoice_number,
            href: `/billings/invoice/${invoice.id}/preview`,
        },
    ];

    const paymentStatus = (invoice.meta?.payment_status as string) ?? 'unpaid';
    const paymentMethod = (invoice.meta?.payment_method as string) ?? null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #invoice-content,
                    #invoice-content * { visibility: visible; }
                    #invoice-content {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                    }
                }
            `}</style>

            <div className="space-y-4">
                <BillingTabs title={`Invoice ${invoice.invoice_number}`} />

                {/* Flash success banner */}
                {flash?.success && (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-sm font-medium text-emerald-700">
                        {flash.success}
                    </div>
                )}

                {/* Action bar — hidden on print */}
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm print:hidden">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.history.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Invoices
                    </Button>

                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => window.print()}
                    >
                        <Printer className="h-4 w-4" />
                        Print
                    </Button>

                    <a href={`/billings/invoice/${invoice.id}/pdf`}>
                        <Button className="gap-2 bg-slate-900 hover:bg-slate-700">
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                    </a>

                    {invoice.due_amount > 0 && (
                        <Button
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => setShowPayForm((v) => !v)}
                        >
                            <CreditCard className="h-4 w-4" />
                            {showPayForm ? 'Cancel Payment' : 'Record Payment'}
                        </Button>
                    )}

                    <Button
                        variant="outline"
                        className="ml-auto gap-2"
                        disabled
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </Button>
                </div>

                {/* Record Payment panel — shown when due > 0 and button clicked */}
                {showPayForm && invoice.due_amount > 0 && (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 shadow-sm print:hidden">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">
                                    Record Payment
                                </h3>
                                <p className="text-xs text-slate-500">
                                    Outstanding due:{' '}
                                    <span className="font-mono font-bold text-rose-600">
                                        TK
                                        {invoice.due_amount.toLocaleString(
                                            'en-BD',
                                            { minimumFractionDigits: 2 },
                                        )}
                                    </span>
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPayForm(false)}
                                className="rounded-lg p-1 text-slate-400 hover:text-slate-600"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>

                        <form
                            onSubmit={submitPayment}
                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            <div>
                                <Label className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                    Amount (TK) *
                                </Label>
                                <Input
                                    type="number"
                                    min={0.01}
                                    max={invoice.due_amount}
                                    step="0.01"
                                    placeholder={`Max ${invoice.due_amount.toFixed(2)}`}
                                    value={data.amount}
                                    onChange={(e) =>
                                        setData(
                                            'amount',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        )
                                    }
                                />
                                {errors.amount && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                    Payment Method *
                                </Label>
                                <Select
                                    value={data.method}
                                    onValueChange={(v) => setData('method', v)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cash">
                                            Cash
                                        </SelectItem>
                                        <SelectItem value="bank">
                                            Bank Transfer
                                        </SelectItem>
                                        <SelectItem value="card">
                                            Card
                                        </SelectItem>
                                        <SelectItem value="bkash">
                                            bKash
                                        </SelectItem>
                                        <SelectItem value="nagad">
                                            Nagad
                                        </SelectItem>
                                        <SelectItem value="sslcommerz">
                                            SSLCommerz
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.method && (
                                    <p className="mt-1 text-xs text-red-500">
                                        {errors.method}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                    Payment Date
                                </Label>
                                <Input
                                    type="date"
                                    value={data.payment_date}
                                    onChange={(e) =>
                                        setData('payment_date', e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <Label className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                    Transaction ID
                                </Label>
                                <Input
                                    placeholder="TXN-XXXXXXXXX"
                                    value={data.transaction_id}
                                    onChange={(e) =>
                                        setData(
                                            'transaction_id',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-2">
                                <Label className="mb-1 text-xs font-semibold tracking-widest text-slate-400 uppercase">
                                    Note
                                </Label>
                                <Input
                                    placeholder="Optional note"
                                    value={data.note}
                                    onChange={(e) =>
                                        setData('note', e.target.value)
                                    }
                                />
                            </div>

                            <div className="flex items-end sm:col-span-2 lg:col-span-3">
                                <Button
                                    type="submit"
                                    disabled={
                                        processing ||
                                        !data.amount ||
                                        !data.method
                                    }
                                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    {processing ? 'Saving…' : 'Confirm Payment'}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Invoice content */}
                <div
                    id="invoice-content"
                    className="rounded-2xl border border-slate-200 bg-white shadow-sm"
                >
                    <div className="p-8">
                        {/* ── Header ── */}
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                {site.logo && (
                                    <img
                                        src={site.logo}
                                        alt={site.name}
                                        className="mb-2 max-h-14 max-w-[160px] object-contain"
                                    />
                                )}
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {site.name}
                                </h1>
                                {site.address && (
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {site.address}
                                    </p>
                                )}
                                {site.phone && (
                                    <p className="text-xs text-slate-500">
                                        {site.phone}
                                    </p>
                                )}
                                {site.email && (
                                    <p className="text-xs text-slate-500">
                                        {site.email}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="text-3xl font-bold text-slate-900">
                                    INVOICE
                                </p>
                                <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                                    {invoice.invoice_number}
                                </p>
                                {invoice.issue_date && (
                                    <p className="text-xs text-slate-500">
                                        Date: {invoice.issue_date}
                                    </p>
                                )}
                                {invoice.due_date && (
                                    <p className="text-xs text-slate-500">
                                        Due: {invoice.due_date}
                                    </p>
                                )}
                                <div className="mt-2">
                                    <StatusBadge status={invoice.status} />
                                </div>
                            </div>
                        </div>

                        <hr className="mb-6 border-slate-200" />

                        {/* ── Bill To + Payment Details ── */}
                        <div className="mb-6 grid gap-4 sm:grid-cols-2">
                            {/* Bill To */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                    Bill To
                                </p>
                                <p className="text-base font-bold text-slate-900">
                                    {student.name}
                                </p>
                                {student.student_uid && (
                                    <p className="text-xs text-slate-500">
                                        UID: {student.student_uid}
                                    </p>
                                )}
                                {student.phone && (
                                    <p className="text-xs text-slate-500">
                                        {student.phone}
                                    </p>
                                )}
                                {student.email && (
                                    <p className="text-xs text-slate-500">
                                        {student.email}
                                    </p>
                                )}
                                {student.address && (
                                    <p className="mt-1 text-xs text-slate-400">
                                        {student.address}
                                    </p>
                                )}
                            </div>

                            {/* Payment Details */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                    Payment Details
                                </p>
                                <div className="space-y-1.5 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">
                                            Status
                                        </span>
                                        <span className="font-semibold text-slate-800 capitalize">
                                            {paymentStatus}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">
                                            Method
                                        </span>
                                        <span className="text-slate-700 capitalize">
                                            {paymentMethod ?? '—'}
                                        </span>
                                    </div>
                                    <hr className="border-slate-200" />
                                    <div className="flex justify-between">
                                        <span className="text-slate-500">
                                            Grand Total
                                        </span>
                                        <span className="font-bold text-slate-900">
                                            ৳{fmt(invoice.total_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-emerald-600">
                                            Paid
                                        </span>
                                        <span className="font-semibold text-emerald-600">
                                            ৳{fmt(invoice.paid_amount)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-bold text-rose-600">
                                            Due
                                        </span>
                                        <span className="font-bold text-rose-600">
                                            ৳{fmt(invoice.due_amount)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── Items Table ── */}
                        <div className="mb-6 overflow-x-auto rounded-xl border border-slate-200">
                            <table className="w-full min-w-[540px] text-sm">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-widest uppercase">
                                            #
                                        </th>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-widest uppercase">
                                            Fee Type
                                        </th>
                                        <th className="px-4 py-3 text-left text-[10px] font-semibold tracking-widest uppercase">
                                            Description
                                        </th>
                                        <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-widest uppercase">
                                            Qty
                                        </th>
                                        <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-widest uppercase">
                                            Unit Price
                                        </th>
                                        <th className="px-4 py-3 text-right text-[10px] font-semibold tracking-widest uppercase">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {items.map((item, idx) => (
                                        <tr
                                            key={item.id}
                                            className={
                                                idx % 2 === 1
                                                    ? 'bg-slate-50'
                                                    : 'bg-white'
                                            }
                                        >
                                            <td className="px-4 py-3 text-slate-500">
                                                {idx + 1}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-900">
                                                {item.fee_type}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-400">
                                                {item.description ?? '—'}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-4 py-3 text-right text-slate-700">
                                                ৳{fmt(item.unit_price)}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold text-slate-900">
                                                ৳{fmt(item.total)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ── Summary ── */}
                        <div className="mb-6 flex justify-end">
                            <div className="w-full max-w-xs space-y-1 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">
                                        ৳{fmt(invoice.sub_total)}
                                    </span>
                                </div>
                                {invoice.discount_amount > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Discount</span>
                                        <span className="font-medium text-emerald-600">
                                            −৳{fmt(invoice.discount_amount)}
                                        </span>
                                    </div>
                                )}
                                {invoice.tax_amount > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Tax & Charges</span>
                                        <span className="font-medium">
                                            ৳{fmt(invoice.tax_amount)}
                                        </span>
                                    </div>
                                )}
                                <hr className="border-t-2 border-slate-900" />
                                <div className="flex justify-between text-base font-bold text-slate-900">
                                    <span>Grand Total</span>
                                    <span>৳{fmt(invoice.total_amount)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span className="text-emerald-600">
                                        Paid
                                    </span>
                                    <span className="font-semibold text-emerald-600">
                                        ৳{fmt(invoice.paid_amount)}
                                    </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-rose-50 px-3 py-2 text-base font-bold text-rose-600">
                                    <span>Due Amount</span>
                                    <span>৳{fmt(invoice.due_amount)}</span>
                                </div>
                            </div>
                        </div>

                        {/* ── Payment Records ── */}
                        {payments.length > 0 && (
                            <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                                <p className="mb-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                    Payment Records
                                </p>
                                <div className="space-y-2">
                                    {payments.map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex flex-wrap items-center gap-2 text-sm text-slate-700"
                                        >
                                            <span className="font-bold text-slate-900">
                                                ৳{fmt(p.amount)}
                                            </span>
                                            <span>
                                                via{' '}
                                                {p.method
                                                    ? p.method
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                      p.method.slice(1)
                                                    : 'N/A'}
                                            </span>
                                            {p.transaction_id && (
                                                <span className="font-mono text-xs text-slate-500">
                                                    · TXN: {p.transaction_id}
                                                </span>
                                            )}
                                            {p.payment_date && (
                                                <span className="text-xs text-slate-500">
                                                    · {p.payment_date}
                                                </span>
                                            )}
                                            <span
                                                className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                                                    p.status === 'verified' ||
                                                    p.status === 'approved'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : p.status === 'failed'
                                                          ? 'bg-rose-100 text-rose-700'
                                                          : 'bg-slate-100 text-slate-600'
                                                }`}
                                            >
                                                {p.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Notes ── */}
                        {invoice.notes && (
                            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                    Notes
                                </p>
                                <p className="text-sm text-slate-600">
                                    {invoice.notes}
                                </p>
                            </div>
                        )}

                        {/* ── Terms & Conditions ── */}
                        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-1">
                            <p className="mb-2 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                Terms &amp; Conditions
                            </p>
                            <ul className="list-disc space-y-1 pl-4 text-xs leading-relaxed text-slate-600">
                                <li>
                                    All courses offered by Skills Development
                                    Centre (SDC) are strictly{' '}
                                    <strong>Non-Refundable</strong>.
                                </li>
                                <li>
                                    By making payment, you agree to our Terms of
                                    Service and Privacy Policy.
                                </li>
                                <li>
                                    Privacy Policy:{' '}
                                    <a
                                        href="https://sdcbd.net/privacy-policy-2/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-700 hover:underline"
                                    >
                                        https://sdcbd.net/privacy-policy-2/
                                    </a>
                                </li>
                            </ul>
                        </div>
                        {/* ── Footer ── */}
                        <div className="mt-8 border-t border-slate-200 pt-4 text-center text-xs text-slate-400">
                            <p>
                                {site.name} · Generated on{' '}
                                {new Date().toLocaleDateString('en-GB', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                })}
                            </p>
                            <p className="mt-1">Generated by: {generatedBy}</p>
                            <p className="mt-1">
                                This is a computer-generated invoice. No
                                signature required.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
