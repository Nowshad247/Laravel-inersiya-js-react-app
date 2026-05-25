<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Payment;
use App\Models\Student;
use App\Models\settings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Inertia\Inertia;

class BillingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        //billing overview dashboard with charts and summaries


        return Inertia::render('billings/index');
    }

    public function invoices()
    {
        $invoices = Invoice::with(['student', 'course'])
            ->orderBy('issue_date', 'desc')
            ->get()
            ->map(function (Invoice $invoice) {
                return [
                    'id' => $invoice->id,
                    'invoiceId' => $invoice->invoice_number,
                    'student' => $invoice->student?->name ?? 'Unknown Student',
                    'course' => $invoice->course?->name ?? 'Unknown Course',
                    'dateIssued' => $invoice->issue_date?->format('Y-m-d') ?? '',
                    'dueDate' => $invoice->due_date?->format('Y-m-d') ?? '',
                    'amount' => '$' . number_format($invoice->total_amount ?? 0, 2),
                    'status' => ucfirst($invoice->status ?? 'pending'),
                ];
            })
            ->toArray();

        return Inertia::render('billings/invoices', [
            'invoices' => $invoices,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('billings/create-invoice');
    }

    /**
     * JSON – Search students by id, uid, name, or phone.
     */
    public function studentSearch(Request $request)
    {
        $q = trim($request->get('q', ''));
        if (mb_strlen($q) < 1) {
            return response()->json([]);
        }

        $query = Student::query();

        if (ctype_digit($q)) {
            $query->where('id', $q)
                  ->orWhere('student_uid', 'like', "%{$q}%")
                  ->orWhere('name', 'like', "%{$q}%")
                  ->orWhere('phone', 'like', "%{$q}%");
        } else {
            $query->where('student_uid', 'like', "%{$q}%")
                  ->orWhere('name', 'like', "%{$q}%")
                  ->orWhere('phone', 'like', "%{$q}%")
                  ->orWhere('email', 'like', "%{$q}%");
        }

        return response()->json(
            $query->limit(8)->get(['id', 'name', 'student_uid', 'phone', 'email'])
        );
    }

    /**
     * JSON – Full student info + all associated batches with pricing.
     */
    public function getStudentInfo(int $id)
    {
        $student = Student::with([
            'batch.course',
            'batch.batchDetail',
            'courses.batch.batchDetail',
        ])->findOrFail($id);

        $batches = collect();

        // Primary batch via batch_id FK
        if ($student->batch) {
            $batches->push($student->batch);
        }

        // Batches reachable through enrolled courses
        foreach ($student->courses as $course) {
            foreach ($course->batch as $batch) {
                if (!$batches->contains('id', $batch->id)) {
                    $batch->load('batchDetail');
                    $batches->push($batch);
                }
            }
        }

        return response()->json([
            'id'               => $student->id,
            'name'             => $student->name,
            'student_uid'      => $student->student_uid,
            'status'           => $student->status,
            'phone'            => $student->phone,
            'email'            => $student->email,
            'address'          => $student->address,
            'father_name'      => $student->father_name,
            'mother_name'      => $student->mother_name,
            'guardian_name'    => $student->guardian_name,
            'guardian_phone'   => $student->guardian_phone,
            'guardian_relation'=> $student->guardian_relation,
            'batches'       => $batches->map(fn($b) => [
                'id'             => $b->id,
                'name'           => $b->name,
                'batch_code'     => $b->batch_code,
                'course_name'    => $b->course?->name,
                'course_code'    => $b->course?->course_code,
                'start_date'     => $b->start_date,
                'end_date'       => $b->end_date,
                'total_class'    => $b->TotalClass,
                'batch_status'   => $b->batch_status,
                'price'          => $b->batchDetail?->price,
                'discount_price' => $b->batchDetail?->discount_price,
                'class_time'     => $b->batchDetail?->class_time,
                'weekdays'       => $b->batchDetail?->weekdays,
                'delivery_mode'  => $b->batchDetail?->delivery_mode,
            ])->values(),
        ]);
    }

    public function store(Request $request)
    {
        $action = $request->input('action', 'create');

        $base = [
            'action'       => 'required|in:draft,create,collect',
            'student_id'   => 'required|integer|exists:students,id',
            'invoice_date' => 'required|date',
        ];

        $full = [
            'due_date'               => 'required|date|after_or_equal:invoice_date',
            'fee_items'              => 'required|array|min:1',
            'fee_items.*.fee_type'   => 'required|string|max:100',
            'fee_items.*.quantity'   => 'required|integer|min:1',
            'fee_items.*.unit_price' => 'required|numeric|min:0',
            'payment_status'         => 'required|in:unpaid,partial,paid',
            'discount_type'          => 'nullable|in:fixed,percentage',
            'discount_value'         => 'nullable|numeric|min:0',
            'tax_percentage'         => 'nullable|numeric|min:0|max:100',
            'vat_percentage'         => 'nullable|numeric|min:0|max:100',
            'service_charge'         => 'nullable|numeric|min:0',
            'late_fee'               => 'nullable|numeric|min:0',
            'other_charges'          => 'nullable|numeric|min:0',
            'paid_amount'            => 'nullable|numeric|min:0',
        ];

        $collectOnly = [
            'paid_amount'    => 'required|numeric|min:0.01',
            'payment_method' => 'required|string|max:50',
        ];

        $rules = $base;
        if ($action !== 'draft') $rules = array_merge($rules, $full);
        if ($action === 'collect') $rules = array_merge($rules, $collectOnly);

        $request->validate($rules, [
            'student_id.required'            => 'Please select a student.',
            'student_id.exists'              => 'The selected student does not exist.',
            'fee_items.required'             => 'Please add at least one fee item.',
            'fee_items.min'                  => 'Please add at least one fee item.',
            'fee_items.*.fee_type.required'  => 'Fee type is required for all items.',
            'fee_items.*.quantity.required'  => 'Quantity is required for all items.',
            'fee_items.*.unit_price.required'=> 'Unit price is required for all items.',
            'paid_amount.required'           => 'Paid amount is required when collecting payment.',
            'payment_method.required'        => 'Please select a payment method.',
        ]);

        $feeItems = $request->input('fee_items', []);

        $subtotal = collect($feeItems)->sum(
            fn($i) => max(1, (int)($i['quantity'] ?? 1)) * max(0, (float)($i['unit_price'] ?? 0))
        );

        $discountType  = $request->input('discount_type', 'fixed');
        $discountValue = max(0, (float)$request->input('discount_value', 0));
        $discountAmt   = $discountType === 'percentage'
            ? round($subtotal * $discountValue / 100, 2)
            : round(min($discountValue, $subtotal), 2);

        $afterDiscount = max(0, $subtotal - $discountAmt);
        $taxAmt        = round($afterDiscount * (float)$request->input('tax_percentage', 0) / 100, 2);
        $vatAmt        = round($afterDiscount * (float)$request->input('vat_percentage', 0) / 100, 2);
        $extras        = (float)$request->input('service_charge', 0)
                       + (float)$request->input('late_fee', 0)
                       + (float)$request->input('other_charges', 0);
        $grandTotal    = round($afterDiscount + $taxAmt + $vatAmt + $extras, 2);

        $paidAmount = $action === 'draft'
            ? 0.0
            : min(max(0, (float)$request->input('paid_amount', 0)), $grandTotal);
        $dueAmount  = max(0, $grandTotal - $paidAmount);

        if ($action === 'draft') {
            $dbStatus = 'draft';
        } elseif ($paidAmount >= $grandTotal && $grandTotal > 0) {
            $dbStatus = 'paid';
        } elseif ($request->input('invoice_status') === 'cancelled') {
            $dbStatus = 'cancelled';
        } else {
            $dbStatus = 'sent';
        }

        $invoice = DB::transaction(function () use (
            $request, $action, $feeItems,
            $subtotal, $discountAmt, $taxAmt, $vatAmt, $extras,
            $grandTotal, $paidAmount, $dueAmount, $dbStatus
        ) {
            $inv = Invoice::create([
                'invoice_number'  => 'TMP',
                'student_id'      => $request->integer('student_id'),
                'status'          => $dbStatus,
                'issue_date'      => $request->input('invoice_date'),
                'due_date'        => $request->input('due_date'),
                'sub_total'       => $subtotal,
                'discount_amount' => $discountAmt,
                'tax_amount'      => round($taxAmt + $vatAmt, 2),
                'total_amount'    => $grandTotal,
                'paid_amount'     => $paidAmount,
                'due_amount'      => $dueAmount,
                'notes'           => $request->input('notes'),
                'meta'            => [
                    'invoice_status'     => $request->input('invoice_status'),
                    'discount_type'      => $request->input('discount_type', 'fixed'),
                    'discount_value'     => $request->input('discount_value', 0),
                    'tax_type'           => $request->input('tax_type', 'none'),
                    'tax_percentage'     => $request->input('tax_percentage', 0),
                    'vat_percentage'     => $request->input('vat_percentage', 0),
                    'tax_amount'         => $taxAmt,
                    'vat_amount'         => $vatAmt,
                    'service_charge'     => $request->input('service_charge', 0),
                    'late_fee'           => $request->input('late_fee', 0),
                    'other_charges'      => $request->input('other_charges', 0),
                    'payment_method'     => $request->input('payment_method'),
                    'payment_status'     => $request->input('payment_status', 'unpaid'),
                    'scholarship'        => $request->input('scholarship'),
                    'coupon_code'        => $request->input('coupon_code'),
                    'discount_reason'    => $request->input('discount_reason'),
                    'batch_ids'          => $request->input('batch_ids', []),
                    'installment_enabled'=> (bool)$request->input('installment_enabled', false),
                    'num_installments'   => $request->input('num_installments'),
                    'first_payment_date' => $request->input('first_payment_date'),
                    'send_email'         => (bool)$request->input('send_email', false),
                    'send_sms'           => (bool)$request->input('send_sms', false),
                    'generate_receipt'   => (bool)$request->input('generate_receipt', false),
                ],
            ]);

            $inv->invoice_number = sprintf('INV-%05d-%d', $inv->id, $inv->student_id);
            $inv->save();

            foreach ($feeItems as $item) {
                $qty   = max(1, (int)($item['quantity'] ?? 1));
                $price = max(0, (float)($item['unit_price'] ?? 0));
                InvoiceItem::create([
                    'invoice_id'  => $inv->id,
                    'fee_type'    => $item['fee_type'] ?? 'Other',
                    'description' => $item['description'] ?? null,
                    'quantity'    => $qty,
                    'unit_price'  => $price,
                    'total'       => round($qty * $price, 2),
                    'meta'        => isset($item['batchId']) ? ['batch_id' => $item['batchId']] : null,
                ]);
            }

            if ($paidAmount > 0 && $action !== 'draft') {
                Payment::create([
                    'invoice_id'     => $inv->id,
                    'student_id'     => $inv->student_id,
                    'amount'         => $paidAmount,
                    'method'         => $request->input('payment_method'),
                    'status'         => 'verified',
                    'transaction_id' => $request->input('transaction_id'),
                    'payment_date'   => $request->filled('payment_date')
                        ? Carbon::parse($request->input('payment_date'))
                        : now(),
                    'note'           => $request->input('notes'),
                ]);
            }

            return $inv;
        });

        $msg = $action === 'draft' ? 'Draft saved successfully.' : 'Invoice created successfully.';

        return redirect()->route('billings.invoice.preview', $invoice->id)
            ->with('success', $msg);
    }

    public function preview(int $id)
    {
        $invoice = Invoice::with(['student', 'items', 'payments'])->findOrFail($id);
        $site    = settings::pluck('value', 'key');

        return Inertia::render('billings/invoice-preview', [
            'invoice' => [
                'id'              => $invoice->id,
                'invoice_number'  => $invoice->invoice_number,
                'status'          => $invoice->status,
                'issue_date'      => $invoice->issue_date?->format('d M Y'),
                'due_date'        => $invoice->due_date?->format('d M Y'),
                'sub_total'       => (float) $invoice->sub_total,
                'discount_amount' => (float) $invoice->discount_amount,
                'tax_amount'      => (float) $invoice->tax_amount,
                'total_amount'    => (float) $invoice->total_amount,
                'paid_amount'     => (float) $invoice->paid_amount,
                'due_amount'      => (float) $invoice->due_amount,
                'notes'           => $invoice->notes,
                'meta'            => $invoice->meta ?? [],
            ],
            'student' => [
                'id'            => $invoice->student->id,
                'name'          => $invoice->student->name,
                'student_uid'   => $invoice->student->student_uid,
                'phone'         => $invoice->student->phone,
                'email'         => $invoice->student->email,
                'address'       => $invoice->student->address,
                'guardian_name' => $invoice->student->guardian_name,
            ],
            'items' => $invoice->items->map(fn($item) => [
                'id'          => $item->id,
                'fee_type'    => $item->fee_type,
                'description' => $item->description,
                'quantity'    => $item->quantity,
                'unit_price'  => (float) $item->unit_price,
                'total'       => (float) $item->total,
            ]),
            'payments' => $invoice->payments->map(fn($p) => [
                'id'             => $p->id,
                'amount'         => (float) $p->amount,
                'method'         => $p->method,
                'status'         => $p->status,
                'transaction_id' => $p->transaction_id,
                'payment_date'   => $p->payment_date?->format('d M Y H:i'),
            ]),
            'site' => [
                'name'    => $site->get('site_name', config('app.name')),
                'logo'    => $site->get('site_logo'),
                'email'   => $site->get('contact_email'),
                'phone'   => $site->get('contact_phone'),
                'address' => $site->get('address'),
            ],
            'generatedBy' => Auth::user()?->name ?? 'System',
        ]);
    }

    public function downloadPdf(int $id)
    {
        $invoice = Invoice::with(['student', 'items', 'payments'])->findOrFail($id);
        $site    = settings::pluck('value', 'key');

        // Convert logo to base64 so DomPDF can embed it without HTTP requests
        $logoBase64 = null;
        $logoUrl    = $site->get('site_logo');
        if ($logoUrl) {
            $logoPath = public_path(parse_url($logoUrl, PHP_URL_PATH));
            if (file_exists($logoPath)) {
                $mime       = mime_content_type($logoPath);
                $logoBase64 = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($logoPath));
            }
        }

        $pdf = Pdf::loadView('pdf.invoice', [
            'invoice'     => $invoice,
            'student'     => $invoice->student,
            'items'       => $invoice->items,
            'payments'    => $invoice->payments,
            'siteName'    => $site->get('site_name', config('app.name')),
            'siteEmail'   => $site->get('contact_email'),
            'sitePhone'   => $site->get('contact_phone'),
            'siteAddress' => $site->get('address'),
            'logoBase64'  => $logoBase64,
            'generatedBy' => Auth::user()?->name ?? 'System',
        ])->setPaper('a4', 'portrait');

        return response()->streamDownload(
            fn() => print($pdf->output()),
            $invoice->invoice_number . '.pdf',
            ['Content-Type' => 'application/pdf']
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
