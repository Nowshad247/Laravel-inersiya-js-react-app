import { Batch } from '@/types/Batch';

interface BatchTableProps {
    batch: Batch;
}
function isDateString(value: string) {
    // matches: 2025-01-01 or 2025-01-01 10:30:00 or ISO
    return /^\d{4}-\d{2}-\d{2}/.test(value);
}

function formatDate(value: string) {
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;

    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);

    return `${dd}-${mm}-${yy}`;
}

function renderValue(value: unknown) {
    if (typeof value === 'string') {
        return isDateString(value) ? formatDate(value) : value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
        return String(value);
    }

    // array of objects
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return <span className="text-gray-500 italic">No items</span>;
        }

        // check if it's an array of objects (like FAQ)
        if (typeof value[0] === 'object' && value[0] !== null) {
            return (
                <div className="space-y-3">
                    {value.map((item, idx) => (
                        <div
                            key={idx}
                            className="rounded-lg border-l-4 border-blue-500 bg-blue-50 p-3"
                        >
                            {Object.entries(item).map(([k, v]) => (
                                <div key={k} className="mb-2">
                                    <span className="font-semibold text-gray-700">
                                        {k.replace(/_/g, ' ')}:
                                    </span>
                                    <span className="ml-2 text-gray-600">
                                        {renderValue(v)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            );
        }

        // array of primitives
        return (
            <div className="space-y-1">
                {value.map((item, idx) => (
                    <div key={idx} className="text-gray-600">
                        • {String(item)}
                    </div>
                ))}
            </div>
        );
    }

    // object (nested)
    if (typeof value === 'object' && value !== null) {
        const entries = Object.entries(value).filter(
            ([, v]) => v !== null && v !== undefined && v !== '',
        );

        if (entries.length === 0) {
            return <span className="text-gray-500 italic">No details</span>;
        }

        return (
            <div className="space-y-2 rounded-lg bg-gray-50 p-3">
                {entries.map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                        <span className="font-medium text-gray-700">
                            {k.replace(/_/g, ' ')}:
                        </span>
                        <span className="text-gray-600">{renderValue(v)}</span>
                    </div>
                ))}
            </div>
        );
    }

    // fallback
    return String(value);
}

export function BatchTable({ batch }: BatchTableProps) {
    const batchEntries = Object.entries(batch).filter(
        ([key, value]) =>
            key !== 'students' &&
            key !== 'detail' &&
            value !== null &&
            value !== undefined &&
            value !== '' &&
            key !== 'course_id',
    );

    const batchDetail = batch.detail;

    if (batchEntries.length === 0 && !batchDetail) {
        return <p className="m-6 text-gray-500">No batch data available</p>;
    }

    return (
        <div className="m-6 space-y-8 bg-gradient-to-br from-gray-50 to-gray-100 p-4">
            {/* ==================== BATCH INFORMATION TABLE ==================== */}
            <div className="rounded-2xl bg-white p-8 shadow-lg">
                <div className="mb-8 flex items-center gap-3 border-b-2 border-blue-500 pb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500">
                        <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Batch Information
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <tbody>
                            {batchEntries.map(([key, value]) => (
                                <tr
                                    key={key}
                                    className="border-b border-gray-200 hover:bg-gray-50"
                                >
                                    <td className="w-1/4 bg-gray-50 px-6 py-4 text-sm font-semibold text-gray-700">
                                        {key.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {renderValue(value)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
