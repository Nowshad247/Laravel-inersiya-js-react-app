import { DataTable } from "@/components/DataTable/DataTable";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import { User } from "@/types";
import { Head, router } from "@inertiajs/react";
import { columns } from "./DataTabe/colums";

export default function Index({ users }: { users: User[] }) {

    return (
        <AppLayout>
            <Head title="Website Users" />
            <div className='w-[100%] flex items-center justify-between'>
                <Button onClick={() => router.get('/users/create')} className='w-3/12 my-6 mx-6'>Add New User</Button>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
                <DataTable columns={columns} data={users} searchKey="name">
                </DataTable>
            </div>

        </AppLayout>
    );
}