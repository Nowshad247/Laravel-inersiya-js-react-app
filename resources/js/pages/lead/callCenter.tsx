
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

import { Lead, LeadSource, LeadStatus } from '@/lib/data';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lead Dashboard',
        href: dashboard().url,
    },
];



export default function Callcenter() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Dashboard" />
            <div className='w-[100%] flex items-center justify-between'> 
                <h1>
                    Call Lead Page
                </h1>
            </div>
        </AppLayout>
    );
}
