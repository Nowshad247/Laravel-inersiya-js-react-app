import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { BatchFormData } from '@/types/Batch';
import { Button } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Create({
    courses,
}: {
    courses: { id: number; name: string }[];
}) {
    const [weekdaysSelected, setWeekdaysSelected] = useState<string[]>([]);
    const [faqItems, setFaqItems] = useState<
        Array<{ question: string; answer: string }>
    >([]);
    const [instructorName, setInstructorName] = useState('');
    const [instructorTitle, setInstructorTitle] = useState('');
    const [instructorDescription, setInstructorDescription] = useState('');
    const [instructorPhone, setInstructorPhone] = useState('');

    function submit(e: React.FormEvent) {
        e.preventDefault();

        // Build instructor details JSON
        const instructorDetails = {
            name: instructorName,
            title: instructorTitle,
            description: instructorDescription,
            phone: instructorPhone,
        };

        setData('instructor_details_json', JSON.stringify(instructorDetails));
        post('/batch/create');
    }
    const { data, setData, post, processing, errors } = useForm<
        BatchFormData & { general?: string }
    >({
        name: '',
        course_id: 0,
        batch_code: '',
        start_date: '',
        end_date: '',
        batch_status: 'pending',
        TotalClass: 0,
        total_classes: 0,
        price: '',
        discount_price: '',
        batch_modules: '',
        weekdays: [],
        class_time: '',
        delivery_mode: '',
        description: '',
        opportunity: '',
        faq_json: '',
        instructor_details_json: '',
    });
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Batches Create',
            href: dashboard().url,
        },
    ];

    const weekdayOptions = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];

    const toggleWeekday = (day: string) => {
        const updated = weekdaysSelected.includes(day)
            ? weekdaysSelected.filter((d) => d !== day)
            : [...weekdaysSelected, day];
        setWeekdaysSelected(updated);
        setData('weekdays', updated);
    };

    const addFaqItem = () => {
        const newItem = { question: '', answer: '' };
        const updated = [...faqItems, newItem];
        setFaqItems(updated);
        setData('faq_json', JSON.stringify(updated));
    };

    const updateFaqItem = (
        index: number,
        field: 'question' | 'answer',
        value: string,
    ) => {
        const updated = [...faqItems];
        updated[index][field] = value;
        setFaqItems(updated);
        setData('faq_json', JSON.stringify(updated));
    };

    const removeFaqItem = (index: number) => {
        const updated = faqItems.filter((_, i) => i !== index);
        setFaqItems(updated);
        setData('faq_json', JSON.stringify(updated));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Batch" />
            <div className="p-6">
                <form onSubmit={submit} method="post" className="space-y-6">
                    {/* General Error */}
                    {errors.general && (
                        <div className="mb-4 rounded-lg bg-red-100 p-4 text-red-700">
                            {errors.general}
                        </div>
                    )}

                    {/* BASIC BATCH INFO */}
                    <div className="rounded-lg border border-gray-200 p-6">
                        <h2 className="mb-4 text-lg font-bold">
                            Basic Batch Information
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Batch Name */}
                            <div>
                                <Label>Batch Name *</Label>
                                <Input
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                    placeholder="e.g., Advanced Web Development"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Batch Code */}
                            <div>
                                <Label>Batch Code * (Max 10 characters)</Label>
                                <Input
                                    type="text"
                                    maxLength={10}
                                    value={data.batch_code}
                                    onChange={(e) =>
                                        setData('batch_code', e.target.value)
                                    }
                                    placeholder="e.g., WEB-2026-01"
                                />
                                {errors.batch_code && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.batch_code}
                                    </p>
                                )}
                            </div>

                            {/* Course */}
                            <div>
                                <Label>Course *</Label>
                                <select
                                    value={data.course_id}
                                    onChange={(e) =>
                                        setData(
                                            'course_id',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : 0,
                                        )
                                    }
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Select Course</option>
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
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.course_id}
                                    </p>
                                )}
                            </div>

                            {/* Batch Status */}
                            <div>
                                <Label>Batch Status *</Label>
                                <select
                                    value={data.batch_status}
                                    onChange={(e) =>
                                        setData('batch_status', e.target.value)
                                    }
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Completed</option>
                                    <option value="archived">Upcoming</option>
                                </select>
                                {errors.batch_status && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.batch_status}
                                    </p>
                                )}
                            </div>

                            {/* Start Date */}
                            <div>
                                <Label>Start Date *</Label>
                                <Input
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) =>
                                        setData('start_date', e.target.value)
                                    }
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.start_date}
                                    </p>
                                )}
                            </div>

                            {/* End Date */}
                            <div>
                                <Label>End Date *</Label>
                                <Input
                                    type="date"
                                    value={data.end_date}
                                    onChange={(e) =>
                                        setData('end_date', e.target.value)
                                    }
                                />
                                {errors.end_date && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.end_date}
                                    </p>
                                )}
                            </div>

                            {/* Total Classes (Batch Table) */}
                            <div>
                                <Label>Total Classes (Batch) *</Label>
                                <Input
                                    type="number"
                                    value={data.TotalClass}
                                    onChange={(e) =>
                                        setData(
                                            'TotalClass',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : 0,
                                        )
                                    }
                                    placeholder="e.g., 30"
                                />
                                {errors.TotalClass && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.TotalClass}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* BATCH DETAILS */}
                    <div className="rounded-lg border border-gray-200 p-6">
                        <h2 className="mb-4 text-lg font-bold">
                            Batch Details
                        </h2>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Total Classes (Details table) */}
                            <div>
                                <Label>Duration (Days)</Label>
                                <Input
                                    type="number"
                                    value={data.total_classes}
                                    onChange={(e) =>
                                        setData(
                                            'total_classes',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : 0,
                                        )
                                    }
                                    placeholder="e.g., 60"
                                />
                                {errors.total_classes && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.total_classes}
                                    </p>
                                )}
                            </div>

                            {/* Price */}
                            <div>
                                <Label>Price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.price}
                                    onChange={(e) =>
                                        setData('price', e.target.value)
                                    }
                                    placeholder="e.g., 5000.00"
                                />
                                {errors.price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.price}
                                    </p>
                                )}
                            </div>

                            {/* Discount Price */}
                            <div>
                                <Label>Discount Price</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    value={data.discount_price}
                                    onChange={(e) =>
                                        setData(
                                            'discount_price',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="e.g., 4500.00"
                                />
                                {errors.discount_price && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.discount_price}
                                    </p>
                                )}
                            </div>

                            {/* Class Time */}
                            <div>
                                <Label>Class Time</Label>
                                <Input
                                    type="text"
                                    value={data.class_time}
                                    onChange={(e) =>
                                        setData('class_time', e.target.value)
                                    }
                                    placeholder="e.g., 10:00 AM - 12:00 PM"
                                />
                                {errors.class_time && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.class_time}
                                    </p>
                                )}
                            </div>

                            {/* Delivery Mode */}
                            <div>
                                <Label>Delivery Mode</Label>
                                <select
                                    value={data.delivery_mode}
                                    onChange={(e) =>
                                        setData(
                                            'delivery_mode',
                                            e.target.value as
                                                | 'online'
                                                | 'offline'
                                                | '',
                                        )
                                    }
                                    className="w-full rounded-md border border-gray-300 px-3 py-2"
                                >
                                    <option value="">Select Mode</option>
                                    <option value="online">Online</option>
                                    <option value="offline">Offline</option>
                                </select>
                                {errors.delivery_mode && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.delivery_mode}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Weekdays */}
                        <div className="mt-4">
                            <Label className="mb-2 block">
                                Which Weekdays?
                            </Label>
                            <div className="flex flex-wrap gap-3">
                                {weekdayOptions.map((day) => (
                                    <label
                                        key={day}
                                        className="flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 hover:bg-gray-50"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={weekdaysSelected.includes(
                                                day,
                                            )}
                                            onChange={() => toggleWeekday(day)}
                                            className="mb-0"
                                        />
                                        {day}
                                    </label>
                                ))}
                            </div>
                            {errors.weekdays && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.weekdays}
                                </p>
                            )}
                        </div>

                        {/* Batch Modules */}
                        <div className="mt-4">
                            <Label>Batch Modules</Label>
                            <textarea
                                value={data.batch_modules}
                                onChange={(e) =>
                                    setData('batch_modules', e.target.value)
                                }
                                placeholder="List all modules or topics covered in this batch (Bangla text supported)"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                            {errors.batch_modules && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.batch_modules}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="mt-4">
                            <Label>Description</Label>
                            <textarea
                                value={data.description}
                                onChange={(e) =>
                                    setData('description', e.target.value)
                                }
                                placeholder="Describe the batch details (Bangla text supported)"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                            {errors.description && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Opportunity */}
                        <div className="mt-4">
                            <Label>Opportunity</Label>
                            <textarea
                                value={data.opportunity}
                                onChange={(e) =>
                                    setData('opportunity', e.target.value)
                                }
                                placeholder="What opportunities will students get after completing this batch? (Bangla text supported)"
                                rows={3}
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                            {errors.opportunity && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.opportunity}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* FAQ SECTION */}
                    <div className="rounded-lg border border-gray-200 p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">FAQ</h2>
                            <Button
                                type="button"
                                onClick={addFaqItem}
                                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                            >
                                + Add FAQ
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {faqItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="rounded-md border border-gray-300 p-4"
                                >
                                    <div className="mb-2">
                                        <Label>Question {index + 1}</Label>
                                        <Input
                                            type="text"
                                            value={item.question}
                                            onChange={(e) =>
                                                updateFaqItem(
                                                    index,
                                                    'question',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter question (Bangla text supported)"
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <Label>Answer {index + 1}</Label>
                                        <textarea
                                            value={item.answer}
                                            onChange={(e) =>
                                                updateFaqItem(
                                                    index,
                                                    'answer',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter answer (Bangla text supported)"
                                            rows={3}
                                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => removeFaqItem(index)}
                                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ))}

                            {faqItems.length === 0 && (
                                <p className="text-gray-500">
                                    No FAQ items added yet. Click "Add FAQ" to
                                    add questions and answers.
                                </p>
                            )}
                        </div>

                        {errors.faq_json && (
                            <p className="mt-2 text-sm text-red-500">
                                {errors.faq_json}
                            </p>
                        )}
                    </div>

                    {/* INSTRUCTOR DETAILS */}
                    <div className="rounded-lg border border-gray-200 p-6">
                        <h2 className="mb-4 text-lg font-bold">
                            Instructor Details
                        </h2>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {/* Instructor Name */}
                            <div>
                                <Label>Instructor Name</Label>
                                <Input
                                    type="text"
                                    value={instructorName}
                                    onChange={(e) =>
                                        setInstructorName(e.target.value)
                                    }
                                    placeholder="e.g., John Doe"
                                />
                                {errors.instructor_details_json && (
                                    <p className="mt-1 text-sm text-red-500">
                                        {errors.instructor_details_json}
                                    </p>
                                )}
                            </div>

                            {/* Instructor Title */}
                            <div>
                                <Label>Instructor Title</Label>
                                <Input
                                    type="text"
                                    value={instructorTitle}
                                    onChange={(e) =>
                                        setInstructorTitle(e.target.value)
                                    }
                                    placeholder="e.g., Senior Developer"
                                />
                            </div>

                            {/* Instructor Phone */}
                            <div>
                                <Label>Instructor Phone</Label>
                                <Input
                                    type="tel"
                                    value={instructorPhone}
                                    onChange={(e) =>
                                        setInstructorPhone(e.target.value)
                                    }
                                    placeholder="e.g., +880123456789"
                                />
                            </div>
                        </div>

                        {/* Instructor Description */}
                        <div className="mt-4">
                            <Label>Instructor Description</Label>
                            <textarea
                                value={instructorDescription}
                                onChange={(e) =>
                                    setInstructorDescription(e.target.value)
                                }
                                placeholder="Brief description about the instructor and their expertise (Bangla text supported)"
                                rows={4}
                                className="w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button
                            disabled={processing}
                            className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                            type="submit"
                        >
                            {processing ? 'Saving...' : 'Save Batch'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
