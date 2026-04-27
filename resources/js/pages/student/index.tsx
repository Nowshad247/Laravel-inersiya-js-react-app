import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Student } from '@/types/Students';
import { Head } from '@inertiajs/react';
import { columns } from './DataTable/collums';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students',
        href: dashboard().url,
    },
];
export default function Index({ students }: { students: Student[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
            <div className="m-6">
                <DataTable
                    btnlink="/students/create"
                    columns={columns}
                    data={students}
                    searchKey="name"
                ></DataTable>
            </div>
        </AppLayout>
    );
}
