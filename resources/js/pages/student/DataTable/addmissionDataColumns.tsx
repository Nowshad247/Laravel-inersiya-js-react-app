import { Button } from '@/components/ui/button';
import { Admission } from '@/types';
import { router } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Eye, Trash2 } from 'lucide-react';

export const admissionColumns: ColumnDef<Admission>[] = [
    {
        accessorKey: 'id',
        header: 'ID',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    {
        accessorKey: 'phone',
        header: 'Phone',
    },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string;
            return (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: 'approved_status',
        header: 'Approved Status',
        cell: ({ row }) => {
            const approvedStatus = row.getValue('approved_status') as string;
            return (
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                        approvedStatus === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                >
                    {approvedStatus}
                </span>
            );
        },
    },
    {
        id: 'actions',
        header: 'Action',
        cell: ({ row }) => (
            <Button
                size="icon"
                variant="outline"
                onClick={() =>
                    window.location.assign(`/admission/${row.original.id}`)
                }
            >
                <Eye className="h-4 w-4" />
            </Button>
        ),
    },
    {
        id: 'delete',
        header: 'Delete',
        cell: ({ row }) => (
            <Button
                size="icon"
                variant="destructive"
                onClick={() => {
                    if (
                        confirm('Are you sure you want to delete this course?')
                    ) {
                        router.delete(`/admission/${row.original.id}/delete`);
                    }
                }}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        ),
    },
];
