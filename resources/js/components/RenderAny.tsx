import React from 'react';

// Refined Type to be more TypeScript friendly
type JSONValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | JSONValue[]
    | { [key: string]: JSONValue };

interface RenderAnyProps {
    data: JSONValue;
}

const RenderAny: React.FC<RenderAnyProps> = ({ data }) => {
    // 1. Blacklist
    const blacklistedKeys = [
        "errors", "Field", "Value", "quote", "flash", "auth", 
        "sidebarOpen", "pivot", "id", "batch_id", "course_id"
    ];

    // 2. Helper to format dates
    const formatDate = (key: string, value: any): string => {
        if (typeof value !== 'string') return String(value);
        const isDateKey = key.toLowerCase().includes('at') || key.toLowerCase().includes('date');
        const isISOString = /^\d{4}-\d{2}-\d{2}/.test(value);

        if (isDateKey && isISOString) {
            try {
                return new Date(value).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            } catch { return value; }
        }
        return value;
    };

    // 3. Helper to check if a value is an image URL
    const isImageUrl = (value: any): boolean => {
        if (typeof value !== 'string') return false;
        return /\.(jpeg|jpg|gif|png|webp|svg)$/.test(value);
    };

    if (data === null || data === undefined) return null;

    // 4. Handle Arrays (e.g. Courses)
    if (Array.isArray(data)) {
        return (
            <div className="space-y-4 w-full mt-2">
                {data.map((item, index) => (
                    <div key={index} className="border-l-4 border-indigo-600 bg-white shadow-sm rounded-r-lg overflow-hidden">
                        <div className="px-4 py-1 bg-indigo-600 text-white text-[10px] font-bold uppercase tracking-widest">
                            Item {index + 1}
                        </div>
                        {/* Recursive call */}
                        <RenderAny data={item as JSONValue} />
                    </div>
                ))}
            </div>
        );
    }

    // 5. Handle Objects (Student info, Batch info)
    if (typeof data === 'object') {
        const sourceData = (data as Record<string, JSONValue>).studentData 
            ? (data as Record<string, JSONValue>).studentData 
            : data;

        const entries = Object.entries(sourceData as Record<string, JSONValue>)
            .filter(([key]) => !blacklistedKeys.includes(key));

        return (
            <div className="w-full overflow-hidden border border-gray-200 rounded-lg bg-white shadow-sm">
                <table className="min-w-full table-auto text-sm">
                    <tbody className="divide-y divide-gray-100">
                        {entries.map(([key, value]) => {
                            const isNested = value !== null && typeof value === 'object';
                            const isNameField = key.toLowerCase() === 'name';

                            return (
                                <tr key={key} className="group hover:bg-blue-50/20 transition-colors">
                                    <td className="px-4 py-3 font-bold text-gray-700 border-r bg-gray-50/50 w-48 capitalize">
                                        {key.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-4 py-3">
                                        {isNested ? (
                                            <div className="p-2 border-l-4 border-emerald-500 bg-emerald-50/30 rounded-r-md">
                                                <div className="text-[10px] font-bold text-emerald-700 uppercase mb-2">
                                                    {key} Details
                                                </div>
                                                <RenderAny data={value as JSONValue} />
                                            </div>
                                        ) : isImageUrl(value) ? (
                                            <img 
                                                src= {`/storage/${ value as string}`}
                                                alt={key} 
                                                className="h-20 w-20 object-cover rounded-md border" 
                                            />
                                        ) : (
                                            <span className={`break-all ${isNameField ? "text-blue-700 font-extrabold text-lg" : "text-gray-600 font-medium"}`}>
                                                {formatDate(key, value)}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        );
    }

    // 6. Primitives
    return <span className="px-2 font-medium">{String(data)}</span>;
};

export default RenderAny;
