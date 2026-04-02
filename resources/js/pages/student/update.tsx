import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Student Update', href: dashboard().url },
];

interface Student {
    id: string | number;
    name: string;
    father_name: string;
    mother_name: string;
    student_uid?: string | null;
    phone?: string | null;
    email: string;
    photo: File | string | null;
    address?: string | null;
    guardian_name?: string | null;
    guardian_phone?: string | null;
    guardian_relation?: string | null;
    status: 'active' | 'inactive';
    batch_id: string | number | null;
    course_ids: (string | number)[];
}

interface Batch {
    id: string | number;
    name: string;
    course_id: number;
}

interface Course {
    id: string | number;
    name: string;
}

interface Props {
    student: Student;
    batches: Batch[];
    courses: Course[];
    student_course_ids: number[];
}

export default function StudentEdit({
    student,
    batches,
    courses,
    student_course_ids,
}: Props) {
    const initialBatch = batches.find(
        (b) => Number(b.id) === Number(student.batch_id),
    );

    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        initialBatch?.course_id ?? null,
    );

    const isFirstLoad = useRef(true);

    const { data, setData, put, errors, processing } = useForm<{
        student_id: string | number;
        name: string;
        father_name: string;
        mother_name: string;
        student_uid: string;
        phone: string;
        email: string;
        photo: File | null;
        address: string;
        guardian_name: string;
        guardian_phone: string;
        guardian_relation: string;
        status: 'active' | 'inactive';
        batch_id: string | number | null;
        course_ids: (string | number)[];
    }>({
        student_id: student.id,
        name: student.name,
        father_name: student.father_name,
        mother_name: student.mother_name,
        student_uid: student.student_uid ?? '',
        phone: student.phone ?? '',
        email: student.email,
        photo: null,
        address: student.address ?? '',
        guardian_name: student.guardian_name ?? '',
        guardian_phone: student.guardian_phone ?? '',
        guardian_relation: student.guardian_relation ?? '',
        status: student.status,
        batch_id: student.batch_id ?? null,
        course_ids: student_course_ids ?? [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/students/edit/${student.id}`, {
            forceFormData: true,
        });
    };

    // ✅ reset batch only when user changes course
    useEffect(() => {
        if (isFirstLoad.current) {
            isFirstLoad.current = false;
            return;
        }
        setData('batch_id', student.batch_id);
    }, [selectedCourseId]);

    useEffect(() => {
        if (selectedCourseId) {
            setData('course_ids', [selectedCourseId]);
        } else {
            setData('course_ids', []);
        }
    }, [selectedCourseId]);

    function back() {
        throw new Error('Function not implemented.');
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Update Student" />

            <div className="m-6 max-w-4xl p-6">
                <form
                    onSubmit={submit}
                    className="grid grid-cols-1 gap-6 md:grid-cols-2"
                >
                    {/* LEFT */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-red-500">{errors.name}</p>
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
                                <p className="text-red-500">
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
                                <p className="text-red-500">
                                    {errors.mother_name}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Student UID</Label>
                            <Input
                                value={data.student_uid || ''}
                                onChange={(e) =>
                                    setData('student_uid', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <Input
                                value={data.phone || ''}
                                onChange={(e) =>
                                    setData('phone', e.target.value)
                                }
                            />
                            {errors.phone && (
                                <p className="text-red-500">{errors.phone}</p>
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
                                <p className="text-red-500">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <Label>Address</Label>
                            <textarea
                                className="w-full rounded border p-2"
                                value={data.address || ''}
                                onChange={(e) =>
                                    setData('address', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Photo</Label>

                            {typeof student.photo === 'string' && (
                                <img
                                    src={`/storage/${student.photo}`}
                                    className="mb-2 h-32 w-32 rounded object-cover"
                                />
                            )}

                            <Input
                                type="file"
                                onChange={(e) =>
                                    setData(
                                        'photo',
                                        e.target.files?.[0] || null,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label>Guardian Name</Label>
                            <Input
                                value={data.guardian_name || ''}
                                onChange={(e) =>
                                    setData('guardian_name', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Guardian Phone</Label>
                            <Input
                                value={data.guardian_phone || ''}
                                onChange={(e) =>
                                    setData('guardian_phone', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Guardian Relation</Label>
                            <Input
                                value={data.guardian_relation || ''}
                                onChange={(e) =>
                                    setData('guardian_relation', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label>Status</Label>
                            <select
                                className="w-full rounded border p-2"
                                value={data.status}
                                onChange={(e) =>
                                    setData(
                                        'status',
                                        e.target.value as 'active' | 'inactive',
                                    )
                                }
                            >
                                <option value="active">Active</option>
                                {errors.status && (
                                    <p className="text-red-500">
                                        {errors.status}
                                    </p>
                                )}
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* COURSE */}
                        <div>
                            <Label>Select Course</Label>
                            <select
                                className="w-full rounded border p-2"
                                value={selectedCourseId ?? ''}
                                onChange={(e) =>
                                    setSelectedCourseId(
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
                        </div>

                        {/* BATCH */}
                        <div>
                            <Label>Select Batch</Label>
                            <select>
                                {batches.map((batch) => {
                                    if (
                                        selectedCourseId &&
                                        Number(batch.course_id) ===
                                            Number(selectedCourseId)
                                    ) {
                                        return (
                                            <option
                                                key={batch.id}
                                                value={batch.id}
                                            >
                                                {batch.name}
                                            </option>
                                        );
                                    }
                                    return null;
                                })}
                            </select>

                            {errors.batch_id && (
                                <p className="text-red-500">
                                    {errors.batch_id}
                                </p>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            disabled={processing}
                        >
                            {processing ? 'Updating...' : 'Update Student'}
                        </Button>
                        {/* Delete */}
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (
                                    confirm(
                                        'Are you sure you want to delete this student?',
                                    )
                                ) {
                                    if (!student.id) {
                                        alert(
                                            'Student ID is missing. Cannot delete.',
                                        );
                                        return;
                                    }

                                    router.delete(
                                        `/students/delete/${student.id}`,
                                    );
                                }
                            }}
                        >
                            Delete Student
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
