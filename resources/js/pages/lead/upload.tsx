
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Upload Dashboard',
        href: dashboard().url,
    },
];
export default function upload() {
    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/leads/import');
    }
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Upload Dashboard" />
            <div className='m-6'>
                <h1 className='text-2xl font-bold'>Upload Dashboard</h1>
                <p className='mt-4'>Lead part will update soon</p>
                <form onSubmit={submit} className="mt-6">
                    <div className='m-6 '>
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                            Upload File
                        </label>
                        <input className='border-2 border-gray-300 p-4 m-2 '
                            type="file"
                            accept=".csv"
                            onChange={e => setData('file', e.target.files?.[0] || null)}
                        />
                    </div>
                    {errors.file && <div className="text-red-600">{errors.file}</div>}
                    <Button type="submit">Upload</Button>
                </form>
            </div>
        </AppLayout>
    );
}
