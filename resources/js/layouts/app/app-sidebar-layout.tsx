import { Alerts } from '@/components/alert';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { use, type PropsWithChildren } from 'react';
import { Toaster } from "@/components/ui/sonner"

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const {flash} = usePage().props as { flash?: { success?: string; error?: string } };
    return (
        <AppShell variant="sidebar">
            {flash?.error || flash?.success ? <Alerts {...flash} /> : null}
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
