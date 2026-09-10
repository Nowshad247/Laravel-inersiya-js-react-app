import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AdmsConnectionInfoProps {
    cdataUrl: string;
    getRequestUrl: string;
}

function CopyableUrl({ label, url }: { label: string; url: string }) {
    const copy = () => {
        navigator.clipboard.writeText(url);
        toast.success('Copied to clipboard.');
    };

    return (
        <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <button
                type="button"
                onClick={copy}
                className="group mt-1 flex w-full items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-left font-mono text-sm text-slate-700 transition hover:border-slate-300"
                title="Click to copy"
            >
                <span className="truncate">{url}</span>
                <Copy className="h-4 w-4 shrink-0 text-slate-400 group-hover:text-slate-700" />
            </button>
        </div>
    );
}

export function AdmsConnectionInfo({
    cdataUrl,
    getRequestUrl,
}: AdmsConnectionInfoProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>ADMS Connection Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <CopyableUrl label="ADMS cdata URL" url={cdataUrl} />
                    <CopyableUrl
                        label="ADMS getrequest URL"
                        url={getRequestUrl}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
                    <div>
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            HTTP Methods
                        </p>
                        <p className="mt-1 text-sm font-medium">GET / POST</p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            Authentication
                        </p>
                        <p className="mt-1 text-sm font-medium">None</p>
                    </div>
                    <div className="col-span-2 sm:col-span-2">
                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            CSRF
                        </p>
                        <p className="mt-1 text-sm font-medium">
                            Disabled for /iclock/*
                        </p>
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">
                    Configure the device's serial number to match a registered
                    device below so incoming requests are linked automatically.
                    Live traffic is written to{' '}
                    <code className="rounded bg-slate-100 px-1 py-0.5">
                        storage/logs/adms.log
                    </code>
                    .
                </p>
            </CardContent>
        </Card>
    );
}
