import BillingTabs from '@/components/BillingTabs';
import DashboardCard from '@/components/DashboardCard';
import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpRight, Clock3, DollarSign, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Dashboard',
        href: '/billings',
    },
];

interface Transaction {
    id: number;
    transactionId: string;
    student: string;
    invoice: string;
    amount: string;
    status: string;
    date: string;
}

export default function Index() {
    const columns = useMemo<ColumnDef<Transaction>[]>(
        () => [
            {
                accessorKey: 'transactionId',
                header: 'Transaction ID',
            },
            {
                accessorKey: 'student',
                header: 'Student / Customer',
            },
            {
                accessorKey: 'invoice',
                header: 'Invoice',
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
                    const statusColor =
                        status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-700'
                            : status === 'Pending'
                              ? 'bg-amber-100 text-amber-700'
                              : status === 'Failed'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-700';
                    return (
                        <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}
                        >
                            {status || 'N/A'}
                        </span>
                    );
                },
            },
            {
                accessorKey: 'date',
                header: 'Date',
            },
        ],
        [],
    );

    const transactions: Transaction[] = [];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Dashboard" />
            <div className="space-y-9">
                <BillingTabs title="Billing Dashboard" />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardCard
                        title="Total Revenue"
                        value="0"
                        icon={<DollarSign className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Pending Dues"
                        value="0"
                        icon={<Clock3 className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Present Month Total Earnings"
                        value="0"
                        icon={<TrendingUp className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Last Month Total Earnings"
                        value="0"
                        icon={<ArrowUpRight className="h-5 w-5" />}
                    />
                </section>

                <section className="rounded-2xl border bg-white p-4 shadow-sm">
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Recent Transactions
                            </h2>
                            <p className="text-sm text-slate-500">
                                Latest billing and payment activity will appear
                                here.
                            </p>
                        </div>
                        <div className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">
                            {transactions.length} Records
                        </div>
                    </div>

                    <DataTable<Transaction>
                        columns={columns}
                        data={transactions}
                        searchKey="student"
                    />
                </section>
            </div>
        </AppLayout>
    );
}
