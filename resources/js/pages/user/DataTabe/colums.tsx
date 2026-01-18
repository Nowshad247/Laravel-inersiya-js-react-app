import { ColumnDef } from "@tanstack/react-table"
import { router } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 ,Eye} from "lucide-react"
import { User } from "@/types"

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "name",
        header: "User Name",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "roles.0.name",
        header: "Roles",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const student = row.original

            return (
                <div className="flex gap-2">                  
                    <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => {
                            if (confirm("Are you sure you want to delete this student?")) {
                                router.delete(`/`)
                            }
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        },
    },
]
