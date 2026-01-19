import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem,  } from '@/types';
import { Head} from '@inertiajs/react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Role',
        href: dashboard().url,
    },
];
export default function edit() {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Role" />
        </AppLayout>
    );
}
