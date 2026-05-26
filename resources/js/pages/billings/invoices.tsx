import BillingTabs from '@/components/BillingTabs';
import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { invoiceColumns, InvoiceRow } from './billingTable/invoiceColumns';

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

export default function Invoices() {
    const { invoices } = usePage<{ invoices: InvoiceRow[] }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Invoices" />
            <div className="space-y-9">
                <BillingTabs title="Invoices" />
                <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60">
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
