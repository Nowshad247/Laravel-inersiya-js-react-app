import DashboardCard from '@/components/DashboardCard';
import { DataTable } from '@/components/DataTable/DataTable';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { AlertTriangle, CheckCircle2, Server } from 'lucide-react';
import { AddDeviceDialog } from './AddDeviceDialog';
import { AdmsConnectionInfo } from './AdmsConnectionInfo';
import { deviceColumns, DeviceRow } from './devicesTable/deviceColumns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Employees Attendance',
        href: '/employees-attendance',
    },
    {
        title: 'Devices Manager',
        href: '/Devices-Manager',
    },
];

interface DeviceStats {
    totalDevices: number;
    activeDevices: number;
    errorDevices: number;
}

interface AdmsConfig {
    cdataUrl: string;
    getRequestUrl: string;
}

export default function Index() {
    const { devices, stats, adms } = usePage<{
        devices: DeviceRow[];
        stats: DeviceStats;
        adms: AdmsConfig;
    }>().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Devices Manager" />
            <div className="space-y-9">
                <section className="m-2 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <DashboardCard
                        title="Total Devices"
                        value={stats.totalDevices}
                        icon={<Server className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Active Devices"
                        value={stats.activeDevices}
                        icon={<CheckCircle2 className="h-5 w-5" />}
                    />
                    <DashboardCard
                        title="Error Devices"
                        value={stats.errorDevices}
                        icon={<AlertTriangle className="h-5 w-5" />}
                    />
                </section>

                <section className="m-2">
                    <AdmsConnectionInfo
                        cdataUrl={adms.cdataUrl}
                        getRequestUrl={adms.getRequestUrl}
                    />
                </section>

                <section className="m-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-100/60">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Registered Devices
                        </h2>
                        <AddDeviceDialog
                            cdataUrl={adms.cdataUrl}
                            getRequestUrl={adms.getRequestUrl}
                        />
                    </div>
                    <DataTable<DeviceRow>
                        columns={deviceColumns}
                        data={devices}
                        searchKey="deviceName"
                        tableKey="devices-manager"
                    />
                </section>
            </div>
        </AppLayout>
    );
}
