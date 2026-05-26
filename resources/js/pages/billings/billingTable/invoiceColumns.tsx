import { router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Edit3, Eye, User } from 'lucide-react';
export interface InvoiceRow {
    id: number;
    invoiceId: string;
    student: string;
    studentId: number;
    course: string;
    dateIssued: string;
    dueDate: string;
    amount: string;
    status: string;
}

export const invoiceColumns = [
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
        cell: ({ row }) => {
            const invoice = row.original;

            return (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                        aria-label="View invoice"
                        onClick={() =>
                            router.get(
                                `/billings/invoice/${invoice.id}/preview`,
                            )
                        }
                    >
                        <Eye className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                        aria-label="Student billing"
                        onClick={() =>
                            router.get(`/billings/student/${invoice.studentId}`)
                        }
                    >
                        <User className="h-4 w-4" />
                    </button>
                    <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                        aria-label="Edit invoice"
                    >
                        <Edit3 className="h-4 w-4" />
                    </button>
                </div>
            );
        },
    },
] as ColumnDef<InvoiceRow>[];
