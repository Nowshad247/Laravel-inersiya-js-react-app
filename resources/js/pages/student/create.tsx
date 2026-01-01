import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Batch } from '@/types/Batch'
import { Course } from '@/types/Course'
import { Head, useForm } from '@inertiajs/react'
import { Label } from '@radix-ui/react-dropdown-menu'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Student',
        href: dashboard().url,
    },
]


interface Props {
    batchs: Batch[],
    courses: Course[]
}

export default function Index({ batchs, courses }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        batch_id: '',
        course_ids: [] as number[], // <-- must match backend
    })

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        post('/students/create')
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Add New" />

            <div className="p-6 m-6">
                <form onSubmit={submit} className="space-y-4">

                    {/* Name */}
                    <div className="w-3/12">
                        <Label>Name</Label>
                        <Input
                            type="text"
                            value={data.name}
                            placeholder="Add Student Name"
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="w-3/12">
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={data.email}
                            placeholder="Add Student Email"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && <p className="text-red-500">{errors.email}</p>}
                    </div>

                    {/* Batch Select */}
                    <div className="w-3/12">
                        <Label>Select Batch</Label>
                        <select
                            className="border rounded px-3 py-2 w-full"
                            value={data.batch_id}
                            onChange={(e) => setData('batch_id', e.target.value)}
                        >
                            <option value="">-- Select Batch --</option>
                            {batchs.map((batch: Batch) => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                        {errors.batch_id && <p className="text-red-500">{errors.batch_id}</p>}
                    </div>

                    {/* Courses */}
                    <div className="w-6/12">
                        <Label>Select Courses</Label>
                        <select
                            multiple
                            className="border rounded px-3 py-2 w-full"
                            value={data.course_ids.map(String)} // convert numbers to strings for HTML
                            onChange={(e) => {
                                const selectedOptions = Array.from(e.target.selectedOptions, option =>
                                    Number(option.value)
                                )
                                setData('course_ids', selectedOptions)
                            }}
                        >
                            {courses.map((course) => (
                                <option key={course.id} value={course.id ? course.id : " "}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                        {errors.course_ids && (
                            <p className="text-red-500">{errors.course_ids}</p>
                        )}
                    </div>


                    <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Add Student'}
                    </Button>
                </form>
            </div>
        </AppLayout>
    )
}
