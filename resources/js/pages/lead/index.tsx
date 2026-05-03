import { LeadsTable } from '@/components/leads-table';
import AppLayout from '@/layouts/app-layout';
import { Lead, LeadSource, LeadStatus } from '@/lib/data';
import { dashboard } from '@/routes';
import { User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Lead Dashboard',
        href: dashboard().url,
    },
];

export default function Index({
    leads,
    users,
    lead_statuses,
    leadSources,
    leadStatus,
}: {
    leads: Lead[];
    users: User[];
    lead_statuses: LeadStatus[];
    leadSources: LeadSource[];
    leadStatus: LeadStatus[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Lead Dashboard" />
            <div className="m-2">
                <LeadsTable
                    leadsdata={leads}
                    users={users}
                    lead_statuses={lead_statuses}
                    leadSources={leadSources}
                    leadStatus={leadStatus[0]}
                ></LeadsTable>
            </div>
        </AppLayout>
    );
}
