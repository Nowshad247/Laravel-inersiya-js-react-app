import { Button } from '@/components/ui/button';
import { PdfButton } from '@/components/ui/pdfbtn';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Students Profile',
        href: dashboard().url,
    },
];

function formatCurrency(value: number) {
    return `৳${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface BillingSummary {
    totalBilled: number;
    totalPaid: number;
    totalDue: number;
    invoiceCount: number;
}

interface InvoiceRecord {
    id: number;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    course: string;
    total_amount: number;
    paid_amount: number;
    due_amount: number;
    status: string;
}

interface PaymentRecord {
    id: number;
    invoice_number: string;
    amount: number;
    method: string;
    status: string;
    payment_date: string;
    transaction_id: string;
    note: string;
}

interface CourseRecord {
    id: number;
    name: string;
    course_code?: string | null;
}

interface StudentRecord {
    id: number;
    name: string;
    student_uid?: string | null;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    status?: string | null;
    guardian_name?: string | null;
    batch?: {
        id: number;
        name: string;
        batch_code?: string | null;
        course?: { name?: string | null } | null;
    } | null;
    courses?: CourseRecord[];
}

export default function Index({
    studentData,
    billing,
}: {
    studentData: StudentRecord;
    billing: {
        summary: BillingSummary;
        invoices: InvoiceRecord[];
        payments: PaymentRecord[];
        latest_invoice_id: number | null;
    };
}) {
    const id = studentData.id;
    const enrolledCourses = studentData.courses ?? [];
    const latestInvoiceId = billing.latest_invoice_id;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Student Profile" />
            <div className="space-y-6 rounded bg-white p-6 shadow">
                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => router.get(`/student/edit/${id}`)}
                    >
                        Edit Profile
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => router.get(`/billings/student/${id}`)}
                    >
                        Student Billing
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() =>
                            latestInvoiceId
                                ? router.get(
                                      `/billings/invoice/${latestInvoiceId}/preview`,
                                  )
                                : undefined
                        }
                        disabled={!latestInvoiceId}
                    >
                        Invoice Preview
                    </Button>
                    <PdfButton
                        href={`/student/pdf/${id}`}
                        label="Download Student Profile"
                    />
                </div>

                <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                    <article className="rounded-xl border border-slate-200 p-5">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Student Details
                        </h2>
                        <dl className="mt-4 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                            <div>
                                <dt className="text-slate-500">Name</dt>
                                <dd className="font-medium">
                                    {studentData.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">UID</dt>
                                <dd className="font-medium">
                                    {studentData.student_uid ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Email</dt>
                                <dd className="font-medium">
                                    {studentData.email ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Phone</dt>
                                <dd className="font-medium">
                                    {studentData.phone ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Address</dt>
                                <dd className="font-medium">
                                    {studentData.address ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Status</dt>
                                <dd className="font-medium capitalize">
                                    {studentData.status ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Batch</dt>
                                <dd className="font-medium">
                                    {studentData.batch?.name ?? '—'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500">Guardian</dt>
                                <dd className="font-medium">
                                    {studentData.guardian_name ?? '—'}
                                </dd>
                            </div>
                        </dl>
                    </article>

                    <article className="rounded-xl border border-slate-200 p-5">
                        <h2 className="text-xl font-semibold text-slate-900">
                            Enrolled Course
                        </h2>
                        {enrolledCourses.length > 0 ? (
                            <ul className="mt-4 space-y-2 text-sm text-slate-700">
                                {enrolledCourses.map((course: CourseRecord) => (
                                    <li
                                        key={course.id}
                                        className="rounded-lg border border-slate-100 bg-slate-50 p-3"
                                    >
                                        <div className="font-medium">
                                            {course.name}
                                        </div>
                                        <div className="text-slate-500">
                                            Code: {course.course_code ?? '—'}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-4 text-sm text-slate-500">
                                No enrolled courses found.
                            </p>
                        )}
                    </article>
                </section>

                <section className="rounded-xl border border-slate-200 p-5">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Billing Summary
                    </h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs tracking-wide text-slate-500 uppercase">
                                Total Billed
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                {formatCurrency(billing.summary.totalBilled)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs tracking-wide text-slate-500 uppercase">
                                Total Paid
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-emerald-600">
                                {formatCurrency(billing.summary.totalPaid)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs tracking-wide text-slate-500 uppercase">
                                Total Due
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-rose-600">
                                {formatCurrency(billing.summary.totalDue)}
                            </p>
                        </div>
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <p className="text-xs tracking-wide text-slate-500 uppercase">
                                Invoices
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-slate-900">
                                {billing.summary.invoiceCount}
                            </p>
                        </div>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 p-5">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Payment Info
                    </h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-slate-500">
                                    <th className="pr-4 pb-3">Invoice</th>
                                    <th className="pr-4 pb-3">Date</th>
                                    <th className="pr-4 pb-3">Amount</th>
                                    <th className="pr-4 pb-3">Method</th>
                                    <th className="pr-4 pb-3">Status</th>
                                    <th className="pr-4 pb-3">Transaction</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billing.payments.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="py-6 text-center text-slate-400"
                                        >
                                            No payment records found.
                                        </td>
                                    </tr>
                                ) : (
                                    billing.payments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="border-b border-slate-50"
                                        >
                                            <td className="py-3 pr-4 font-medium text-slate-700">
                                                {payment.invoice_number}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-500">
                                                {payment.payment_date || '—'}
                                            </td>
                                            <td className="py-3 pr-4 font-semibold text-emerald-600">
                                                {formatCurrency(payment.amount)}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700 capitalize">
                                                {payment.method}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700">
                                                {payment.status}
                                            </td>
                                            <td className="py-3 pr-4 font-mono text-xs text-slate-500">
                                                {payment.transaction_id}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 p-5">
                    <h2 className="text-xl font-semibold text-slate-900">
                        Invoice Table
                    </h2>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-100 text-left text-slate-500">
                                    <th className="pr-4 pb-3">Invoice #</th>
                                    <th className="pr-4 pb-3">Course</th>
                                    <th className="pr-4 pb-3">Issue Date</th>
                                    <th className="pr-4 pb-3">Due Date</th>
                                    <th className="pr-4 pb-3">Total</th>
                                    <th className="pr-4 pb-3">Paid</th>
                                    <th className="pr-4 pb-3">Due</th>
                                    <th className="pr-4 pb-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {billing.invoices.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="py-6 text-center text-slate-400"
                                        >
                                            No invoices found.
                                        </td>
                                    </tr>
                                ) : (
                                    billing.invoices.map((invoice) => (
                                        <tr
                                            key={invoice.id}
                                            className="border-b border-slate-50"
                                        >
                                            <td className="py-3 pr-4 font-medium text-slate-700">
                                                {invoice.invoice_number}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700">
                                                {invoice.course}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-500">
                                                {invoice.issue_date || '—'}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-500">
                                                {invoice.due_date || '—'}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700">
                                                {formatCurrency(
                                                    invoice.total_amount,
                                                )}
                                            </td>
                                            <td className="py-3 pr-4 text-emerald-600">
                                                {formatCurrency(
                                                    invoice.paid_amount,
                                                )}
                                            </td>
                                            <td className="py-3 pr-4 text-rose-600">
                                                {formatCurrency(
                                                    invoice.due_amount,
                                                )}
                                            </td>
                                            <td className="py-3 pr-4 text-slate-700">
                                                {invoice.status}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
