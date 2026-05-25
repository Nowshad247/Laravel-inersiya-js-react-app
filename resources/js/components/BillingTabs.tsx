import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useMemo } from 'react';

interface BillingTabsProps {
    title?: string;
    description?: string;
}

const tabs = [
    { value: 'dashboard', title: 'Dashboard', href: '/billings' },
    { value: 'invoices', title: 'Invoices', href: '/billings/invoices' },
    {
        value: 'student-billing',
        title: 'Student Billing',
        href: '/billings/create-invoice',
    },
    {
        value: 'collections',
        title: 'Collections',
        href: '/billings/collections',
    },
    { value: 'payments', title: 'Payments', href: '/billings/payments' },
    {
        value: 'course-fees',
        title: 'Course Fees',
        href: '/billings/course-fees',
    },
    { value: 'reports', title: 'Reports', href: '/billings/reports' },
    {
        value: 'administration',
        title: 'Administration',
        href: '/billings/administration',
    },
    { value: 'settings', title: 'Settings', href: '/billings/settings' },
];

export default function BillingTabs({
    title = 'Billing Dashboard',
}: BillingTabsProps) {
    const page = usePage();
    const currentPath = page.url as string;
    const activeTab = useMemo(() => {
        const pathname = currentPath.split('?')[0];
        const matched = tabs
            .filter(
                (tab) =>
                    pathname === tab.href ||
                    pathname.startsWith(tab.href + '/'),
            )
            .sort((a, b) => b.href.length - a.href.length)[0];
        return matched?.value ?? 'dashboard';
    }, [currentPath]);
    return (
        <section className="m-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase">
                        Billing navigation
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                        {title}
                    </h1>
                </div>
                <div className="max-w-xl text-sm leading-6 text-slate-500">
                    <button className="rounded-md bg-black px-4 py-2 text-white hover:bg-blue-600">
                        Add New Invoice
                    </button>
                </div>
            </div>

            <div>
                <Tabs className="w-full" value={activeTab}>
                    <TabsList>
                        {tabs.map((tab) => (
                            <TabsTrigger key={tab.value} value={tab.value}>
                                <Link
                                    href={tab.href}
                                    className="flex w-full items-center justify-between gap-2"
                                >
                                    <span className="break-words">
                                        {tab.title}{' '}
                                    </span>
                                    <ChevronRight className="hidden h-4 w-4 text-slate-400 transition group-hover:text-slate-600 sm:inline" />
                                </Link>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
        </section>
    );
}
