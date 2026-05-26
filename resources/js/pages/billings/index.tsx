import BillingTabs from '@/components/BillingTabs';
import DashboardCard from '@/components/DashboardCard';
import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowUpRight, Clock3, DollarSign, TrendingUp } from 'lucide-react';
import { invoiceColumns, InvoiceRow } from './billingTable/invoiceColumns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Billing Dashboard',
        href: '/billings',
    },
];

interface BillingStats {
    totalRevenue: number;
    pendingDues: number;
    presentMonthEarnings: number;
    lastMonthEarnings: number;
}

const fmt = (n: number) =>
    '৳' +
    n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export default function Index() {
    const { invoices, stats } = usePage<{
        invoices: InvoiceRow[];
        stats: BillingStats;
    }>().props;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Billing Dashboard" />
            <div className="space-y-9">
                <BillingTabs title="Billing Dashboard" />

                <section className="m-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardCard
                        title="Total Revenue"
                        value={fmt(stats.totalRevenue)}
                        icon={<DollarSign className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Pending Dues"
                        value={fmt(stats.pendingDues)}
                        icon={<Clock3 className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Present Month Total Earnings"
                        value={fmt(stats.presentMonthEarnings)}
                        icon={<TrendingUp className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Last Month Total Earnings"
                        value={fmt(stats.lastMonthEarnings)}
                        icon={<ArrowUpRight className="h-5 w-5" />}
                    />
                </section>
                <section className="m-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60">
                    <DataTable<InvoiceRow>
                        btnlink="/billings/create-invoice"
                        columns={invoiceColumns}
                        data={invoices}
                        searchKey="student"
                    />
                </section>
            </div>
        </AppLayout>
    );
}
