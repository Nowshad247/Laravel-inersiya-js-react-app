import RenderAny from '@/components/RenderAny';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students Profile',
        href: dashboard().url,
    },
];
interface PageProps {
    [key: string]: unknown;
}
export default function Index(studentData: PageProps) {
    const { id }: any = studentData.studentData;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Profile" />
            <div className="rounded bg-white p-6 shadow">
                <Button
                    className="m-4"
                    variant="outline"
                    onClick={() => router.get(`/student/edit/${id}`)}
                >
                    Edit Profile
                </Button>
                <RenderAny data={studentData as unknown as any} />
            </div>
        </AppLayout>
    );
}
