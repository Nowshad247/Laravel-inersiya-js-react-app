import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { Copy, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface AddDeviceDialogProps {
    cdataUrl: string;
    getRequestUrl: string;
}

const statusOptions = ['active', 'inactive', 'error', 'offline', 'connecting'];

export function AddDeviceDialog({
    cdataUrl,
    getRequestUrl,
}: AddDeviceDialogProps) {
    const [open, setOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        device_name: '',
        device_type: '',
        device_ip: '',
        device_port: '',
        device_serial_number: '',
        device_location: '',
        sync_interval: '5',
        device_status: 'inactive',
        connection_type: '',
    });

    const copy = (value: string) => {
        navigator.clipboard.writeText(value);
        toast.success('Copied to clipboard.');
    };

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/devices-manager/store', {
            onSuccess: () => {
                setOpen(false);
                reset();
            },
        });
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Device
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[560px]">
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Add Attendance Device</DialogTitle>
                        <DialogDescription>
                            Register a ZKTeco ADMS-compatible device. You can
                            configure sync and connectivity later.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <Label>Device Name *</Label>
                            <Input
                                value={data.device_name}
                                onChange={(e) =>
                                    setData('device_name', e.target.value)
                                }
                                placeholder="e.g., Main Gate ZK"
                            />
                            {errors.device_name && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.device_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Device Type</Label>
                            <Input
                                value={data.device_type}
                                onChange={(e) =>
                                    setData('device_type', e.target.value)
                                }
                                placeholder="e.g., ZKTeco K40"
                            />
                        </div>

                        <div>
                            <Label>Device IP</Label>
                            <Input
                                value={data.device_ip}
                                onChange={(e) =>
                                    setData('device_ip', e.target.value)
                                }
                                placeholder="e.g., 192.168.1.50"
                            />
                        </div>

                        <div>
                            <Label>Device Port</Label>
                            <Input
                                type="number"
                                value={data.device_port}
                                onChange={(e) =>
                                    setData('device_port', e.target.value)
                                }
                                placeholder="e.g., 4370"
                            />
                        </div>

                        <div>
                            <Label>Device Serial Number</Label>
                            <Input
                                value={data.device_serial_number}
                                onChange={(e) =>
                                    setData(
                                        'device_serial_number',
                                        e.target.value,
                                    )
                                }
                                placeholder="e.g., ZK-0001"
                            />
                            {errors.device_serial_number && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.device_serial_number}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-muted-foreground">
                                Must match the "SN" the physical device sends so
                                ADMS requests can be linked to it.
                            </p>
                        </div>

                        <div>
                            <Label>Device Location</Label>
                            <Input
                                value={data.device_location}
                                onChange={(e) =>
                                    setData('device_location', e.target.value)
                                }
                                placeholder="e.g., Main Gate"
                            />
                        </div>

                        <div>
                            <Label>Sync Interval (minutes)</Label>
                            <Input
                                type="number"
                                min={1}
                                value={data.sync_interval}
                                onChange={(e) =>
                                    setData('sync_interval', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Device Status</Label>
                            <Select
                                value={data.device_status}
                                onValueChange={(value) =>
                                    setData('device_status', value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label>Connection Type</Label>
                            <Input
                                value={data.connection_type}
                                onChange={(e) =>
                                    setData('connection_type', e.target.value)
                                }
                                placeholder="e.g., TCP/IP, LAN, WiFi"
                            />
                        </div>
                    </div>

                    <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-700">
                            ADMS Server Endpoints
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Configure these URLs in the device's ADMS/server
                            settings so it can reach this application.
                        </p>

                        <div>
                            <Label className="text-xs">ADMS cdata URL</Label>
                            <div className="flex items-center gap-2">
                                <Input readOnly value={cdataUrl} />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    aria-label="Copy cdata URL"
                                    onClick={() => copy(cdataUrl)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        <div>
                            <Label className="text-xs">
                                ADMS getrequest URL
                            </Label>
                            <div className="flex items-center gap-2">
                                <Input readOnly value={getRequestUrl} />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="outline"
                                    aria-label="Copy getrequest URL"
                                    onClick={() => copy(getRequestUrl)}
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Add Device'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
