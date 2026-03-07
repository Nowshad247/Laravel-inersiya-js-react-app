import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { Head } from "@inertiajs/react";

export default function Create({ roles = [] }: { roles: Array<{ id: number; name: string }> }) {
    return (
        <AppLayout>
            <Head title="Website Users" />
            <div className='w-[100%] flex items-center justify-between'>
                <h1 className="text-2xl font-bold my-6 mx-6">Add New User</h1>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md w-1/2 m-6 gap-3 flex flex-col">
                <form action="" method="post" className="flex flex-col gap-6 border p-6 rounded-md">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <input type="text" name="name" id="name" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <input type="email" name="email" id="email" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <input type="password" name="password" id="password" className="w-full border rounded-md p-2" />
                    </div>
                    <div>
                        <Label htmlFor="role">Role</Label>
                        <select name="role" id="role" className="w-full border rounded-md p-2">
                            <option value="">-- Select Role --</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id.toString()}>
                                    {role.name}
                                </option>
                            ))} 
                        </select>
                    </div>
                    <Button type="submit" className="mt-4 text-white px-4 py-2 rounded-md">Create User</Button>
                </form>    
            </div>
           

        </AppLayout>
    );
}