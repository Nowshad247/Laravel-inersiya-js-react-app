import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head,  } from '@inertiajs/react';
import { Label } from '@radix-ui/react-dropdown-menu';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Student',
        href: dashboard().url,
    },
];
export default function Index() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />
        </AppLayout>
    );
}
