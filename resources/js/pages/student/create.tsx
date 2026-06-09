import { DataTable } from '@/components/DataTable/LeadDataTable';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { Admission, type BreadcrumbItem } from '@/types';
import { Batch } from '@/types/Batch';
import { Course } from '@/types/Course';
import { Head, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { admissionColumns } from './DataTable/addmissionDataColumns';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Student',
        href: dashboard().url,
    },
];

interface Props {
    batchs: Batch[];
    courses: Course[];
    admissions: Admission[];
}

export default function CreateStudent({ batchs, courses, admissions }: Props) {
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null,
    );
    const [activeTab, setActiveTab] = useState<'form' | 'table'>('form');

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        father_name: '',
        mother_name: '',
        email: '',
        phone: '',
        address: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_relation: '',
        status: 'active',
        batch_id: null as number | null,
        course_ids: [] as number[],
        photo: null as File | null,
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/students/create', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    // Scroll to first error
    useEffect(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            document
                .querySelector(`[name="${firstErrorKey}"]`)
                ?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [errors]);

    // Reset batch when course changes
    useEffect(() => {
        setData('batch_id', null);
    }, [selectedCourseId, setData]);

    // Sync course with form data
    useEffect(() => {
        if (selectedCourseId) {
            setData('course_ids', [selectedCourseId]);
        } else {
            setData('course_ids', []);
        }
    }, [selectedCourseId, setData]);

    const tableData = useMemo(() => admissions, [admissions]);

    console.log('Admissions data for table:', tableData);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Add Student" />
            <div className="m-6 p-6">
                <div className="mb-6 flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setActiveTab('form')}
                        className={
                            activeTab === 'form'
                                ? 'rounded border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white'
                                : 'rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700'
                        }
                    >
                        Student Form
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('table')}
                        className={
                            activeTab === 'table'
                                ? 'rounded border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-semibold text-white'
                                : 'rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700'
                        }
                    >
                        Admission Data
                    </button>
                </div>

                {activeTab === 'form' ? (
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <form onSubmit={submit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <Label className="my-2">Name*</Label>
                                <Input
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData('name', e.target.value)
                                    }
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Parents */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="my-2">Father Name*</Label>
                                    <Input
                                        name="father_name"
                                        value={data.father_name}
                                        onChange={(e) =>
                                            setData(
                                                'father_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.father_name && (
                                        <p className="text-sm text-red-500">
                                            {errors.father_name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label className="my-2">Mother Name*</Label>
                                    <Input
                                        name="mother_name"
                                        value={data.mother_name}
                                        onChange={(e) =>
                                            setData(
                                                'mother_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.mother_name && (
                                        <p className="text-sm text-red-500">
                                            {errors.mother_name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Contact */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="my-2">Email*</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label className="my-2">Phone*</Label>
                                    <Input
                                        name="phone"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <Label className="my-2">Address</Label>
                                <textarea
                                    name="address"
                                    className="w-full rounded border px-3 py-2"
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                />
                                {errors.address && (
                                    <p className="text-sm text-red-500">
                                        {errors.address}
                                    </p>
                                )}
                            </div>

                            {/* Guardian */}
                            <div className="grid grid-cols-3 gap-4">
                                <Input
                                    name="guardian_name"
                                    placeholder="Guardian Name"
                                    value={data.guardian_name}
                                    onChange={(e) =>
                                        setData('guardian_name', e.target.value)
                                    }
                                />
                                <Input
                                    name="guardian_phone"
                                    placeholder="Guardian Phone"
                                    value={data.guardian_phone}
                                    onChange={(e) =>
                                        setData(
                                            'guardian_phone',
                                            e.target.value,
                                        )
                                    }
                                />
                                <Input
                                    name="guardian_relation"
                                    placeholder="Relation"
                                    value={data.guardian_relation}
                                    onChange={(e) =>
                                        setData(
                                            'guardian_relation',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>

                            {/* Course */}
                            <div>
                                <Label className="my-2">Select Course</Label>
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={selectedCourseId ?? ''}
                                    onChange={(e) =>
                                        setSelectedCourseId(
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        )
                                    }
                                >
                                    <option value="">
                                        -- Select Course --
                                    </option>
                                    {courses.map((course) => (
                                        <option
                                            key={course.id}
                                            value={
                                                course.id
                                                    ? course.id.toString()
                                                    : ''
                                            }
                                        >
                                            {course.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Batch */}
                            <div>
                                <Label className="my-2">Select Batch</Label>
                                <select
                                    className="w-full rounded border px-3 py-2"
                                    value={data.batch_id ?? ''}
                                    disabled={!selectedCourseId}
                                    onChange={(e) =>
                                        setData(
                                            'batch_id',
                                            e.target.value
                                                ? Number(e.target.value)
                                                : null,
                                        )
                                    }
                                >
                                    <option value="">
                                        {selectedCourseId
                                            ? '-- Select Batch --'
                                            : '-- Select Course First --'}
                                    </option>

                                    {batchs
                                        .filter(
                                            (batch) =>
                                                batch.course_id ===
                                                selectedCourseId,
                                        )
                                        .map((batch) => (
                                            <option
                                                key={batch.id}
                                                value={batch.id}
                                            >
                                                {batch.name}
                                            </option>
                                        ))}
                                </select>

                                {errors.batch_id && (
                                    <p className="text-sm text-red-500">
                                        {errors.batch_id}
                                    </p>
                                )}
                            </div>

                            {/* Photo */}
                            <div>
                                <Label className="my-2">Student Photo</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setData(
                                            'photo',
                                            e.target.files?.[0] || null,
                                        )
                                    }
                                />
                                {errors.photo && (
                                    <p className="text-sm text-red-500">
                                        {errors.photo}
                                    </p>
                                )}
                            </div>

                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Add Student'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className="rounded-xl border bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold">
                                    Admissions
                                </h2>
                                <p className="text-sm text-slate-500">
                                    Review recent admission records.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
                                <span>{tableData.length}</span>
                                <span>records</span>
                            </div>
                        </div>
                        <DataTable
                            columns={admissionColumns}
                            data={tableData}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
