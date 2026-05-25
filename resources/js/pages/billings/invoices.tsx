import BillingTabs from '@/components/BillingTabs';
import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit3, Eye } from 'lucide-react';

interface InvoiceRow {
    id: number;
    invoiceId: string;
    student: string;
    course: string;
    dateIssued: string;
    dueDate: string;
    amount: string;
    status: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Dashboard',
        href: '/billings',
    },
    {
        title: 'Invoices',
        href: '/billings/invoices',
    },
];

const invoiceColumns = [
    {
        accessorKey: 'invoiceId',
        header: 'Invoice ID',
    },
    {
        accessorKey: 'student',
        header: 'Student',
    },
    {
        accessorKey: 'course',
        header: 'Course',
    },
    {
        accessorKey: 'dateIssued',
        header: 'Date Issued',
    },
    {
        accessorKey: 'dueDate',
        header: 'Due Date',
    },
    {
        accessorKey: 'amount',
        header: 'Amount',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
            const status = getValue<string>();
            const badgeColor =
                status === 'Paid'
                    ? 'bg-emerald-100 text-emerald-700'
                    : status === 'Overdue'
                      ? 'bg-rose-100 text-rose-700'
                      : status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700';
            return (
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}
                >
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: () => (
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="View invoice"
                >
                    <Eye className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Edit invoice"
                >
                    <Edit3 className="h-4 w-4" />
                </button>
            </div>
        ),
    },
] as ColumnDef<InvoiceRow>[];

export default function Invoices() {
    const { invoices } = usePage<{ invoices: InvoiceRow[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />
            <div className="space-y-9">
                <BillingTabs title="Invoices" />
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60">
                    <DataTable<InvoiceRow>
                        btnlink="/billings/invoices/create"
                        columns={invoiceColumns}
                        data={invoices}
                        searchKey="student"
                    />
                </section>
            </div>
        </AppLayout>
    );
}
