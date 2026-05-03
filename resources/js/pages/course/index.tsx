import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Course } from '@/types/Course';
import { Head } from '@inertiajs/react';
import { columns } from './DataTable/columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Course',
        href: dashboard().url,
    },
];
export default function Index({ courses }: { courses: Course[] }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Course Dashboard" />
            <div className="m-6">
                <DataTable
                    btnlink="/courses/create"
                    columns={columns}
                    data={courses}
                    searchKey="lead.name"
                />
            </div>
        </AppLayout>
    );
}
