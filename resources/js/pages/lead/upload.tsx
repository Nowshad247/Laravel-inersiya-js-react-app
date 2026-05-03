import BulkComponent from '@/components/bulkComponent';
import AddLead from '@/components/leadAdd';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { LeadSource, LeadStatus, User } from '@/types/Lead';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Dashboard',
        href: dashboard().url,
    },
];
export default function upload({
    leadSources,
    leadStatuses,
    assignedTos,
    townNames,
    lead_interests,
}: {
    leadSources: LeadSource[];
    leadStatuses: LeadStatus[];
    assignedTos: User[];
    townNames: Array<string>;
    lead_interests: Array<string>;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Lead" />
            <div className="m-2 rounded-lg bg-white p-2 shadow">
                <div className="mt-2 flex w-full gap-2">
                    <div className="w-1/2 rounded-lg border p-4">
                        <h1 className="text-xl font-bold">Add New Lead</h1>
                        <AddLead
                            leadSources={leadSources}
                            leadStatuses={leadStatuses}
                            assignedTos={assignedTos}
                            townNames={townNames}
                            interests={lead_interests}
                        />
                    </div>
                    <div className="w-1/2 rounded-lg border p-4">
                        <h2 className="mb-4 text-lg font-medium">
                            Upload a CSV file to import leads in bulk.
                        </h2>
                        <BulkComponent />
                        <p>
                            Download the{' '}
                            <a
                                href="/download-template"
                                className="text-blue-500 hover:underline"
                            >
                                CSV template
                            </a>{' '}
                            to ensure your data is formatted correctly.
                        </p>
                        <div className="mt-4 rounded-lg p-4"></div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
