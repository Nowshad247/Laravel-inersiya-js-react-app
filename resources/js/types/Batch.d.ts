export interface InstructorDetail {
    name: string | null;
    title: string | null;
    description: string | null;
    phone: string | null;
}

export interface BatchDetail {
    id: number;
    batch_id: number;
    total_classes: number | null;
    price: number | null;
    discount_price: number | null;
    batch_modules: string | null;
    weekdays: string[] | null;
    class_time: string | null;
    delivery_mode: 'online' | 'offline' | null;
    description: string | null;
    opportunity: string | null;
    faq: Array<{ question: string; answer: string }> | null;
    instructor_details: InstructorDetail | null;
    created_at: string;
    updated_at: string;
}

export interface Batch {
    id: number;
    name: string;
    course_id: number;
    batch_code: string;
    start_date: string | null;
    end_date: string | null;
    TotalClass: string | null;
    batch_status: string;
    created_at: string;
    updated_at: string;
    students?: Array;
    detail?: BatchDetail;
}

export interface Course {
    id: number;
    name: string;
}

export interface BatchFormData {
    name: string;
    course_id: number | '';
    batch_code: string | '';
    start_date: string;
    end_date: string;
    batch_status: string;
    TotalClass: number;
    // Batch Details
    total_classes: number;
    price: string;
    discount_price: string;
    batch_modules: string;
    weekdays: string[];
    class_time: string;
    delivery_mode: 'online' | 'offline' | '';
    description: string;
    opportunity: string;
    faq_json: string;
    instructor_details_json: string;
}
