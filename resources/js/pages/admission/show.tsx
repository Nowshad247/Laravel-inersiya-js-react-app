import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface AdmissionData {
    id: number;
    name: string;
    father_name: string | null;
    mother_name: string | null;
    email: string;
    phone: string;
    address: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    guardian_relation: string | null;
    gender: string | null;
    status: string;
    batch_id: number | null;
    course_ids: string[];
    photo: string | null;
    approved_status: string | null;
    batch?: {
        id: number;
        name: string;
        course_id: number;
        batch_code?: string;
        batch_status?: string;
    };
}

interface BatchItem {
    id: number;
    name: string;
    course_id: number;
}
interface CourseItem {
    id: number;
    name: string;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admissions', href: '/admission' },
    { title: 'Review', href: '#' },
];

export default function Show({
    admission,
    batchs,
    courses,
}: {
    admission: AdmissionData;
    batchs: BatchItem[];
    courses: CourseItem[];
}) {
    const initialCourseId =
        admission.batch?.course_id ??
        (admission.course_ids?.length ? Number(admission.course_ids[0]) : null);

    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        initialCourseId ?? null,
    );

    const { data, setData, post, processing, errors } = useForm({
        name: admission.name ?? '',
        father_name: admission.father_name ?? '',
        mother_name: admission.mother_name ?? '',
        email: admission.email ?? '',
        phone: admission.phone ?? '',
        address: admission.address ?? '',
        guardian_name: admission.guardian_name ?? '',
        guardian_phone: admission.guardian_phone ?? '',
        guardian_relation: admission.guardian_relation ?? '',
        gender: admission.gender ?? '',
        status: admission.status ?? 'active',
        batch_id: admission.batch_id ?? ('' as number | ''),
        course_ids: admission.course_ids ?? [],
        photo: null as File | null,
    });

    const filteredBatches = selectedCourseId
        ? batchs.filter((b) => Number(b.course_id) === Number(selectedCourseId))
        : batchs;

    function handleCourseChange(courseId: number | null) {
        setSelectedCourseId(courseId);
        setData((prev) => ({
            ...prev,
            course_ids: courseId ? [String(courseId)] : [],
            batch_id: '',
        }));
    }

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(`/admission/${admission.id}/approve`);
    }

    const selectClass =
        'w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Review Admission" />

            <div className="m-6 max-w-4xl rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-800">
                            Admission Review
                        </h2>
                        <p className="text-sm text-slate-500">
                            Verify details before approving
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                            admission.approved_status === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                        {admission.approved_status === 'active'
                            ? 'Approved'
                            : 'Pending'}
                    </span>
                </div>

                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                    {/* LEFT */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label>Full Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Father Name</Label>
                            <Input
                                value={data.father_name}
                                onChange={(e) =>
                                    setData('father_name', e.target.value)
                                }
                            />
                            {errors.father_name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.father_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Mother Name</Label>
                            <Input
                                value={data.mother_name}
                                onChange={(e) =>
                                    setData('mother_name', e.target.value)
                                }
                            />
                            {errors.mother_name && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.mother_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={data.phone}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                            {errors.phone && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Email</Label>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                            />
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Address</Label>
                            <textarea
                                className={selectClass}
                                rows={3}
                                value={data.address}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Gender</Label>
                            <select
                                className={selectClass}
                                value={data.gender}
                                onChange={(e) =>
                                    setData('gender', e.target.value)
                                }
                            >
                                <option value="">-- Select Gender --</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <div>
                            <Label>Photo</Label>
                            {admission.photo && (
                                <img
                                    src={`/storage/${admission.photo}`}
                                    alt="Applicant"
                                    className="mb-2 h-24 w-24 rounded-lg object-cover"
                                />
                            )}
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData(
                                        'photo',
                                        e.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            {errors.photo && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.photo}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label>Guardian Name</Label>
                            <Input
                                value={data.guardian_name}
                                onChange={(e) =>
                                    setData('guardian_name', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Guardian Phone</Label>
                            <Input
                                value={data.guardian_phone}
                                onChange={(e) =>
                                    setData('guardian_phone', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Guardian Relation</Label>
                            <Input
                                value={data.guardian_relation}
                                onChange={(e) =>
                                    setData('guardian_relation', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Status</Label>
                            <select
                                className={selectClass}
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value as 'active' | 'inactive',
                                    )
                                }
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            {errors.status && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Select Course</Label>
                            <select
                                className={selectClass}
                                value={selectedCourseId ?? ''}
                                onChange={(e) =>
                                    handleCourseChange(
                                        e.target.value
                                            ? Number(e.target.value)
                                            : null,
                                    )
                                }
                            >
                                <option value="">-- Select Course --</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            {errors.course_ids && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.course_ids}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Select Batch</Label>
                            <select
                                className={selectClass}
                                value={data.batch_id ?? ''}
                                onChange={(e) =>
                                    setData(
                                        'batch_id',
                                        e.target.value
                                            ? Number(e.target.value)
                                            : '',
                                    )
                                }
                            >
                                <option value="">-- Select Batch --</option>
                                {filteredBatches.map((batch) => (
                                    <option key={batch.id} value={batch.id}>
                                        {batch.name}
                                    </option>
                                ))}
                            </select>
                            {errors.batch_id && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.batch_id}
                                </p>
                            )}
                        </div>

                        <div className="mt-auto flex flex-col gap-3 pt-4">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Approving...'
                                    : 'Approve & Create Student'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
