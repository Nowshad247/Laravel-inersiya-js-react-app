import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PublicAppLayout from '@/layouts/publicAppLayout';
import { Batch } from '@/types/Batch';
import { Course } from '@/types/Course';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SiteSettings {
    site_name?: string;
    site_title?: string;
    site_description?: string;
    site_keywords?: string;
    site_author?: string;
    site_logo?: string | null;
    contact_email?: string;
    address?: string;
    facebook_url?: string;
    twitter_url?: string;
    linkedin_url?: string;
    instagram_url?: string;
}

interface Props {
    batchs: Batch[];
    courses: Course[];
}

export default function AdmissionCreate({ batchs, courses }: Props) {
    const { auth, flash, settings, name } = usePage<{
        auth: { user?: { id?: number } | null };
        flash: { success?: string; admission_id?: number };
        settings: SiteSettings;
        name: string;
    }>().props;
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(
        null,
    );
    const isLoggedIn = !!auth.user;
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
        post('/admission/create', {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        const firstErrorKey = Object.keys(errors)[0];
        if (firstErrorKey) {
            document
                .querySelector(`[name="${firstErrorKey}"]`)
                ?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [errors]);

    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
    }, []);

    useEffect(() => {
        setData('batch_id', null);
    }, [selectedCourseId, setData]);

    useEffect(() => {
        if (selectedCourseId) {
            setData('course_ids', [selectedCourseId]);
        } else {
            setData('course_ids', []);
        }
    }, [selectedCourseId, setData]);

    const siteName: string = settings?.site_name || name;
    const siteTitle: string = settings?.site_title || siteName;
    const siteDescription: string = settings?.site_description || '';
    const siteKeywords: string = settings?.site_keywords || '';
    const siteAuthor: string = settings?.site_author || '';

    return (
        <PublicAppLayout
            title={siteTitle}
            description={siteDescription}
            keywords={siteKeywords}
            author={siteAuthor}
            siteName={siteName}
            siteLogo={settings?.site_logo ?? undefined}
            siteAuthor={siteAuthor}
            contactEmail={settings?.contact_email}
            address={settings?.address}
            facebookUrl={settings?.facebook_url}
            twitterUrl={settings?.twitter_url}
            linkedinUrl={settings?.linkedin_url}
            instagramUrl={settings?.instagram_url}
            forceLightMode
        >
            <Head title="Admission Create" />

            <header className="border-b bg-white text-black">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div className="flex items-center gap-3">
                        {settings?.site_logo ? (
                            <img
                                src={settings.site_logo}
                                alt={`${siteName} logo`}
                                className="h-8 w-auto"
                            />
                        ) : null}
                        <h2 className="text-lg font-semibold">{siteName}</h2>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            href="/admission"
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            Admission
                        </Link>
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="text-sm font-medium text-blue-600 hover:underline"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <div className="m-6 bg-white p-6 text-black">
                {flash?.success && (
                    <div className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-5 py-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <div>
                            <p className="font-semibold text-green-800">
                                {flash.success}
                            </p>
                            {flash.admission_id && (
                                <p className="mt-0.5 text-sm text-green-700">
                                    Your Application ID:{' '}
                                    <span className="font-mono font-bold">
                                        #{flash.admission_id}
                                    </span>{' '}
                                    — Please save this for future reference.
                                </p>
                            )}
                        </div>
                    </div>
                )}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <form onSubmit={submit} className="space-y-5">
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

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label className="my-2">Father Name*</Label>
                                <Input
                                    name="father_name"
                                    value={data.father_name}
                                    onChange={(e) =>
                                        setData('father_name', e.target.value)
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
                                        setData('mother_name', e.target.value)
                                    }
                                />
                                {errors.mother_name && (
                                    <p className="text-sm text-red-500">
                                        {errors.mother_name}
                                    </p>
                                )}
                            </div>
                        </div>

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

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                                    setData('guardian_phone', e.target.value)
                                }
                            />
                            <Input
                                name="guardian_relation"
                                placeholder="Relation"
                                value={data.guardian_relation}
                                onChange={(e) =>
                                    setData('guardian_relation', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <Label className="my-2">Select Course</Label>
                            <select
                                className="w-full rounded border px-3 py-2"
                                value={selectedCourseId?.toString() ?? ''}
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
                                    <option
                                        key={course.id ?? 'null-course'}
                                        value={course.id?.toString() ?? ''}
                                        disabled={course.id === null}
                                    >
                                        {course.name}
                                    </option>
                                ))}
                            </select>
                            {errors.course_ids && (
                                <p className="text-sm text-red-500">
                                    {errors.course_ids}
                                </p>
                            )}
                        </div>

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
                                        <option key={batch.id} value={batch.id}>
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

                        <div>
                            <Label className="my-2">Student Photo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                name="photo"
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
            </div>
        </PublicAppLayout>
    );
}
