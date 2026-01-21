export interface Lead {
    name: string;
    email: string | null;
    phone: string | null;
    whatsapp_number: string | null;

    status_id: number;
    source_id: number | null;

    assigned_to: number | null;

    town: string | null;
    address: string | null;

    created_at?: string;
    updated_at?: string;
}
