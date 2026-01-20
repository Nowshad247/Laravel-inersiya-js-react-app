
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lead Dashboard',
        href: dashboard().url,
    },
];
export default function Index({ data }: { data: any }) {

    const { flash } = usePage().props;

    console.log(flash);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Dashboard" />
            <div>
                <Button onClick={() => router.get('/leads/upload')} className='w-3/12 my-6 mx-6'>Bulk Upload</Button>
            </div>
            <div className='m-6'>
                <h1 className='text-2xl font-bold'>Lead Dashboard</h1>
                <p className='mt-4'>Lead part will update soon</p>
            </div>
        </AppLayout>
    );
}
