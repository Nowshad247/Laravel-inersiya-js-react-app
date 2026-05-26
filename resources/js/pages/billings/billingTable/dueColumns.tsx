import { router } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { Eye, User } from 'lucide-react';

export interface DueRow {
    id: number;
    invoiceId: string;
    student: string;
    studentId: number;
    course: string;
    dueDate: string;
    totalAmount: number;
    paidAmount: number;
    dueAmount: number;
    daysOverdue: number;
    status: string;
}

const fmt = (n: number) =>
    '৳' +
    n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export const dueColumns: ColumnDef<DueRow>[] = [
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
        accessorKey: 'dueDate',
        header: 'Due Date',
    },
    {
        accessorKey: 'totalAmount',
        header: 'Total Amount',
        cell: ({ getValue }) => fmt(getValue<number>()),
    },
    {
        accessorKey: 'paidAmount',
        header: 'Paid Amount',
        cell: ({ getValue }) => fmt(getValue<number>()),
    },
    {
        accessorKey: 'dueAmount',
        header: 'Due Amount',
        cell: ({ getValue }) => (
            <span className="font-semibold text-rose-600">
                {fmt(getValue<number>())}
            </span>
        ),
    },
    {
        accessorKey: 'daysOverdue',
        header: 'Days Overdue',
        cell: ({ getValue }) => {
            const days = getValue<number>();
            if (days === 0) {
                return (
                    <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        On Time
                    </span>
                );
            }
            const color =
                days > 30
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-amber-100 text-amber-700';
            return (
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${color}`}
                >
                    {days}d overdue
                </span>
            );
        },
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
            const status = getValue<string>();
            const color =
                status === 'Sent'
                    ? 'bg-blue-100 text-blue-700'
                    : status === 'Partial'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-slate-100 text-slate-700';
            return (
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${color}`}
                >
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="View invoice"
                    onClick={() =>
                        router.get(
                            `/billings/invoice/${row.original.id}/preview`,
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
                        router.get(
                            `/billings/student/${row.original.studentId}`,
                        )
                    }
                >
                    <User className="h-4 w-4" />
                </button>
            </div>
        ),
    },
];
