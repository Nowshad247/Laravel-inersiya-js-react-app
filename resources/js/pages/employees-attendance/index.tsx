import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import {
    CalendarCheck,
    CalendarDays,
    ClipboardList,
    Settings,
    SmartphoneNfc,
    Users,
    type LucideIcon,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees Attendance',
        href: '/employees-attendance',
    },
];

interface AttendanceMenuItem {
    title: string;
    icon: LucideIcon;
    href?: string;
}

const attendanceMenuItems: AttendanceMenuItem[] = [
    { title: 'Employees Manage', icon: Users },
    { title: 'Devices Manager', icon: SmartphoneNfc, href: '/Devices-Manager' },
    { title: 'Attendances', icon: CalendarCheck },
    { title: 'Leave Requests', icon: ClipboardList },
    { title: 'Holiday Calendar', icon: CalendarDays },
    { title: 'Attendance Settings', icon: Settings },
];

export default function Index() {
    const handleSelect = (item: AttendanceMenuItem) => {
        if (item.href) {
            router.get(item.href);
            return;
        }
        alert(`${item.title} is working!`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Employees Attendance" />
            <div className="m-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {attendanceMenuItems.map((item) => (
                    <Card
                        key={item.title}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleSelect(item)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                handleSelect(item);
                            }
                        }}
                        className="group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg active:translate-y-0 active:scale-[0.98]"
                    >
                        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-foreground transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                                <item.icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                            </div>
                            <h3 className="text-base font-semibold transition-colors duration-300 group-hover:text-primary">
                                {item.title}
                            </h3>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppLayout>
    );
}
