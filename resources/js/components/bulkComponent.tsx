import { useForm } from "@inertiajs/react";
import { Button } from '@/components/ui/button';

export default function BulkComponent() {
    const { data, setData, post, processing, errors } = useForm<{ file: File | null }>({
        file: null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/leads/import');
    }
    return (
        <>
            <div className="w-full max-w-md p-4 border rounded-lg">
                <div className="">
                    <form onSubmit={submit} className="">
                        <div className='mb-4'>
                            <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                Upload File
                            </label>

                            <input className='border-2 border-gray-300 p-2'
                                type="file"
                                accept=".csv"
                                onChange={e => setData('file', e.target.files?.[0] || null)}
                            />
                        </div>
                        {errors.file && <div className="text-red-600">{errors.file}</div>}
                        <Button type="submit">Upload</Button>
                    </form>
                </div>
            </div>

        </>
    );
}
