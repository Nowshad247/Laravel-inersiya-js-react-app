import BillingTabs from '@/components/BillingTabs';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    AlertCircle,
    BookOpen,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Clock,
    CreditCard,
    Download,
    Eye,
    FileText,
    Loader2,
    Monitor,
    Plus,
    Receipt,
    Save,
    Search,
    Tag,
    Trash2,
    User,
    Wifi,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface StudentResult {
    id: number;
    name: string;
    student_uid: string | null;
    phone: string | null;
    email: string;
}

interface BatchInfo {
    id: number;
    name: string;
    batch_code: string | null;
    course_name: string | null;
    course_code: string | null;
    start_date: string | null;
    end_date: string | null;
    total_class: string | null;
    batch_status: string | null;
    price: number | null;
    discount_price: number | null;
    class_time: string | null;
    weekdays: string[] | null;
    delivery_mode: 'online' | 'offline' | null;
}

interface StudentData {
    id: number;
    name: string;
    student_uid: string | null;
    status: string | null;
    phone: string | null;
    email: string;
    address: string | null;
    father_name: string | null;
    mother_name: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    guardian_relation: string | null;
    batches: BatchInfo[];
}

interface FeeItem {
    id: number;
    batchId?: number;
    feeType: string;
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const FEE_TYPES = [
    'Admission Fee',
    'Registration Fee',
    'Course Fee',
    'Monthly Fee',
    'Exam Fee',
    'Certification Fee',
    'Workshop Fee',
    'Other Charge',
];

const TODAY = new Date().toISOString().split('T')[0];

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Billing Dashboard', href: '/billings' },
    { title: 'Create Invoice', href: '/billings/create-invoice' },
];

// ─── Reusable sub-components ──────────────────────────────────────────────────

function Field({
    label,
    required,
    children,
    className = '',
}: {
    label: string;
    required?: boolean;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <Label className="text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                {label}
                {required && <span className="ml-0.5 text-rose-400">*</span>}
            </Label>
            {children}
        </div>
    );
}

