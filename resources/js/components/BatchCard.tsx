import { Batch } from '@/types/Batch';
import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Calendar, Clock, Code, Users } from 'lucide-react';

interface BatchCardProps {
    batch: Batch;
}

export default function BatchCard({ batch }: BatchCardProps) {
    const { settings } = usePage().props as any;

    const formatDate = (dateString: string | null) => {
        if (!dateString) {
            return 'N/A';
        }
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }

        // Use the date_format from settings
        // Assuming date_format is like 'Y-m-d', 'd-m-Y', etc.
        const format = settings?.date_format || 'Y-m-d';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        switch (format) {
            case 'Y-m-d':
                return `${year}-${month}-${day}`;
            case 'd-m-Y':
                return `${day}-${month}-${year}`;
            case 'm-d-Y':
                return `${month}-${day}-${year}`;
            case 'd/m/Y':
                return `${day}/${month}/${year}`;
            case 'Y/m/d':
                return `${year}/${month}/${day}`;
            case 'm/d/Y':
                return `${month}/${day}/${year}`;
            default:
                return date.toLocaleDateString();
        }
    };

    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        {batch.name}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            <span>Code: {batch.batch_code}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4" />
                            <span>Course: {batch.course?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>Status: {batch.batch_status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                                Classes:{' '}
                                {batch.TotalClass ||
                                    batch.batchDetail?.total_classes ||
                                    'N/A'}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                                Start Date: {formatDate(batch.start_date)}
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>End Date: {formatDate(batch.end_date)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="border-t pt-4">
                <Link
                    href={`/batch/show/${batch.id}`}
                    className="inline-flex items-center rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
