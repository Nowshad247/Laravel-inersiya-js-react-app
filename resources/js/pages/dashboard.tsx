import BatchCard from '@/components/BatchCard';
import DashboardCard from '@/components/DashboardCard';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Batch } from '@/types/Batch';
import { Head } from '@inertiajs/react';
import { Blend, GraduationCap, LibraryBig } from 'lucide-react';
import { useMemo, useState } from 'react';

interface DashboardProps {
    totalStudent: number;
    totalBatchs: number;
    totalCourses: number;
    totalLeads: number;
    activeCalls: number;
    conversionRate: string;
    followUpsToday: number;
    batches: Array<Batch>;
    courses: Array<{ id: number; name: string }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];
export default function Dashboard({
    totalStudent,
    totalBatchs,
    totalCourses,
    totalLeads,
    activeCalls,
    conversionRate,
    followUpsToday,
    batches,
    courses,
}: DashboardProps) {
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedMonth, setSelectedMonth] = useState<string>('all');
    const [selectedCourse, setSelectedCourse] = useState<string>('all');

    // Get unique statuses
    const statuses = useMemo(() => {
        const uniqueStatuses = Array.from(
            new Set(batches.map((batch) => batch.batch_status)),
        );
        return uniqueStatuses;
    }, [batches]);

    // Generate month options (next 12 months)
    const monthOptions = useMemo(() => {
        const options = [{ value: 'all', label: 'All Months' }];
        const now = new Date();
        for (let i = 0; i < 12; i++) {
            const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
            const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            const label = date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
            });
            options.push({ value, label });
        }
        return options;
    }, []);

    // Filter batches
    const filteredBatches = useMemo(() => {
        return batches.filter((batch) => {
            // Status filter
            if (
                selectedStatus !== 'all' &&
                batch.batch_status !== selectedStatus
            ) {
                return false;
            }

            // Month filter
            if (selectedMonth !== 'all' && batch.start_date) {
                const batchMonth = new Date(batch.start_date)
                    .toISOString()
                    .slice(0, 7); // YYYY-MM
                if (batchMonth !== selectedMonth) {
                    return false;
                }
            }

            // Course filter
            if (selectedCourse !== 'all') {
                const selectedCourseId = Number(selectedCourse);
                if (
                    !Number.isFinite(selectedCourseId) ||
                    batch.course_id !== selectedCourseId
                ) {
                    return false;
                }
            }

            return true;
        });
    }, [batches, selectedStatus, selectedMonth, selectedCourse]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex">
                <DashboardCard
                    title="Total Students"
                    value={totalStudent}
                    icon={<GraduationCap className="h-4 w-4" />}
                ></DashboardCard>
                <DashboardCard
                    title="Total Courses"
                    value={totalCourses}
                    icon={<Blend className="h-4 w-4" />}
                ></DashboardCard>
                <DashboardCard
                    title="Total Batchs"
                    value={totalBatchs}
                    icon={<LibraryBig className="h-4 w-4" />}
                ></DashboardCard>
            </div>
            <div className="my-2">
                <h2 className="text-lg font-medium">Leads</h2>
                <div className="flex">
                    <DashboardCard
                        title="Total Leads"
                        value={totalLeads}
                        icon={<GraduationCap className="h-4 w-4" />}
                    ></DashboardCard>
                    <DashboardCard
                        title="Active Calls"
                        value={activeCalls}
                        icon={<GraduationCap className="h-4 w-4" />}
                    ></DashboardCard>
                    <DashboardCard
                        title="Conversion Rate"
                        value={conversionRate}
                        icon={<GraduationCap className="h-4 w-4" />}
                    ></DashboardCard>
                    <DashboardCard
                        title="Follow-ups Today"
                        value={followUpsToday}
                        icon={<GraduationCap className="h-4 w-4" />}
                    ></DashboardCard>
                </div>
            </div>
            <div className="m-2">
                <h2 className="mb-4 text-lg font-medium">Upcoming Batches</h2>
                <div className="mb-4 flex flex-wrap gap-4">
                    <div className="w-48">
                        <Select
                            value={selectedStatus}
                            onValueChange={setSelectedStatus}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Statuses
                                </SelectItem>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-48">
                        <Select
                            value={selectedMonth}
                            onValueChange={setSelectedMonth}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Month" />
                            </SelectTrigger>
                            <SelectContent>
                                {monthOptions.map((option) => (
                                    <SelectItem
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-48">
                        <Select
                            value={selectedCourse}
                            onValueChange={setSelectedCourse}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Filter by Course" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Courses</SelectItem>
                                {courses.map((course) => (
                                    <SelectItem
                                        key={course.id}
                                        value={course.id.toString()}
                                    >
                                        {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredBatches && filteredBatches.length > 0 ? (
                        filteredBatches.map((batch) => (
                            <BatchCard key={batch.id} batch={batch} />
                        ))
                    ) : (
                        <div className="col-span-full flex w-full items-center justify-center text-muted-foreground">
                            No batches found.
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
