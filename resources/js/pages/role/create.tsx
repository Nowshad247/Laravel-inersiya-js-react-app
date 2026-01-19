import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { BreadcrumbItem, Permission } from '@/types';
import { Head, useForm } from '@inertiajs/react';



const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Role',
        href: dashboard().url,
    },
];
export default function Create({ permissions }: { permissions: Permission[] }) {
    const form = useForm({
        name: " ",
        guard_name: " ",
        permissions: [] as number[],
    });

    const togglePermission = (id: number) => {
        const exists = form.data.permissions.includes(id);

        form.setData("permissions", exists
            ? form.data.permissions.filter((p) => p !== id)
            : [...form.data.permissions, id]
        );
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post("/role/store");
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Role" />

            <div className='m-6 '>
                <form onSubmit={submit} className="space-y-6">

                    {/* Role Name */}
                    <div>
                        <label className="block text-sm font-medium">Role Name</label>
                        <input
                            value={form.data.name}
                            required
                            onChange={(e) => form.setData("name", e.target.value)}
                            className="mt-1 block w-full border rounded p-2"
                        />
                        {form.errors.name && (
                            <p className="text-red-600 text-sm">{form.errors.name}</p>
                        )}
                    </div>

                    {/* Guard Name */}
                    <div>
                        <label className="block text-sm font-medium">Guard Name</label>
                        <input
                            value={form.data.guard_name}
                            required
                            onChange={(e) => form.setData("guard_name", e.target.value)}
                            className="mt-1 block w-full border rounded p-2"
                        />
                        {form.errors.guard_name && (
                            <p className="text-red-600 text-sm">{form.errors.guard_name}</p>
                        )}
                    </div>

                    {/* Permissions Checkboxes */}
                    <div>
                        <label className="block text-sm font-medium">Permissions</label>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            {permissions.map((permission) => (
                                <label key={permission.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={form.data.permissions.includes(permission.id)}
                                        onChange={() => togglePermission(permission.id)}
                                    />
                                    <span>{permission.name}</span>
                                </label>
                            ))}
                        </div>

                        {form.errors.permissions && (
                            <p className="text-red-600 text-sm mt-2">
                                {form.errors.permissions}
                            </p>
                        )}
                    </div>

                    <button className="px-4 py-2 bg-blue-600 text-white rounded">
                        Create Role
                    </button>
                </form>
            </div>
        </AppLayout>
    );
}
