import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarCheck } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees Attendance',
        href: '/employees-attendance',
    },
];

export default function Index() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees Attendance" />
            <div className="m-2">
                <Card>
                    <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                        <CalendarCheck className="h-10 w-10 text-muted-foreground" />
                        <h1 className="text-2xl font-semibold">
                            Sometimes Great is Coming Soon.
                        </h1>
                        <p className="text-muted-foreground">
                            Feature is Updating.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
