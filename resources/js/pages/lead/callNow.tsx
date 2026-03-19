import { Head } from '@inertiajs/react';
import AppLayout from "@/layouts/app-layout";
import { Lead } from "@/lib/data";
import { dashboard } from '@/routes';
import { BreadcrumbItem } from "@/types";
import CallNows from '@/components/callNows';
import Notes from '@/components/Notes';
import CallsList from '@/components/CallsList';
import RemindersList from '@/components/RemindersList';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Call Now Log',
        href: dashboard().url,
    },
];

export default function CallNow({ lead }: { lead: Lead }) {
    console.log(lead);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Call Now Log" />
            <div className='flex w-full tems-start justify-start gap-4 p-4 border rounded-lg bg-white shadow-sm'>
                <div className='w-full'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1>Lead Information</h1>  
                        <button className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                            Update Lead Information
                        </button>
                    </div>
                    <CallNows data={lead} />
                </div>
                <div className='w-full'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1>Notes</h1>  
                        <button className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                            Add Note
                        </button>
                    </div>
                     <Notes notes={lead.notes} />
                </div>
                <div className='w-full'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1>Call List</h1>  
                        <button className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                            Add Call
                        </button>
                    </div>
                     <CallsList calls={lead.calls} />
                </div>
                <div className='w-full'>
                    <div className='flex items-center justify-between mb-4'>
                        <h1>Reminders</h1>  
                        <button className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition'>
                            Add Reminder
                        </button>
                    </div>
                    <RemindersList reminders={lead.reminders} />
                </div>
            </div>
        </AppLayout>
    );
}