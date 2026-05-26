import BillingTabs from '@/components/BillingTabs';
import DashboardCard from '@/components/DashboardCard';
import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Clock3,
    Download,
    ShieldAlert,
    TrendingUp,
} from 'lucide-react';
import { dueColumns, DueRow } from './billingTable/dueColumns';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Billing Dashboard', href: '/billings' },
    { title: 'Collections', href: '/billings/collections' },
];

interface CollectionStats {
    totalOverdue: number;
    pendingCollections: number;
    recoveryRate: number;
    criticalAccounts: number;
}

const fmt = (n: number) =>
    '৳' +
    n.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export default function Collections() {
    const { stats, activeDues } = usePage<{
        stats: CollectionStats;
        activeDues: DueRow[];
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />
            <div className="space-y-9">
                <BillingTabs title="Collections" />

                {/* Summary stats */}
                <section className="m-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <DashboardCard
                        title="Total Overdue"
                        value={fmt(stats.totalOverdue)}
                        icon={<AlertCircle className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Pending Collections"
                        value={fmt(stats.pendingCollections)}
                        icon={<Clock3 className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Recovery Rate"
                        value={`${stats.recoveryRate}%`}
                        icon={<TrendingUp className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Critical Accounts"
                        value={stats.criticalAccounts.toString()}
                        icon={<ShieldAlert className="h-5 w-5" />}
                    />
                </section>

                {/* Due & Collection Management */}
                <section className="m-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60">
                    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">
                                Management
                            </p>
                            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                                Due &amp; Collection Management
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                All active invoices with outstanding balances
                            </p>
                        </div>
                        <a
                            href="/billings/collections/export"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                        >
                            <Download className="h-4 w-4" />
                            Download Due Report
                        </a>
                    </div>

                    <DataTable<DueRow>
                        columns={dueColumns}
                        data={activeDues}
                        searchKey="student"
                    />
                </section>
            </div>
        </AppLayout>
    );
}
