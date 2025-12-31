import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Student } from '@/types/Students';
import { Head, router } from '@inertiajs/react';
import { columns } from './DataTable/collums';
import { Button } from '@/components/ui/button';

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
            <Button onClick={()=>router.get('/students/create')} className='w-3/12 my-6 mx-6'>Add New Student</Button>
            <DataTable columns={columns} data={students} searchKey="name">
            </DataTable>
        </AppLayout>
    );
}