function SectionCard({
    title,
    icon,
    badge,
    collapsible = false,
    defaultOpen = true,
    children,
}: {
    title: string;
    icon?: React.ReactNode;
    badge?: React.ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => collapsible && setOpen((v) => !v)}
                className={`flex w-full items-center gap-3 px-6 py-4 text-left ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
            >
                {icon && (
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        {icon}
                    </span>
                )}
                <span className="flex-1 text-sm font-semibold text-slate-800">
                    {title}
                </span>
                {badge && <span>{badge}</span>}
                {collapsible &&
                    (open ? (
                        <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                    ))}
            </button>
            <Separator />
            {open && <div className="px-6 py-5">{children}</div>}
        </div>
    );
}

function InfoPill({
    label,
    value,
}: {
    label: string;
    value: string | null | undefined;
}) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold tracking-widest text-slate-400 uppercase">
                {label}
            </span>
            <span className="text-sm text-slate-700">{value || '—'}</span>
        </div>
    );
}

function BatchStatusChip({
    status,
    dark = false,
}: {
    status: string | null;
    dark?: boolean;
}) {
    if (!status) return null;
    const maps: Record<string, string> = {
        active: 'bg-emerald-100 text-emerald-700',
        ongoing: 'bg-blue-100 text-blue-700',
        upcoming: 'bg-amber-100 text-amber-700',
        completed: 'bg-slate-100 text-slate-600',
        cancelled: 'bg-rose-100 text-rose-700',
    };
    const cls = dark
        ? 'bg-white/20 text-white'
        : (maps[status.toLowerCase()] ?? 'bg-slate-100 text-slate-600');
    return (
        <span
            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${cls}`}
        >
            {status}
        </span>
    );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CreateInvoice() {
    // Invoice info
    const [invoiceDate, setInvoiceDate] = useState(TODAY);
    const [dueDate, setDueDate] = useState('');
    const [invoiceStatus, setInvoiceStatus] = useState('draft');
    const [notes, setNotes] = useState('');

    // Student search
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<StudentResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [student, setStudent] = useState<StudentData | null>(null);
    const [isFetchingStudent, setIsFetchingStudent] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const isSelectingRef = useRef(false);
    const autoSelectRef = useRef(false);

    // Batches
    const [selectedBatchIds, setSelectedBatchIds] = useState<Set<number>>(
        new Set(),
    );

    // Fee items
    const [feeItems, setFeeItems] = useState<FeeItem[]>([
        {
            id: Date.now(),
            feeType: '',
            description: '',
            quantity: 1,
            unitPrice: 0,
            amount: 0,
        },
    ]);

    // Discount
    const [discountType, setDiscountType] = useState<'fixed' | 'percentage'>(
        'fixed',
    );
    const [discountValue, setDiscountValue] = useState(0);
    const [scholarship, setScholarship] = useState('');
    const [couponCode, setCouponCode] = useState('');
    const [discountReason, setDiscountReason] = useState('');

    // Tax & extra
    const [taxType, setTaxType] = useState('none');
    const [taxPct, setTaxPct] = useState(0);
    const [vatPct, setVatPct] = useState(0);
    const [serviceCharge, setServiceCharge] = useState(0);
    const [lateFee, setLateFee] = useState(0);
    const [otherCharges, setOtherCharges] = useState(0);

    // Payment
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentStatus, setPaymentStatus] = useState('unpaid');
    const [paidAmount, setPaidAmount] = useState(0);
    const [transactionId, setTransactionId] = useState('');
    const [paymentDate, setPaymentDate] = useState('');

    // Installment
    const [installmentEnabled, setInstallmentEnabled] = useState(false);
    const [numInstallments, setNumInstallments] = useState(2);
    const [firstPaymentDate, setFirstPaymentDate] = useState('');

    // Notifications
    const [generateReceipt, setGenerateReceipt] = useState(false);
    const [sendEmail, setSendEmail] = useState(false);
    const [sendSms, setSendSms] = useState(false);
    const [sendReminder, setSendReminder] = useState(false);

    // Submit state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    // ── Derived calculations ──────────────────────────────────────────────────

    const subtotal = feeItems.reduce((s, f) => s + f.amount, 0);
    const discountAmt =
        discountType === 'percentage'
            ? (subtotal * discountValue) / 100
            : discountValue;
    const afterDiscount = Math.max(0, subtotal - discountAmt);
    const taxAmt = (afterDiscount * taxPct) / 100;
    const vatAmt = (afterDiscount * vatPct) / 100;
    const extras = serviceCharge + lateFee + otherCharges;
    const grandTotal = afterDiscount + taxAmt + vatAmt + extras;
    const dueAmount = Math.max(0, grandTotal - paidAmount);
    const installmentAmt =
        numInstallments > 0 ? grandTotal / numInstallments : 0;

    const fmt = (v: number) =>
        v.toLocaleString('en-BD', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    // ── Click-outside closes dropdown ─────────────────────────────────────────

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setShowDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // ── Pre-fill from ?uid= query param (e.g. redirect from admission approval) ─

    useEffect(() => {
        const uid = new URLSearchParams(window.location.search).get('uid');
        if (uid) {
            autoSelectRef.current = true;
            setSearchQuery(uid);
        }
    }, []);

    // ── Debounced student search ───────────────────────────────────────────────

    useEffect(() => {
        if (isSelectingRef.current) return;
        const q = searchQuery.trim();
        if (q.length < 2) {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }
        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(
                    `/api/billing/student-search?q=${encodeURIComponent(q)}`,
                );
                if (res.ok) {
                    const data: StudentResult[] = await res.json();
                    if (autoSelectRef.current && data.length > 0) {
                        autoSelectRef.current = false;
                        selectStudent(data[0].id);
                    } else {
                        setSearchResults(data);
                        setShowDropdown(data.length > 0);
                    }
                }
            } catch {
                /* silent */
            } finally {
                setIsSearching(false);
            }
        }, 350);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // ── Student selection ─────────────────────────────────────────────────────

    const selectStudent = async (id: number) => {
        isSelectingRef.current = true;
        setShowDropdown(false);
        setSearchResults([]);
        setStudent(null);
        setSelectedBatchIds(new Set());
        setFeeItems([
            {
                id: Date.now(),
                feeType: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
                amount: 0,
            },
        ]);
        setIsFetchingStudent(true);
        try {
            const res = await fetch(`/api/billing/student/${id}`);
            if (res.ok) {
                const data: StudentData = await res.json();
                setStudent(data);
                setSearchQuery(data.name);
            }
        } catch {
            /* silent */
        } finally {
            setIsFetchingStudent(false);
            isSelectingRef.current = false;
        }
    };

    const clearStudent = () => {
        setStudent(null);
        setSearchQuery('');
        setSearchResults([]);
        setSelectedBatchIds(new Set());
        setFeeItems([
            {
                id: Date.now(),
                feeType: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
                amount: 0,
            },
        ]);
        setTimeout(() => searchRef.current?.focus(), 0);
    };

    // ── Batch toggle ──────────────────────────────────────────────────────────

    const toggleBatch = (batch: BatchInfo) => {
        const isSelected = selectedBatchIds.has(batch.id);
        const effectivePrice = Number(batch.discount_price ?? batch.price ?? 0);

        if (isSelected) {
            const next = new Set(selectedBatchIds);
            next.delete(batch.id);
            setSelectedBatchIds(next);
            setFeeItems((prev) => prev.filter((f) => f.batchId !== batch.id));
        } else {
            const next = new Set(selectedBatchIds);
            next.add(batch.id);
            setSelectedBatchIds(next);
            setFeeItems((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    batchId: batch.id,
                    feeType: 'Course Fee',
                    description: [batch.course_name, batch.name]
                        .filter(Boolean)
                        .join(' – '),
                    quantity: 1,
                    unitPrice: effectivePrice,
                    amount: effectivePrice,
                },
            ]);
        }
    };

    // ── Fee item handlers ─────────────────────────────────────────────────────

    const addFeeItem = () =>
        setFeeItems((prev) => [
            ...prev,
            {
                id: Date.now(),
                feeType: '',
                description: '',
                quantity: 1,
                unitPrice: 0,
                amount: 0,
            },
        ]);

    const removeFeeItem = (id: number) => {
        const item = feeItems.find((f) => f.id === id);
        if (item?.batchId) {
            const next = new Set(selectedBatchIds);
            next.delete(item.batchId);
            setSelectedBatchIds(next);
        }
        setFeeItems((prev) => prev.filter((f) => f.id !== id));
    };

    const updateFeeItem = (
        id: number,
        field: keyof FeeItem,
        value: string | number,
    ) =>
        setFeeItems((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;
                const updated = { ...item, [field]: value };
                if (field === 'quantity' || field === 'unitPrice') {
                    updated.amount =
                        Number(updated.quantity) * Number(updated.unitPrice);
                }
                return updated;
            }),
        );

    const handleSubmit = (action: 'draft' | 'create' | 'collect') => {
        const errs: Record<string, string> = {};
        if (!student)
            errs.student_id = 'Please select a student before submitting.';
        if (!invoiceDate) errs.invoice_date = 'Invoice date is required.';
        if (action !== 'draft') {
            if (!dueDate) errs.due_date = 'Due date is required.';
            const validItems = feeItems.filter(
                (f) => f.feeType && f.quantity > 0,
            );
            if (validItems.length === 0)
                errs.fee_items =
                    'Please add at least one fee item with a fee type.';
        }
        if (action === 'collect') {
            if (!paidAmount || paidAmount <= 0)
                errs.paid_amount =
                    'Paid amount must be greater than 0 when collecting payment.';
            if (!paymentMethod)
                errs.payment_method = 'Please select a payment method.';
        }

        if (Object.keys(errs).length > 0) {
            setFormErrors(errs);
            window.scrollTo({ top: 200, behavior: 'smooth' });
            return;
        }

        setFormErrors({});

        const payload = {
            action,
            student_id: student?.id,
            invoice_date: invoiceDate,
            due_date: dueDate,
            invoice_status: invoiceStatus,
            notes,
            batch_ids: Array.from(selectedBatchIds),
            fee_items: feeItems.map((f) => ({
                fee_type: f.feeType,
                description: f.description,
                quantity: f.quantity,
                unit_price: f.unitPrice,
                batchId: f.batchId,
            })),
            discount_type: discountType,
            discount_value: discountValue,
            scholarship,
            coupon_code: couponCode,
            discount_reason: discountReason,
            tax_type: taxType,
            tax_percentage: taxPct,
            vat_percentage: vatPct,
            service_charge: serviceCharge,
            late_fee: lateFee,
            other_charges: otherCharges,
            payment_method: paymentMethod,
            payment_status: paymentStatus,
            paid_amount: paidAmount,
            transaction_id: transactionId,
            payment_date: paymentDate,
            installment_enabled: installmentEnabled,
            num_installments: numInstallments,
            first_payment_date: firstPaymentDate,
            generate_receipt: generateReceipt,
            send_email: sendEmail,
            send_sms: sendSms,
            send_reminder: sendReminder,
        };

        router.post('/billings/invoice/store', payload, {
            onStart: () => setIsSubmitting(true),
            onFinish: () => setIsSubmitting(false),
            onError: (errors) => {
                setFormErrors(errors as Record<string, string>);
                window.scrollTo({ top: 200, behavior: 'smooth' });
            },
            preserveState: true,
            preserveScroll: false,
        });
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Render
    // ─────────────────────────────────────────────────────────────────────────

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Invoice" />

            <div className="space-y-4">
                <BillingTabs title="Create New Invoice" />

                <form className="space-y-4 px-2 pb-12">
                    {/* Global error banner */}
                    {Object.keys(formErrors).length > 0 && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-4">
                            <p className="mb-1 text-sm font-semibold text-rose-700">
                                Please fix the following errors:
                            </p>
                            <ul className="space-y-0.5 text-sm text-rose-600">
                                {Object.entries(formErrors).map(([k, v]) => (
                                    <li key={k}>· {v}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* ── 1 & 2. Invoice + Student side by side ────────────── */}
                    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
                        {/* ── 1. Invoice Information ───────────────────────────── */}
                        <SectionCard
                            title="Invoice Information"
                            icon={<FileText className="h-4 w-4" />}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <Field
                                    label="Invoice Number"
                                    className="col-span-2"
                                >
                                    <Input
                                        value="Auto Generated"
                                        readOnly
                                        className="bg-slate-50 font-mono text-slate-400"
                                    />
                                </Field>
                                <Field label="Invoice Date" required>
                                    <Input
                                        type="date"
                                        value={invoiceDate}
                                        onChange={(e) =>
                                            setInvoiceDate(e.target.value)
                                        }
                                    />
                                </Field>
                                <Field label="Due Date" required>
                                    <Input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) =>
                                            setDueDate(e.target.value)
                                        }
                                    />
                                </Field>
                                <Field
                                    label="Invoice Status"
                                    className="col-span-2"
                                >
                                    <Select
                                        value={invoiceStatus}
                                        onValueChange={setInvoiceStatus}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">
                                                Draft
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                Pending
                                            </SelectItem>
                                            <SelectItem value="paid">
                                                Paid
                                            </SelectItem>
                                            <SelectItem value="partial_paid">
                                                Partial Paid
                                            </SelectItem>
                                            <SelectItem value="overdue">
                                                Overdue
                                            </SelectItem>
                                            <SelectItem value="cancelled">
                                                Cancelled
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                            <div className="mt-4">
                                <Field label="Notes">
                                    <Textarea
                                        placeholder="Any notes or payment instructions for this invoice…"
                                        rows={3}
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        className="resize-none"
                                    />
                                </Field>
                            </div>
                        </SectionCard>

                        {/* ── 2. Student Information ────────────────────────────── */}
                        <SectionCard
                            title="Student Information"
                            icon={<User className="h-4 w-4" />}
                        >
                            {/* Search field */}
                            <div ref={dropdownRef} className="relative mb-5">
                                <Field label="Search Student" required>
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            ref={searchRef}
                                            placeholder="Type student ID, UID, name, or phone…"
                                            className="pr-10 pl-9"
                                            value={searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                if (student) setStudent(null);
                                            }}
                                            onFocus={() =>
                                                searchResults.length > 0 &&
                                                setShowDropdown(true)
                                            }
                                            autoComplete="off"
                                        />
                                        {isSearching && (
                                            <Loader2 className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                                        )}
                                    </div>
                                </Field>

                                {/* Dropdown */}
                                {showDropdown && searchResults.length > 0 && (
                                    <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                                        {searchResults.map((r) => (
                                            <button
                                                key={r.id}
                                                type="button"
                                                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50"
                                                onMouseDown={() =>
                                                    selectStudent(r.id)
                                                }
                                            >
                                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700">
                                                    {r.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-slate-900">
                                                        {r.name}
                                                    </p>
                                                    <p className="truncate text-xs text-slate-500">
                                                        ID: {r.id}
                                                        {r.student_uid &&
                                                            ` · UID: ${r.student_uid}`}
                                                        {r.phone &&
                                                            ` · ${r.phone}`}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Fetching spinner */}
                            {isFetchingStudent && (
                                <div className="flex items-center justify-center py-8 text-slate-400">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    <span className="text-sm">
                                        Loading student…
                                    </span>
                                </div>
                            )}

                            {/* Student card */}
                            {student && !isFetchingStudent && (
                                <div className="relative rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <button
                                        type="button"
                                        onClick={clearStudent}
                                        title="Clear student"
                                        className="absolute top-3 right-3 rounded-lg p-1 text-slate-400 transition hover:bg-white hover:text-slate-600"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>

                                    {/* Avatar + name row */}
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-sm font-bold text-white">
                                            {student.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-semibold text-slate-900">
                                                {student.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                ID&nbsp;#{student.id}
                                                {student.student_uid && (
                                                    <>
                                                        {' '}
                                                        ·{' '}
                                                        <span className="font-mono">
                                                            {
                                                                student.student_uid
                                                            }
                                                        </span>
                                                    </>
                                                )}
                                            </p>
                                        </div>
                                        {student.status && (
                                            <span
                                                className={`flex-shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
                                                    student.status === 'active'
                                                        ? 'bg-emerald-100 text-emerald-700'
                                                        : student.status ===
                                                            'inactive'
                                                          ? 'bg-slate-100 text-slate-500'
                                                          : 'bg-rose-100 text-rose-600'
                                                }`}
                                            >
                                                {student.status}
                                            </span>
                                        )}
                                        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                                    </div>

                                    <Separator className="mb-3" />

                                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                        <InfoPill
                                            label="Student UID"
                                            value={student.student_uid}
                                        />
                                        <InfoPill
                                            label="Phone"
                                            value={student.phone}
                                        />
                                        <InfoPill
                                            label="Email"
                                            value={student.email}
                                        />
                                        <InfoPill
                                            label="Father's Name"
                                            value={student.father_name}
                                        />
                                        <InfoPill
                                            label="Mother's Name"
                                            value={student.mother_name}
                                        />
                                        <InfoPill
                                            label="Guardian Name"
                                            value={student.guardian_name}
                                        />
                                        <InfoPill
                                            label="Guardian Phone"
                                            value={student.guardian_phone}
                                        />
                                        <InfoPill
                                            label="Relation"
                                            value={student.guardian_relation}
                                        />
                                        {student.address && (
                                            <div className="col-span-2">
                                                <InfoPill
                                                    label="Address"
                                                    value={student.address}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Empty state */}
                            {!student && !isFetchingStudent && (
                                <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
                                    <User className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                                    <p className="text-sm text-slate-400">
                                        Search and select a student to auto-fill
                                        their details
                                    </p>
                                </div>
                            )}
                        </SectionCard>
                    </div>
                    {/* end side-by-side grid */}

                    {/* ── 3. Batch Information (dynamic) ────────────────────── */}
                    {student && (
                        <SectionCard
                            title="Batch Information"
                            icon={<BookOpen className="h-4 w-4" />}
                            badge={
                                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                                    {student.batches.length}{' '}
                                    {student.batches.length === 1
                                        ? 'batch'
                                        : 'batches'}
                                </span>
                            }
                        >
                            {student.batches.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 py-10 text-center">
                                    <AlertCircle className="mx-auto mb-2 h-6 w-6 text-slate-300" />
                                    <p className="text-sm text-slate-400">
                                        No batch records found for this student
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <p className="mb-3 text-xs text-slate-500">
                                        Select batches to automatically add
                                        their course fee to the invoice.
                                    </p>

                                    <div className="grid gap-3 lg:grid-cols-2">
                                        {student.batches.map((batch) => {
                                            const selected =
                                                selectedBatchIds.has(batch.id);
                                            const hasDiscount =
                                                batch.discount_price !== null &&
                                                batch.price !== null &&
                                                Number(batch.discount_price) <
                                                    Number(batch.price);

                                            return (
                                                <button
                                                    key={batch.id}
                                                    type="button"
                                                    onClick={() =>
                                                        toggleBatch(batch)
                                                    }
                                                    className={[
                                                        'relative rounded-xl border-2 p-4 text-left transition-all',
                                                        selected
                                                            ? 'border-slate-900 bg-slate-900'
                                                            : 'border-slate-200 bg-white hover:border-slate-400',
                                                    ].join(' ')}
                                                >
                                                    {/* Header row */}
                                                    <div className="mb-3 flex items-start justify-between gap-2">
                                                        <div className="min-w-0">
                                                            <p
                                                                className={`truncate font-semibold ${selected ? 'text-white' : 'text-slate-900'}`}
                                                            >
                                                                {batch.name}
                                                            </p>
                                                            {batch.course_name && (
                                                                <p
                                                                    className={`mt-0.5 text-xs ${selected ? 'text-slate-300' : 'text-slate-500'}`}
                                                                >
                                                                    {
                                                                        batch.course_name
                                                                    }
                                                                    {batch.course_code &&
                                                                        ` (${batch.course_code})`}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
                                                            {batch.batch_code && (
                                                                <span
                                                                    className={`rounded px-2 py-0.5 font-mono text-[11px] ${selected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}
                                                                >
                                                                    {
                                                                        batch.batch_code
                                                                    }
                                                                </span>
                                                            )}
                                                            <BatchStatusChip
                                                                status={
                                                                    batch.batch_status
                                                                }
                                                                dark={selected}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Meta row */}
                                                    <div
                                                        className={`mb-3 space-y-1.5 text-xs ${selected ? 'text-slate-300' : 'text-slate-500'}`}
                                                    >
                                                        {(batch.start_date ||
                                                            batch.end_date) && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Calendar className="h-3 w-3 flex-shrink-0" />
                                                                <span>
                                                                    {batch.start_date ??
                                                                        '?'}{' '}
                                                                    →{' '}
                                                                    {batch.end_date ??
                                                                        '?'}
                                                                </span>
                                                            </div>
                                                        )}
                                                        {batch.class_time && (
                                                            <div className="flex items-center gap-1.5">
                                                                <Clock className="h-3 w-3 flex-shrink-0" />
                                                                <span>
                                                                    {
                                                                        batch.class_time
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        {batch.delivery_mode && (
                                                            <div className="flex items-center gap-1.5">
                                                                {batch.delivery_mode ===
                                                                'online' ? (
                                                                    <Wifi className="h-3 w-3 flex-shrink-0" />
                                                                ) : (
                                                                    <Monitor className="h-3 w-3 flex-shrink-0" />
                                                                )}
                                                                <span className="capitalize">
                                                                    {
                                                                        batch.delivery_mode
                                                                    }
                                                                </span>
                                                                {batch.total_class && (
                                                                    <span className="ml-2">
                                                                        {
                                                                            batch.total_class
                                                                        }{' '}
                                                                        classes
                                                                    </span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {batch.weekdays &&
                                                            batch.weekdays
                                                                .length > 0 && (
                                                                <div className="flex flex-wrap gap-1 pt-0.5">
                                                                    {batch.weekdays.map(
                                                                        (d) => (
                                                                            <span
                                                                                key={
                                                                                    d
                                                                                }
                                                                                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${selected ? 'bg-white/15' : 'bg-slate-100'}`}
                                                                            >
                                                                                {
                                                                                    d
                                                                                }
                                                                            </span>
                                                                        ),
                                                                    )}
                                                                </div>
                                                            )}
                                                    </div>

                                                    <Separator
                                                        className={
                                                            selected
                                                                ? 'bg-white/20'
                                                                : ''
                                                        }
                                                    />

                                                    {/* Price + selector */}
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div>
                                                            {batch.price !==
                                                            null ? (
                                                                <div className="flex items-baseline gap-2">
                                                                    <span
                                                                        className={`text-lg font-bold ${selected ? 'text-white' : 'text-slate-900'}`}
                                                                    >
                                                                        ৳
                                                                        {fmt(
                                                                            Number(
                                                                                hasDiscount
                                                                                    ? batch.discount_price
                                                                                    : batch.price,
                                                                            ),
                                                                        )}
                                                                    </span>
                                                                    {hasDiscount && (
                                                                        <span
                                                                            className={`text-xs line-through ${selected ? 'text-slate-400' : 'text-slate-400'}`}
                                                                        >
                                                                            ৳
                                                                            {fmt(
                                                                                Number(
                                                                                    batch.price,
                                                                                ),
                                                                            )}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <span
                                                                    className={`text-xs ${selected ? 'text-slate-400' : 'text-slate-400'}`}
                                                                >
                                                                    Price not
                                                                    set
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Radio indicator */}
                                                        <div
                                                            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${selected ? 'border-white' : 'border-slate-300'}`}
                                                        >
                                                            {selected && (
                                                                <div className="h-2.5 w-2.5 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </SectionCard>
                    )}

                    {/* ── 4. Fee Details ────────────────────────────────────── */}
                    <SectionCard
                        title="Fee Details"
                        icon={<Receipt className="h-4 w-4" />}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-left text-[11px] font-semibold tracking-widest text-slate-400 uppercase">
                                        <th className="pr-3 pb-3">Fee Type</th>
                                        <th className="pr-3 pb-3">
                                            Description
                                        </th>
                                        <th className="w-20 pr-3 pb-3">Qty</th>
                                        <th className="w-32 pr-3 pb-3">
                                            Unit Price (৳)
                                        </th>
                                        <th className="w-32 pr-3 pb-3">
                                            Amount (৳)
                                        </th>
                                        <th className="w-10 pb-3" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {feeItems.map((item) => (
                                        <tr key={item.id}>
                                            <td className="py-2 pr-3">
                                                {item.batchId ? (
                                                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700">
                                                        {item.feeType}
                                                    </span>
                                                ) : (
                                                    <Select
                                                        value={item.feeType}
                                                        onValueChange={(v) =>
                                                            updateFeeItem(
                                                                item.id,
                                                                'feeType',
                                                                v,
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="h-9">
                                                            <SelectValue placeholder="Select type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {FEE_TYPES.map(
                                                                (t) => (
                                                                    <SelectItem
                                                                        key={t}
                                                                        value={
                                                                            t
                                                                        }
                                                                    >
                                                                        {t}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            </td>
                                            <td className="py-2 pr-3">
                                                <Input
                                                    className="h-9"
                                                    placeholder="Description"
                                                    value={item.description}
                                                    onChange={(e) =>
                                                        updateFeeItem(
                                                            item.id,
                                                            'description',
                                                            e.target.value,
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="py-2 pr-3">
                                                <Input
                                                    className="h-9 w-20"
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        updateFeeItem(
                                                            item.id,
                                                            'quantity',
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="py-2 pr-3">
                                                <Input
                                                    className="h-9 w-32"
                                                    type="number"
                                                    min={0}
                                                    placeholder="0.00"
                                                    value={item.unitPrice || ''}
                                                    onChange={(e) =>
                                                        updateFeeItem(
                                                            item.id,
                                                            'unitPrice',
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="py-2 pr-3">
                                                <Input
                                                    className="h-9 w-32 bg-slate-50 font-mono font-medium text-slate-700"
                                                    readOnly
                                                    value={fmt(item.amount)}
                                                />
                                            </td>
                                            <td className="py-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFeeItem(item.id)
                                                    }
                                                    disabled={
                                                        feeItems.length === 1 &&
                                                        !item.batchId
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-300 transition hover:bg-rose-50 hover:text-rose-500 disabled:pointer-events-none disabled:opacity-30"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addFeeItem}
                                className="gap-1.5"
                            >
                                <Plus className="h-3.5 w-3.5" />
                                Add Fee Item
                            </Button>
                            <p className="text-sm text-slate-500">
                                Subtotal:{' '}
                                <span className="font-semibold text-slate-900">
                                    ৳{fmt(subtotal)}
                                </span>
                            </p>
                        </div>
                    </SectionCard>

                    {/* ── 5. Discount ───────────────────────────────────────── */}
                    <SectionCard
                        title="Discount"
                        icon={<Tag className="h-4 w-4" />}
                        collapsible
                        defaultOpen={false}
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Field label="Discount Type">
                                <Select
                                    value={discountType}
                                    onValueChange={(v) =>
                                        setDiscountType(
                                            v as 'fixed' | 'percentage',
                                        )
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="fixed">
                                            Fixed (৳)
                                        </SelectItem>
                                        <SelectItem value="percentage">
                                            Percentage (%)
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field
                                label={`Discount Value ${discountType === 'percentage' ? '(%)' : '(৳)'}`}
                            >
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={discountValue || ''}
                                    onChange={(e) =>
                                        setDiscountValue(Number(e.target.value))
                                    }
                                />
                            </Field>
                            <Field label="Scholarship">
                                <Input
                                    placeholder="Scholarship name or reference"
                                    value={scholarship}
                                    onChange={(e) =>
                                        setScholarship(e.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Coupon Code">
                                <Input
                                    placeholder="e.g. SAVE20"
                                    value={couponCode}
                                    onChange={(e) =>
                                        setCouponCode(e.target.value)
                                    }
                                />
                            </Field>
                            <Field
                                label="Discount Reason"
                                className="sm:col-span-2"
                            >
                                <Input
                                    placeholder="Reason for discount"
                                    value={discountReason}
                                    onChange={(e) =>
                                        setDiscountReason(e.target.value)
                                    }
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ── 6. Tax & Extra Charges ────────────────────────────── */}
                    <SectionCard
                        title="Tax & Extra Charges"
                        icon={<Receipt className="h-4 w-4" />}
                        collapsible
                        defaultOpen={false}
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Field label="Tax Type">
                                <Select
                                    value={taxType}
                                    onValueChange={setTaxType}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            None
                                        </SelectItem>
                                        <SelectItem value="vat">VAT</SelectItem>
                                        <SelectItem value="income_tax">
                                            Income Tax
                                        </SelectItem>
                                        <SelectItem value="custom">
                                            Custom
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Tax Percentage (%)">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={taxPct || ''}
                                    onChange={(e) =>
                                        setTaxPct(Number(e.target.value))
                                    }
                                />
                            </Field>
                            <Field label="VAT (%)">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0"
                                    value={vatPct || ''}
                                    onChange={(e) =>
                                        setVatPct(Number(e.target.value))
                                    }
                                />
                            </Field>
                            <Field label="Service Charge (৳)">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0.00"
                                    value={serviceCharge || ''}
                                    onChange={(e) =>
                                        setServiceCharge(Number(e.target.value))
                                    }
                                />
                            </Field>
                            <Field label="Late Fee (৳)">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0.00"
                                    value={lateFee || ''}
                                    onChange={(e) =>
                                        setLateFee(Number(e.target.value))
                                    }
                                />
                            </Field>
                            <Field label="Other Charges (৳)">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0.00"
                                    value={otherCharges || ''}
                                    onChange={(e) =>
                                        setOtherCharges(Number(e.target.value))
                                    }
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ── 7. Payment Information ────────────────────────────── */}
                    <SectionCard
                        title="Payment Information"
                        icon={<CreditCard className="h-4 w-4" />}
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Field label="Payment Method">
                                <Select
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
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
                            </Field>
                            <Field label="Payment Status" required>
                                <Select
                                    value={paymentStatus}
                                    onValueChange={setPaymentStatus}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unpaid">
                                            Unpaid
                                        </SelectItem>
                                        <SelectItem value="partial">
                                            Partial
                                        </SelectItem>
                                        <SelectItem value="paid">
                                            Paid
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field label="Paid Amount (৳)">
                                <Input
                                    type="number"
                                    min={0}
                                    placeholder="0.00"
                                    value={paidAmount || ''}
                                    onChange={(e) =>
                                        setPaidAmount(Number(e.target.value))
                                    }
                                />
                            </Field>
                            <Field label="Due Amount (৳)">
                                <Input
                                    readOnly
                                    value={fmt(dueAmount)}
                                    className="bg-rose-50 font-mono font-semibold text-rose-600"
                                />
                            </Field>
                            <Field label="Transaction ID">
                                <Input
                                    placeholder="TXN-XXXXXXXXX"
                                    value={transactionId}
                                    onChange={(e) =>
                                        setTransactionId(e.target.value)
                                    }
                                />
                            </Field>
                            <Field label="Payment Date">
                                <Input
                                    type="date"
                                    value={paymentDate}
                                    onChange={(e) =>
                                        setPaymentDate(e.target.value)
                                    }
                                />
                            </Field>
                        </div>
                    </SectionCard>

                    {/* ── 8. Installment Plan ───────────────────────────────── */}
                    <SectionCard
                        title="Installment Plan"
                        icon={<Calendar className="h-4 w-4" />}
                        collapsible
                        defaultOpen={false}
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="installmentToggle"
                                    checked={installmentEnabled}
                                    onCheckedChange={(v) =>
                                        setInstallmentEnabled(!!v)
                                    }
                                />
                                <Label
                                    htmlFor="installmentToggle"
                                    className="cursor-pointer text-sm font-medium text-slate-700"
                                >
                                    Enable Installment Plan
                                </Label>
                            </div>

                            {installmentEnabled && (
                                <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
                                    <Field label="Number of Installments">
                                        <Input
                                            type="number"
                                            min={2}
                                            value={numInstallments}
                                            onChange={(e) =>
                                                setNumInstallments(
                                                    Number(e.target.value),
                                                )
                                            }
                                        />
                                    </Field>
                                    <Field label="Per-Installment Amount (৳)">
                                        <Input
                                            readOnly
                                            value={fmt(installmentAmt)}
                                            className="bg-slate-50 font-mono font-medium text-slate-700"
                                        />
                                    </Field>
                                    <Field label="First Payment Date">
                                        <Input
                                            type="date"
                                            value={firstPaymentDate}
                                            onChange={(e) =>
                                                setFirstPaymentDate(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    </Field>
                                </div>
                            )}
                        </div>
                    </SectionCard>

                    {/* ── 9. Summary ────────────────────────────────────────── */}
                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 px-6 py-4">
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                <FileText className="h-4 w-4" />
                            </span>
                            <span className="text-sm font-semibold text-slate-800">
                                Invoice Summary
                            </span>
                        </div>
                        <Separator />
                        <div className="px-6 py-5">
                            <div className="ml-auto max-w-sm space-y-2 text-sm">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span className="font-medium">
                                        ৳{fmt(subtotal)}
                                    </span>
                                </div>
                                {discountAmt > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>
                                            Discount
                                            {discountType === 'percentage' &&
                                                ` (${discountValue}%)`}
                                        </span>
                                        <span className="font-medium text-emerald-600">
                                            −৳{fmt(discountAmt)}
                                        </span>
                                    </div>
                                )}
                                {taxAmt > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Tax ({taxPct}%)</span>
                                        <span className="font-medium">
                                            ৳{fmt(taxAmt)}
                                        </span>
                                    </div>
                                )}
                                {vatAmt > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>VAT ({vatPct}%)</span>
                                        <span className="font-medium">
                                            ৳{fmt(vatAmt)}
                                        </span>
                                    </div>
                                )}
                                {extras > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Extra Charges</span>
                                        <span className="font-medium">
                                            ৳{fmt(extras)}
                                        </span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex justify-between text-base font-bold text-slate-900">
                                    <span>Grand Total</span>
                                    <span>৳{fmt(grandTotal)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Paid</span>
                                    <span className="font-semibold text-emerald-600">
                                        ৳{fmt(paidAmount)}
                                    </span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-rose-50 px-3 py-2 text-base font-bold text-rose-600">
                                    <span>Due</span>
                                    <span>৳{fmt(dueAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── 10. Receipt & Notification ───────────────────────── */}
                    <SectionCard
                        title="Receipt & Notification"
                        icon={<Receipt className="h-4 w-4" />}
                        collapsible
                        defaultOpen={false}
                    >
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {(
                                [
                                    {
                                        id: 'receipt',
                                        label: 'Generate Receipt',
                                        state: generateReceipt,
                                        set: setGenerateReceipt,
                                    },
                                    {
                                        id: 'email',
                                        label: 'Send Email',
                                        state: sendEmail,
                                        set: setSendEmail,
                                    },
                                    {
                                        id: 'sms',
                                        label: 'Send SMS',
                                        state: sendSms,
                                        set: setSendSms,
                                    },
                                    {
                                        id: 'reminder',
                                        label: 'Payment Reminder',
                                        state: sendReminder,
                                        set: setSendReminder,
                                    },
                                ] as const
                            ).map(({ id, label, state, set }) => (
                                <div
                                    key={id}
                                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
                                >
                                    <Checkbox
                                        id={id}
                                        checked={state}
                                        onCheckedChange={(v) => set(!!v)}
                                    />
                                    <Label
                                        htmlFor={id}
                                        className="cursor-pointer text-sm text-slate-700"
                                    >
                                        {label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </SectionCard>

                    {/* ── 11. Actions ───────────────────────────────────────── */}
                    <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            disabled={isSubmitting}
                            onClick={() => handleSubmit('draft')}
                        >
                            <Save className="h-4 w-4" />
                            {isSubmitting ? 'Saving…' : 'Save Draft'}
                        </Button>
                        <Button
                            type="button"
                            className="gap-2 bg-slate-900 hover:bg-slate-700"
                            disabled={isSubmitting}
                            onClick={() => handleSubmit('create')}
                        >
                            <FileText className="h-4 w-4" />
                            {isSubmitting ? 'Creating…' : 'Create Invoice'}
                        </Button>
                        <Button
                            type="button"
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                            disabled={isSubmitting}
                            onClick={() => handleSubmit('collect')}
                        >
                            <CreditCard className="h-4 w-4" />
                            {isSubmitting
                                ? 'Saving…'
                                : 'Save & Collect Payment'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            disabled
                        >
                            <Eye className="h-4 w-4" />
                            Preview
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="gap-2"
                            disabled
                        >
                            <Download className="h-4 w-4" />
                            Download PDF
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="ml-auto gap-2 text-slate-400 hover:text-rose-500"
                            onClick={() => window.history.back()}
                        >
                            <X className="h-4 w-4" />
                            Cancel
                        </Button>
                    </div>

                    {/* Hidden system fields */}
                    <input type="hidden" name="created_by" />
                    <input type="hidden" name="branch_id" />
                    <input type="hidden" name="currency" value="BDT" />
                    <input type="hidden" name="invoice_uuid" />
                </form>
            </div>
        </AppLayout>
    );
}
