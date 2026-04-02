import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

type Batch = Record<string, any>;

interface Props {
    batch: Batch;
    courses: { id: number; name: string }[];
    error?: string;
}

interface FAQ {
    question: string;
    answer: string;
}

export default function Update({ batch, courses, error }: Props) {
    const WEEKDAYS = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const [localFaq, setLocalFaq] = useState<FAQ[]>(batch.faq || []);
    const [instructorName, setInstructorName] = useState(
        batch.instructor_details?.name || '',
    );
    const [instructorTitle, setInstructorTitle] = useState(
        batch.instructor_details?.title || '',
    );
    const [instructorPhone, setInstructorPhone] = useState(
        batch.instructor_details?.phone || '',
    );
    const [instructorDesc, setInstructorDesc] = useState(
        batch.instructor_details?.description || '',
    );

    const { data, setData, put, processing, errors } = useForm<
        Record<string, any>
    >({
        // Batch Info
        name: batch.name,
        batch_code: batch.batch_code,
        course_id: batch.course_id,
        start_date: batch.start_date,
        end_date: batch.end_date,
        TotalClass: batch.TotalClass,
        batch_status: batch.batch_status,
        // Batch Details
        total_classes: batch.total_classes,
        price: batch.price,
        discount_price: batch.discount_price,
        batch_modules: batch.batch_modules,
        weekdays: batch.weekdays || [],
        class_time: batch.class_time,
        delivery_mode: batch.delivery_mode,
        description: batch.description,
        opportunity: batch.opportunity,
        faq_json: '',
        instructor_details_json: '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Batches / Update', href: dashboard().url },
    ];

    function handleWeekdayChange(day: string) {
        setData((prev) => ({
            ...prev,
            weekdays: prev.weekdays.includes(day)
                ? prev.weekdays.filter((d: string) => d !== day)
                : [...prev.weekdays, day],
        }));
    }

    function addFaq() {
        setLocalFaq([...localFaq, { question: '', answer: '' }]);
    }

    function updateFaq(
        index: number,
        field: 'question' | 'answer',
        value: string,
    ) {
        const updated = [...localFaq];
        updated[index][field] = value;
        setLocalFaq(updated);
    }

    function removeFaq(index: number) {
        setLocalFaq(localFaq.filter((_, i) => i !== index));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();

        const submitData = {
            ...data,
            faq_json: localFaq.length > 0 ? JSON.stringify(localFaq) : '',
            instructor_details_json:
                instructorName ||
                instructorTitle ||
                instructorPhone ||
                instructorDesc
                    ? JSON.stringify({
                          name: instructorName,
                          title: instructorTitle,
                          phone: instructorPhone,
                          description: instructorDesc,
                      })
                    : '',
        };

        put(`/batch/edit/${batch.id}`, {
            data: submitData,
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Batch" />

            {error && (
                <div className="mb-4 rounded bg-red-100 p-4 text-red-700">
                    {error}
                </div>
            )}

            <div className="max-w-4xl space-y-8 p-6">
                <div>
                    <h1 className="mb-2 text-3xl font-bold">
                        Update Batch: {batch.name}
                    </h1>
                    <p className="text-gray-600">
                        Update batch information and details below
                    </p>
                </div>

                <form onSubmit={submit} className="space-y-8">
                    {/* ======================= BATCH INFORMATION ======================= */}
                    <div className="rounded-lg border-2 border-blue-200 bg-blue-50 p-6">
                        <h2 className="mb-6 text-xl font-bold text-blue-900">
                            Batch Information
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Batch Name *
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.name
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Batch Code */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Batch Code (Max 10 chars) *
                                </label>
                                <input
                                    type="text"
                                    maxLength={10}
                                    value={data.batch_code}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            batch_code: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.batch_code
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {errors.batch_code && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.batch_code}
                                    </p>
                                )}
                            </div>

                            {/* Course */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Course *
                                </label>
                                <select
                                    value={data.course_id}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            course_id: Number(e.target.value),
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.course_id
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="">Select a course</option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.course_id && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.course_id}
                                    </p>
                                )}
                            </div>

                            {/* Status */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Batch Status *
                                </label>
                                <select
                                    value={data.batch_status}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            batch_status: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.batch_status
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="completed">Completed</option>
                                    <option value="pending">Pending</option>
                                </select>
                                {errors.batch_status && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.batch_status}
                                    </p>
                                )}
                            </div>

                            {/* Start Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            start_date: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.start_date
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>

                            {/* End Date */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            end_date: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.end_date
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {errors.end_date && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>

                            {/* Total Classes */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Total Classes *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.TotalClass}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            TotalClass: Number(e.target.value),
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.TotalClass
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-blue-500'
                                    }`}
                                />
                                {errors.TotalClass && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.TotalClass}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ======================= BATCH DETAILS ======================= */}
                    <div className="rounded-lg border-2 border-green-200 bg-green-50 p-6">
                        <h2 className="mb-6 text-xl font-bold text-green-900">
                            Batch Details
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Batch Modules */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Batch Modules
                                </label>
                                <input
                                    type="text"
                                    value={data.batch_modules || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            batch_modules: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., Module 1, Module 2, Module 3"
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.batch_modules
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {errors.batch_modules && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.batch_modules}
                                    </p>
                                )}
                            </div>

                            {/* Total Classes (Detail) */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Total Classes
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.total_classes || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            total_classes: e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.total_classes
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {errors.total_classes && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.total_classes}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Price (৳)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.price || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            price: e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.price
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Discount Price */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Discount Price (৳)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={data.discount_price || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            discount_price: e.target.value
                                                ? Number(e.target.value)
                                                : '',
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.discount_price
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {errors.discount_price && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.discount_price}
                                    </p>
                                )}
                            </div>

                            {/* Class Time */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Class Time
                                </label>
                                <input
                                    type="text"
                                    value={data.class_time || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            class_time: e.target.value,
                                        }))
                                    }
                                    placeholder="e.g., 10:00 AM - 12:00 PM"
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.class_time
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {errors.class_time && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.class_time}
                                    </p>
                                )}
                            </div>

                            {/* Delivery Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Delivery Mode
                                </label>
                                <select
                                    value={data.delivery_mode || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            delivery_mode: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.delivery_mode
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                >
                                    <option value="">Select mode</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                                {errors.delivery_mode && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.delivery_mode}
                                    </p>
                                )}
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.description || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.description
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            {/* Opportunity */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Opportunity
                                </label>
                                <textarea
                                    rows={3}
                                    value={data.opportunity || ''}
                                    onChange={(e) =>
                                        setData((prev) => ({
                                            ...prev,
                                            opportunity: e.target.value,
                                        }))
                                    }
                                    className={`mt-2 block w-full rounded-lg border p-3 shadow-sm focus:ring-2 focus:outline-none ${
                                        errors.opportunity
                                            ? 'border-red-500 focus:ring-red-500'
                                            : 'border-gray-300 focus:ring-green-500'
                                    }`}
                                />
                                {errors.opportunity && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.opportunity}
                                    </p>
                                )}
                            </div>

                            {/* Weekdays */}
                            <div className="md:col-span-2">
                                <label className="mb-3 block text-sm font-semibold text-gray-700">
                                    Class Days
                                </label>
                                <div className="grid gap-3 md:grid-cols-4">
                                    {WEEKDAYS.map((day) => (
                                        <label
                                            key={day}
                                            className="flex cursor-pointer items-center gap-2"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.weekdays.includes(
                                                    day,
                                                )}
                                                onChange={() =>
                                                    handleWeekdayChange(day)
                                                }
                                                className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <span className="text-gray-700">
                                                {day}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                {errors.weekdays && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.weekdays}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ======================= INSTRUCTOR DETAILS ======================= */}
                    <div className="rounded-lg border-2 border-purple-200 bg-purple-50 p-6">
                        <h2 className="mb-6 text-xl font-bold text-purple-900">
                            Instructor Details
                        </h2>

                        <div className="grid gap-6 md:grid-cols-2">
                            {/* Instructor Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Instructor Name
                                </label>
                                <input
                                    type="text"
                                    value={instructorName}
                                    onChange={(e) =>
                                        setInstructorName(e.target.value)
                                    }
                                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Instructor Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Instructor Title
                                </label>
                                <input
                                    type="text"
                                    value={instructorTitle}
                                    onChange={(e) =>
                                        setInstructorTitle(e.target.value)
                                    }
                                    placeholder="e.g., Senior Developer"
                                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Instructor Phone */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Instructor Phone
                                </label>
                                <input
                                    type="tel"
                                    value={instructorPhone}
                                    onChange={(e) =>
                                        setInstructorPhone(e.target.value)
                                    }
                                    placeholder="e.g., +8801234567890"
                                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>

                            {/* Instructor Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">
                                    Instructor Description
                                </label>
                                <textarea
                                    rows={2}
                                    value={instructorDesc}
                                    onChange={(e) =>
                                        setInstructorDesc(e.target.value)
                                    }
                                    placeholder="Brief bio or description"
                                    className="mt-2 block w-full rounded-lg border border-gray-300 p-3 shadow-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ======================= FAQ ======================= */}
                    <div className="rounded-lg border-2 border-yellow-200 bg-yellow-50 p-6">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-yellow-900">
                                FAQ
                            </h2>
                            <button
                                type="button"
                                onClick={addFaq}
                                className="rounded-lg bg-yellow-600 px-4 py-2 text-white hover:bg-yellow-700"
                            >
                                + Add FAQ
                            </button>
                        </div>

                        {localFaq.length > 0 ? (
                            <div className="space-y-4">
                                {localFaq.map((item, index) => (
                                    <div
                                        key={index}
                                        className="rounded-lg border border-yellow-300 bg-white p-4"
                                    >
                                        <div className="mb-3 flex items-center justify-between">
                                            <span className="font-semibold text-gray-700">
                                                Q&A #{index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeFaq(index)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Remove
                                            </button>
                                        </div>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600">
                                                    Question
                                                </label>
                                                <input
                                                    type="text"
                                                    value={item.question}
                                                    onChange={(e) =>
                                                        updateFaq(
                                                            index,
                                                            'question',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded border border-gray-300 p-2"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-600">
                                                    Answer
                                                </label>
                                                <textarea
                                                    rows={2}
                                                    value={item.answer}
                                                    onChange={(e) =>
                                                        updateFaq(
                                                            index,
                                                            'answer',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded border border-gray-300 p-2"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600">
                                No FAQs added yet. Click "Add FAQ" to add one.
                            </p>
                        )}
                    </div>

                    {/* ======================= SUBMIT BUTTON ======================= */}
                    <div className="flex gap-4 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                        >
                            {processing
                                ? 'Updating...'
                                : 'Update Batch & Details'}
                        </button>
                        <a
                            href="/batch"
                            className="rounded-lg bg-gray-600 px-6 py-3 font-semibold text-white hover:bg-gray-700"
                        >
                            Cancel
                        </a>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
