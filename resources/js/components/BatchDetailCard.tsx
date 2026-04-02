// resources/js/components/BatchDetailCard.tsx
import { type BatchDetail } from '@/types/Batch';

interface BatchDetailCardProps {
    batchDetail: BatchDetail | null | undefined;
}

export function BatchDetailCard({ batchDetail }: BatchDetailCardProps) {
    if (!batchDetail) {
        return (
            <div className="m-6 rounded-2xl bg-white p-8 shadow-lg">
                <p className="text-center text-gray-500">
                    No batch details available
                </p>
            </div>
        );
    }

    return (
        <div className="m-6 rounded-2xl bg-white p-8 shadow-lg">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3 border-b-2 border-indigo-500 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500">
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
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Batch Details
                </h2>
            </div>

            {/* Content Grid */}
            <div className="space-y-6">
                {/* Classes & Schedule Section */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {batchDetail.total_classes && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">
                                Total Classes
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {batchDetail.total_classes}
                            </p>
                        </div>
                    )}

                    {batchDetail.class_time && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">
                                Class Time
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">
                                {batchDetail.class_time}
                            </p>
                        </div>
                    )}

                    {batchDetail.delivery_mode && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">
                                Delivery Mode
                            </p>
                            <p className="mt-2">
                                <span className="inline-block rounded-full bg-orange-200 px-4 py-1 text-sm font-bold text-orange-900 capitalize">
                                    {batchDetail.delivery_mode}
                                </span>
                            </p>
                        </div>
                    )}

                    {batchDetail.batch_modules && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm font-semibold text-gray-600">
                                Modules
                            </p>
                            <p className="mt-2 text-gray-900">
                                {batchDetail.batch_modules}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pricing Section */}
                {(batchDetail.price || batchDetail.discount_price) && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        {batchDetail.price && (
                            <div className="rounded-lg border-2 border-green-200 bg-green-50 p-4">
                                <p className="text-sm font-semibold text-green-700">
                                    Price
                                </p>
                                <p className="mt-2 text-3xl font-bold text-green-900">
                                    ৳{' '}
                                    {parseFloat(
                                        batchDetail.price,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        )}

                        {batchDetail.discount_price && (
                            <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-4">
                                <p className="text-sm font-semibold text-blue-700">
                                    Discount Price
                                </p>
                                <p className="mt-2 text-3xl font-bold text-blue-900">
                                    ৳{' '}
                                    {parseFloat(
                                        batchDetail.discount_price,
                                    ).toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                )}
                {/* Weekdays Section */}
                {batchDetail.weekdays && batchDetail.weekdays.length > 0 && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                        <p className="mb-3 text-sm font-semibold text-gray-600">
                            Class Days
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {batchDetail.weekdays.map(
                                (day: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="inline-flex items-center rounded-full bg-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-900"
                                    >
                                        {day}
                                    </span>
                                ),
                            )}
                        </div>
                    </div>
                )}

                {/* Description & Opportunity */}
                <div className="grid grid-cols-1 gap-6">
                    {batchDetail.description && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="mb-2 text-sm font-semibold text-gray-600">
                                Description
                            </p>
                            <p className="leading-relaxed text-gray-900">
                                {batchDetail.description}
                            </p>
                        </div>
                    )}

                    {batchDetail.opportunity && (
                        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                            <p className="mb-2 text-sm font-semibold text-gray-600">
                                Opportunity
                            </p>
                            <p className="leading-relaxed text-gray-900">
                                {batchDetail.opportunity}
                            </p>
                        </div>
                    )}
                </div>

                {/* Instructor Details */}
                {batchDetail.instructor_details && (
                    <div className="rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6">
                        <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-purple-500">
                                <svg
                                    className="h-8 w-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <p className="mb-2 text-xs font-semibold tracking-wide text-purple-600 uppercase">
                                    Instructor
                                </p>

                                {batchDetail.instructor_details.name && (
                                    <h3 className="mb-1 text-xl font-bold text-gray-900">
                                        {batchDetail.instructor_details.name}
                                    </h3>
                                )}

                                {batchDetail.instructor_details.title && (
                                    <p className="mb-3 text-sm font-semibold text-purple-700">
                                        {batchDetail.instructor_details.title}
                                    </p>
                                )}

                                <div className="mt-3 space-y-2 border-t border-purple-200 pt-3">
                                    {batchDetail.instructor_details.phone && (
                                        <div className="flex items-center gap-3">
                                            <svg
                                                className="h-4 w-4 text-purple-600"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                />
                                            </svg>
                                            <a
                                                href={`tel:${batchDetail.instructor_details.phone}`}
                                                className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                                            >
                                                {
                                                    batchDetail
                                                        .instructor_details
                                                        .phone
                                                }
                                            </a>
                                        </div>
                                    )}

                                    {batchDetail.instructor_details
                                        .description && (
                                        <div className="mt-3 rounded-lg border border-purple-100 bg-white p-3">
                                            <p className="text-sm leading-relaxed text-gray-700">
                                                {
                                                    batchDetail
                                                        .instructor_details
                                                        .description
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                {batchDetail.faq && batchDetail.faq.length > 0 && (
                    <div>
                        <h3 className="mb-4 text-lg font-bold text-gray-900">
                            FAQ
                        </h3>
                        <div className="space-y-3">
                            {batchDetail.faq.map((item: any, idx: number) => (
                                <details
                                    key={idx}
                                    className="group rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                                >
                                    <summary className="flex cursor-pointer items-center justify-between font-semibold text-gray-900">
                                        <span className="flex items-center gap-2">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-white">
                                                Q
                                            </span>
                                            {item.question}
                                        </span>
                                        <svg
                                            className="h-5 w-5 transform transition-transform group-open:rotate-180"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 14l-7 7m0 0l-7-7m7 7V3"
                                            />
                                        </svg>
                                    </summary>
                                    <div className="mt-3 flex gap-3 border-t border-gray-100 pt-3">
                                        <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-500 text-xs font-bold text-white">
                                            A
                                        </span>
                                        <p className="text-gray-700">
                                            {item.answer}
                                        </p>
                                    </div>
                                </details>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
