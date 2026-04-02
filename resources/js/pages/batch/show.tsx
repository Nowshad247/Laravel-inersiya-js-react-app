import { BatchTable } from '@/components/batch-table';
import { BatchDetailCard } from '@/components/BatchDetailCard';
import { DataTable } from '@/components/DataTable/DataTable';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Batch } from '@/types/Batch';
import { Student } from '@/types/Students';
import { Head, router } from '@inertiajs/react';
import { studentCollum } from './DataTabe/studentCollum';

interface BatchData {
    batch: Batch & { students: Student[] };
    batchDetail: Batch['detail'] | null;
}

export default function Index({ batch, batchDetail }: BatchData) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Batches',
            href: dashboard().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Batch Dashboard" />
            <div className="px-6">
                <Button
                    className="btn btn"
                    onClick={() => {
                        router.get('/batch/create');
                    }}
                >
                    Add New Batch
                </Button>
            </div>
            <BatchTable batch={batch}></BatchTable>
            <BatchDetailCard batchDetail={batchDetail}></BatchDetailCard>
            <div className="m-6">
                <DataTable
                    columns={studentCollum}
                    data={batch.students}
                ></DataTable>
            </div>
        </AppLayout>
    );
}
