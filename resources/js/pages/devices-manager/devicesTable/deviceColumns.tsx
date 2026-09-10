import { type ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNow } from 'date-fns';
import { Pencil } from 'lucide-react';
import { toast } from 'sonner';

export interface DeviceRow {
    id: number;
    deviceName: string;
    deviceType: string;
    deviceIp: string;
    devicePort: number | string;
    serialNumber: string;
    location: string;
    syncInterval: number;
    status: string;
    connectionType: string;
    lastCommunicationAt: string | null;
    lastCommunicationIp: string | null;
}

const statusBadgeColor: Record<string, string> = {
    Active: 'bg-emerald-100 text-emerald-700',
    Error: 'bg-rose-100 text-rose-700',
    Inactive: 'bg-slate-100 text-slate-700',
    Offline: 'bg-slate-100 text-slate-700',
    Connecting: 'bg-amber-100 text-amber-700',
};

export const deviceColumns = [
    {
        accessorKey: 'deviceName',
        header: 'Device Name',
    },
    {
        accessorKey: 'deviceType',
        header: 'Device Type',
    },
    {
        accessorKey: 'deviceIp',
        header: 'Device IP',
    },
    {
        accessorKey: 'devicePort',
        header: 'Port',
    },
    {
        accessorKey: 'serialNumber',
        header: 'Serial Number',
    },
    {
        accessorKey: 'location',
        header: 'Location',
    },
    {
        accessorKey: 'syncInterval',
        header: 'Sync Interval',
        cell: ({ getValue }) => `${getValue<number>()} min`,
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ getValue }) => {
            const status = getValue<string>();
            const badgeColor =
                statusBadgeColor[status] ?? 'bg-slate-100 text-slate-700';
            return (
                <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${badgeColor}`}
                >
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: 'connectionType',
        header: 'Connection Type',
    },
    {
        accessorKey: 'lastCommunicationAt',
        header: 'Last ADMS Request',
        cell: ({ getValue }) => {
            const value = getValue<string | null>();
            if (!value) {
                return <span className="text-muted-foreground">Never</span>;
            }
            return (
                <span title={new Date(value).toLocaleString()}>
                    {formatDistanceToNow(new Date(value), {
                        addSuffix: true,
                    })}
                </span>
            );
        },
    },
    {
        accessorKey: 'actions',
        header: 'Actions',
        cell: () => (
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                    aria-label="Edit device"
                    onClick={() =>
                        toast.info('Device management is coming soon.')
                    }
                >
                    <Pencil className="h-4 w-4" />
                </button>
            </div>
        ),
    },
] as ColumnDef<DeviceRow>[];
