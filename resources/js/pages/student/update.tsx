import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Student Update',
        href: dashboard().url,
    },
];

interface Student {
    id: string | number;
    name: string;
    email: string;
    batch_id: string | number | null;
    course_ids: (string | number)[];
}

interface Batch {
    id: string | number;
    name: string;
}

interface Course {
    id: string | number;
    name: string;
}

interface Props {
    student: Student;
    batches: Batch[];
    courses: Course[];
}

export default function Index({ student, batches, courses }: Props) {
    const { data, setData, put, errors } = useForm({
        name: student.name,
        email: student.email,
        batch_id: student.batch_id ?? '',
        course_ids: student.course_ids ?? [],
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        // Example: send update request
        put(`/students/${student.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Dashboard" />

            <div className='m-6'>
                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div className="w-3/12">
                        <Label>Name</Label>
                        <Input
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <div className="text-red-500">{errors.name}</div>}
                    </div>

                    <div className="w-3/12">
                        <Label>Email</Label>
                        <Input
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <div className="text-red-500">{errors.email}</div>}
                    </div>

                    <div className="w-3/12">
                        <Label>Batch</Label>
                        <select
                            className="border border-2 p-2"
                            value={data.batch_id}
                            onChange={(e) => setData('batch_id', e.target.value)}
                        >
                            <option value="">Select The Batch</option>
                            {batches.map((batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                        {errors.batch_id && <div className="text-red-500">{errors.batch_id}</div>}
                    </div>

                    <div className="w-3/12">
                        <Label>Courses</Label>
                        <div className="flex flex-col gap-2 border p-2">
                            {courses.map((course) => (
                                <label key={course.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        value={course.id}
                                        checked={data.course_ids.includes(course.id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setData('course_ids', [...data.course_ids, course.id]);
                                            } else {
                                                setData(
                                                    'course_ids',
                                                    data.course_ids.filter((id) => id !== course.id)
                                                );
                                            }
                                        }}
                                    />
                                    {course.name}
                                </label>
                            ))}
                        </div>
                        {errors.course_ids && (
                            <div className="text-red-500">{errors.course_ids}</div>
                        )}
                    </div>

                    <div className="w-3/12">
                        <Button type="submit">Update Student</Button>
                    </div>
                </form>
            </div>


        </AppLayout>
    );
}
