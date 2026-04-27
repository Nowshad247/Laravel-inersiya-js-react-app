import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Batch } from '@/types/Batch';
import { Head } from '@inertiajs/react';
import { columns } from './DataTabe/collum';

export default function Index({ batches }: { batches: Batch[] }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Batches',
            href: dashboard().url,
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Dashboard" />
            <div className="p-6">
                <DataTable
                    btnlink="/batch/create"
                    columns={columns}
                    data={batches}
                    searchKey="name"
                />
            </div>
        </AppLayout>
    );
}
