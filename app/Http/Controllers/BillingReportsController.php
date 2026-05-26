<?php

namespace App\Http\Controllers;

use App\Models\Batch;
use App\Models\Course;
use App\Models\InstallmentSchedule;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingReportsController extends Controller
{
    // ── Entry point ───────────────────────────────────────────────────────────

    public function index(Request $request)
    {
        ['from' => $from, 'to' => $to] = $this->resolvePeriod($request);

        $f = [
            'period'         => $request->get('period', 'monthly'),
            'date_from'      => $request->get('date_from', $from?->format('Y-m-d')),
            'date_to'        => $request->get('date_to',   $to?->format('Y-m-d')),
            'student_id'     => $request->integer('student_id') ?: null,
            'course_id'      => $request->integer('course_id')  ?: null,
            'batch_id'       => $request->integer('batch_id')   ?: null,
            'payment_method' => $request->get('payment_method'),
            'status'         => $request->get('status'),
        ];

        return Inertia::render('billings/reports', [
            'filters'       => $f,
            'periodLabel'   => $this->periodLabel($f['period'], $from, $to),
            'revenue'       => $this->revenueData($from, $to, $f),
            'payments'      => $this->paymentData($from, $to, $f),
            'invoices'      => $this->invoiceData($from, $to, $f),
            'students'      => $this->studentData($from, $to, $f),
            'dueCollection' => $this->dueCollectionData($from, $to, $f),
            'installments'  => $this->installmentData($from, $to),
            'courseBatch'   => $this->courseBatchData($from, $to, $f),
            'options'       => $this->filterOptions(),
        ]);
    }

    // ── CSV Export ────────────────────────────────────────────────────────────

    public function export(Request $request)
    {
        ['from' => $from, 'to' => $to] = $this->resolvePeriod($request);
        $type = $request->get('type', 'revenue');

        $f = [
            'period'         => $request->get('period', 'monthly'),
            'date_from'      => $from?->format('Y-m-d'),
            'date_to'        => $to?->format('Y-m-d'),
            'student_id'     => $request->integer('student_id') ?: null,
            'course_id'      => $request->integer('course_id')  ?: null,
            'batch_id'       => $request->integer('batch_id')   ?: null,
            'payment_method' => $request->get('payment_method'),
            'status'         => $request->get('status'),
        ];

        $filename = "billing_{$type}_{$f['period']}_" . now()->format('Y-m-d') . '.csv';

        return response()->streamDownload(function () use ($type, $from, $to, $f) {
            $fh = fopen('php://output', 'w');
            fwrite($fh, "\xEF\xBB\xBF");
            match ($type) {
                'payments'  => $this->exportPayments($fh, $from, $to, $f),
                'invoices'  => $this->exportInvoices($fh, $from, $to, $f),
                'students'  => $this->exportStudents($fh, $from, $to, $f),
                'due'       => $this->exportDue($fh, $from, $to, $f),
                default     => $this->exportRevenue($fh, $from, $to, $f),
            };
            fclose($fh);
        }, $filename, ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    // ── Period helpers ────────────────────────────────────────────────────────

    private function resolvePeriod(Request $request): array
    {
        $period = $request->get('period', 'monthly');
        return match ($period) {
            'monthly' => ['from' => Carbon::now()->startOfMonth(), 'to' => Carbon::now()->endOfMonth()],
            'yearly'  => ['from' => Carbon::now()->startOfYear(),  'to' => Carbon::now()->endOfYear()],
            'custom'  => [
                'from' => $request->filled('date_from') ? Carbon::parse($request->date_from)->startOfDay() : Carbon::now()->startOfMonth(),
                'to'   => $request->filled('date_to')   ? Carbon::parse($request->date_to)->endOfDay()     : Carbon::now()->endOfDay(),
            ],
            default => ['from' => null, 'to' => null],
        };
    }

    private function periodLabel(string $period, ?Carbon $from, ?Carbon $to): string
    {
        return match ($period) {
            'monthly' => Carbon::now()->format('F Y'),
            'yearly'  => (string) Carbon::now()->year,
            'custom'  => ($from?->format('d M Y') ?? '—') . ' – ' . ($to?->format('d M Y') ?? '—'),
            default   => 'All Time',
        };
    }

    // ── Base filter appliers ──────────────────────────────────────────────────

    private function applyInvoiceFilters($query, ?Carbon $from, ?Carbon $to, array $f)
    {
        return $query
            ->when($from, fn($q) => $q->whereDate('issue_date', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('issue_date', '<=', $to))
            ->when($f['student_id'],     fn($q) => $q->where('student_id', $f['student_id']))
            ->when($f['course_id'],      fn($q) => $q->where('course_id',  $f['course_id']))
            ->when($f['batch_id'],       fn($q) => $q->where('batch_id',   $f['batch_id']))
            ->when($f['status'],         fn($q) => $q->where('status',     $f['status']));
    }

    private function applyPaymentFilters($query, ?Carbon $from, ?Carbon $to, array $f)
    {
        return $query
            ->when($from, fn($q) => $q->whereDate('payment_date', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('payment_date', '<=', $to))
            ->when($f['student_id'],     fn($q) => $q->where('student_id', $f['student_id']))
            ->when($f['payment_method'], fn($q) => $q->where('method',     $f['payment_method']));
    }

    // ── Revenue data ──────────────────────────────────────────────────────────

    private function revenueData(?Carbon $from, ?Carbon $to, array $f): array
    {
        $base = fn() => $this->applyInvoiceFilters(Invoice::query(), $from, $to, $f)
            ->whereNotIn('status', ['draft', 'cancelled']);

        $summary = [
            'totalRevenue'  => (float) $base()->sum('total_amount'),
            'totalPaid'     => (float) $base()->sum('paid_amount'),
            'totalDue'      => (float) $base()->sum('due_amount'),
            'totalDiscount' => (float) $base()->sum('discount_amount'),
            'invoiceCount'  => (int)   $base()->count(),
        ];

        $groupExpr = $f['period'] === 'monthly'
            ? 'DATE(issue_date)'
            : "DATE_FORMAT(issue_date, '%Y-%m')";

        $byPeriod = $base()
            ->selectRaw("{$groupExpr} as period, SUM(total_amount) as total, SUM(paid_amount) as paid, SUM(due_amount) as due, COUNT(*) as count")
            ->groupByRaw($groupExpr)
            ->orderByRaw($groupExpr)
            ->get()
            ->map(fn($r) => ['period' => $r->period, 'total' => (float)$r->total, 'paid' => (float)$r->paid, 'due' => (float)$r->due, 'count' => (int)$r->count])
            ->toArray();

        $byCourse = $base()
            ->selectRaw('course_id, SUM(total_amount) as total, SUM(paid_amount) as paid, SUM(due_amount) as due, COUNT(*) as count')
            ->groupBy('course_id')
            ->orderByDesc('total')
            ->get()
            ->map(fn($r) => ['course' => Course::find($r->course_id)?->name ?? 'General', 'total' => (float)$r->total, 'paid' => (float)$r->paid, 'due' => (float)$r->due, 'count' => (int)$r->count])
            ->toArray();

        $byBatch = $base()
            ->selectRaw('batch_id, SUM(total_amount) as total, SUM(paid_amount) as paid, SUM(due_amount) as due, COUNT(*) as count')
            ->groupBy('batch_id')
            ->orderByDesc('total')
            ->get()
            ->map(fn($r) => ['batch' => Batch::find($r->batch_id)?->name ?? '—', 'total' => (float)$r->total, 'paid' => (float)$r->paid, 'due' => (float)$r->due, 'count' => (int)$r->count])
            ->toArray();

        $byMonth = Invoice::whereNotIn('status', ['draft', 'cancelled'])
            ->where('issue_date', '>=', Carbon::now()->subMonths(11)->startOfMonth())
            ->selectRaw("DATE_FORMAT(issue_date, '%Y-%m') as month, SUM(total_amount) as total, SUM(paid_amount) as paid, COUNT(*) as count")
            ->groupByRaw("DATE_FORMAT(issue_date, '%Y-%m')")
            ->orderByRaw("DATE_FORMAT(issue_date, '%Y-%m')")
            ->get()
            ->map(fn($r) => ['month' => $r->month, 'total' => (float)$r->total, 'paid' => (float)$r->paid, 'count' => (int)$r->count])
            ->toArray();

        return compact('summary', 'byPeriod', 'byCourse', 'byBatch', 'byMonth');
    }

    // ── Payment data ──────────────────────────────────────────────────────────

    private function paymentData(?Carbon $from, ?Carbon $to, array $f): array
    {
        $base = fn() => $this->applyPaymentFilters(Payment::query(), $from, $to, $f);

        $summary = [
            'totalPayments' => (int)   $base()->count(),
            'totalAmount'   => (float) $base()->sum('amount'),
            'verified'      => (float) $base()->where('status', 'verified')->sum('amount'),
            'pending'       => (float) $base()->where('status', 'pending')->sum('amount'),
            'avgPayment'    => (float) ($base()->count() > 0 ? $base()->avg('amount') : 0),
        ];

        $byMethod = $base()
            ->selectRaw('method, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('method')
            ->get()
            ->map(fn($r) => ['method' => $r->method ?? 'Unknown', 'count' => (int)$r->count, 'total' => (float)$r->total])
            ->toArray();

        $byStatus = $base()
            ->selectRaw('status, COUNT(*) as count, SUM(amount) as total')
            ->groupBy('status')
            ->get()
            ->map(fn($r) => ['status' => ucfirst($r->status ?? ''), 'count' => (int)$r->count, 'total' => (float)$r->total])
            ->toArray();

        $dailyCollection = $base()
            ->selectRaw('DATE(payment_date) as date, COUNT(*) as count, SUM(amount) as total')
            ->groupByRaw('DATE(payment_date)')
            ->orderByRaw('DATE(payment_date)')
            ->get()
            ->map(fn($r) => ['date' => $r->date, 'count' => (int)$r->count, 'total' => (float)$r->total])
            ->toArray();

        return compact('summary', 'byMethod', 'byStatus', 'dailyCollection');
    }

    // ── Invoice data ──────────────────────────────────────────────────────────

    private function invoiceData(?Carbon $from, ?Carbon $to, array $f): array
    {
        $base = fn() => $this->applyInvoiceFilters(Invoice::query(), $from, $to, $f);

        $byStatus = $base()
            ->selectRaw('status, COUNT(*) as count, SUM(total_amount) as total, SUM(paid_amount) as paid, SUM(due_amount) as due')
            ->groupBy('status')
            ->get()
            ->map(fn($r) => ['status' => ucfirst($r->status ?? ''), 'count' => (int)$r->count, 'total' => (float)$r->total, 'paid' => (float)$r->paid, 'due' => (float)$r->due])
            ->toArray();

        $now = Carbon::now();
        $agingBuckets = ['0-30' => ['count' => 0, 'amount' => 0.0], '31-60' => ['count' => 0, 'amount' => 0.0], '61-90' => ['count' => 0, 'amount' => 0.0], '90+' => ['count' => 0, 'amount' => 0.0]];

        Invoice::where('due_amount', '>', 0)
            ->whereNotIn('status', ['paid', 'cancelled', 'draft'])
            ->where('due_date', '<', $now)
            ->when($from, fn($q) => $q->whereDate('issue_date', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('issue_date', '<=', $to))
            ->get(['due_date', 'due_amount'])
            ->each(function ($inv) use ($now, &$agingBuckets) {
                $days = (int) $inv->due_date->diffInDays($now);
                $key  = $days <= 30 ? '0-30' : ($days <= 60 ? '31-60' : ($days <= 90 ? '61-90' : '90+'));
                $agingBuckets[$key]['count']++;
                $agingBuckets[$key]['amount'] += (float) $inv->due_amount;
            });

        $aging = collect($agingBuckets)
            ->map(fn($v, $k) => ['bucket' => $k . ' days', 'count' => $v['count'], 'amount' => $v['amount']])
            ->values()
            ->toArray();

        $summary = [
            'total'     => (int)   $base()->count(),
            'paid'      => (int)   $base()->where('status', 'paid')->count(),
            'unpaid'    => (int)   $base()->whereIn('status', ['sent', 'partial'])->count(),
            'overdue'   => (int)   $base()->whereNotIn('status', ['paid', 'cancelled', 'draft'])->where('due_date', '<', $now)->where('due_amount', '>', 0)->count(),
            'cancelled' => (int)   $base()->where('status', 'cancelled')->count(),
            'draft'     => (int)   $base()->where('status', 'draft')->count(),
        ];

        return compact('byStatus', 'aging', 'summary');
    }

    // ── Student data ──────────────────────────────────────────────────────────

    private function studentData(?Carbon $from, ?Carbon $to, array $f): array
    {
        $outstanding = Invoice::with('student')
            ->where('due_amount', '>', 0)
            ->whereNotIn('status', ['paid', 'cancelled', 'draft'])
            ->when($from, fn($q) => $q->whereDate('issue_date', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('issue_date', '<=', $to))
            ->when($f['course_id'], fn($q) => $q->where('course_id', $f['course_id']))
            ->when($f['batch_id'],  fn($q) => $q->where('batch_id',  $f['batch_id']))
            ->selectRaw('student_id, SUM(total_amount) as total, SUM(paid_amount) as paid, SUM(due_amount) as due, COUNT(*) as invoices')
            ->groupBy('student_id')
            ->orderByDesc('due')
            ->limit(20)
            ->get()
            ->map(fn($r) => ['student' => $r->student?->name ?? 'Unknown', 'uid' => $r->student?->student_uid, 'total' => (float)$r->total, 'paid' => (float)$r->paid, 'due' => (float)$r->due, 'invoices' => (int)$r->invoices, 'id' => $r->student_id])
            ->toArray();

        $topPayers = Payment::with('student')
            ->when($from, fn($q) => $q->whereDate('payment_date', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('payment_date', '<=', $to))
            ->where('status', 'verified')
            ->when($f['student_id'], fn($q) => $q->where('student_id', $f['student_id']))
            ->selectRaw('student_id, SUM(amount) as total_paid, COUNT(*) as payments')
            ->groupBy('student_id')
            ->orderByDesc('total_paid')
            ->limit(10)
            ->get()
            ->map(fn($r) => ['student' => $r->student?->name ?? 'Unknown', 'uid' => $r->student?->student_uid, 'totalPaid' => (float)$r->total_paid, 'payments' => (int)$r->payments, 'id' => $r->student_id])
            ->toArray();

        return compact('outstanding', 'topPayers');
    }

    // ── Due & collection data ─────────────────────────────────────────────────

    private function dueCollectionData(?Carbon $from, ?Carbon $to, array $f): array
    {
        $now  = Carbon::now();
        $base = fn() => Invoice::where('due_amount', '>', 0)
            ->whereNotIn('status', ['paid', 'cancelled', 'draft'])
            ->when($from, fn($q) => $q->whereDate('issue_date', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('issue_date', '<=', $to))
            ->when($f['course_id'], fn($q) => $q->where('course_id', $f['course_id']))
            ->when($f['batch_id'],  fn($q) => $q->where('batch_id',  $f['batch_id']));

        $totalBilled = $this->applyInvoiceFilters(Invoice::query(), $from, $to, $f)
            ->whereNotIn('status', ['draft', 'cancelled'])
            ->sum('total_amount');
        $totalPaid = $this->applyInvoiceFilters(Invoice::query(), $from, $to, $f)
            ->whereNotIn('status', ['draft', 'cancelled'])
            ->sum('paid_amount');

        $summary = [
            'totalDue'      => (float) $base()->sum('due_amount'),
            'overdueAmount' => (float) $base()->where('due_date', '<', $now)->sum('due_amount'),
            'overdueCount'  => (int)   $base()->where('due_date', '<', $now)->count(),
            'onTimeCount'   => (int)   $base()->where('due_date', '>=', $now)->count(),
            'recoveryRate'  => $totalBilled > 0 ? round(($totalPaid / $totalBilled) * 100, 1) : 0,
        ];

        $byCourse = $base()
            ->selectRaw('course_id, SUM(due_amount) as due, COUNT(*) as count')
            ->groupBy('course_id')
            ->orderByDesc('due')
            ->get()
            ->map(fn($r) => ['course' => Course::find($r->course_id)?->name ?? 'General', 'due' => (float)$r->due, 'count' => (int)$r->count])
            ->toArray();

        $byBatch = $base()
            ->selectRaw('batch_id, SUM(due_amount) as due, COUNT(*) as count')
            ->groupBy('batch_id')
            ->orderByDesc('due')
            ->get()
            ->map(fn($r) => ['batch' => Batch::find($r->batch_id)?->name ?? '—', 'due' => (float)$r->due, 'count' => (int)$r->count])
            ->toArray();

        return compact('summary', 'byCourse', 'byBatch');
    }

    // ── Installment data ──────────────────────────────────────────────────────

    private function installmentData(?Carbon $from, ?Carbon $to): array
    {
        $now = Carbon::now();

        $upcomingBase = fn() => InstallmentSchedule::with(['installmentPlan.student'])
            ->where('status', '!=', 'paid')
            ->whereBetween('due_date', [$now, $now->copy()->addDays(30)]);

        $missedBase = fn() => InstallmentSchedule::with(['installmentPlan.student'])
            ->where('status', '!=', 'paid')
            ->where('due_date', '<', $now);

        $summary = [
            'upcomingAmount' => (float) $upcomingBase()->sum('amount'),
            'upcomingCount'  => (int)   $upcomingBase()->count(),
            'missedAmount'   => (float) $missedBase()->sum('amount'),
            'missedCount'    => (int)   $missedBase()->count(),
        ];

        $upcoming = $upcomingBase()->orderBy('due_date')->limit(20)->get()
            ->map(fn($s) => ['student' => $s->installmentPlan?->student?->name ?? 'Unknown', 'amount' => (float)$s->amount, 'dueDate' => $s->due_date?->format('Y-m-d'), 'status' => $s->status])
            ->toArray();

        $missed = $missedBase()->orderByDesc('due_date')->limit(20)->get()
            ->map(fn($s) => ['student' => $s->installmentPlan?->student?->name ?? 'Unknown', 'amount' => (float)$s->amount, 'dueDate' => $s->due_date?->format('Y-m-d'), 'daysOverdue' => (int)$s->due_date?->diffInDays($now), 'status' => $s->status])
            ->toArray();

        return compact('summary', 'upcoming', 'missed');
    }

    // ── Course & batch data ───────────────────────────────────────────────────

    private function courseBatchData(?Carbon $from, ?Carbon $to, array $f): array
    {
        $base = fn() => Invoice::whereNotIn('status', ['draft', 'cancelled'])
            ->when($from, fn($q) => $q->whereDate('issue_date', '>=', $from))
            ->when($to,   fn($q) => $q->whereDate('issue_date', '<=', $to));

        $byCourse = $base()
            ->selectRaw('course_id, SUM(total_amount) as revenue, SUM(paid_amount) as paid, SUM(due_amount) as due, SUM(discount_amount) as discount, COUNT(*) as invoices')
            ->groupBy('course_id')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn($r) => ['course' => Course::find($r->course_id)?->name ?? 'General', 'revenue' => (float)$r->revenue, 'paid' => (float)$r->paid, 'due' => (float)$r->due, 'discount' => (float)$r->discount, 'invoices' => (int)$r->invoices])
            ->toArray();

        $byBatch = $base()
            ->selectRaw('batch_id, SUM(total_amount) as revenue, SUM(paid_amount) as paid, SUM(due_amount) as due, COUNT(*) as invoices')
            ->groupBy('batch_id')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn($r) => ['batch' => Batch::find($r->batch_id)?->name ?? '—', 'revenue' => (float)$r->revenue, 'paid' => (float)$r->paid, 'due' => (float)$r->due, 'invoices' => (int)$r->invoices])
            ->toArray();

        return compact('byCourse', 'byBatch');
    }

    // ── Filter dropdown options ───────────────────────────────────────────────

    private function filterOptions(): array
    {
        return [
            'students' => Student::select('id', 'name', 'student_uid')->orderBy('name')->limit(200)->get()
                ->map(fn($s) => ['value' => $s->id, 'label' => $s->name . ($s->student_uid ? " ({$s->student_uid})" : '')])
                ->toArray(),
            'courses' => Course::select('id', 'name')->orderBy('name')->get()
                ->map(fn($c) => ['value' => $c->id, 'label' => $c->name])
                ->toArray(),
            'batches' => Batch::select('id', 'name')->orderBy('name')->limit(100)->get()
                ->map(fn($b) => ['value' => $b->id, 'label' => $b->name])
                ->toArray(),
            'paymentMethods' => Payment::selectRaw('DISTINCT method')->whereNotNull('method')->pluck('method')
                ->map(fn($m) => ['value' => $m, 'label' => ucfirst($m)])
                ->toArray(),
            'statuses' => [
                ['value' => 'paid',      'label' => 'Paid'],
                ['value' => 'sent',      'label' => 'Sent / Unpaid'],
                ['value' => 'partial',   'label' => 'Partial'],
                ['value' => 'cancelled', 'label' => 'Cancelled'],
                ['value' => 'draft',     'label' => 'Draft'],
            ],
        ];
    }

    // ── CSV export helpers ────────────────────────────────────────────────────

    private function exportRevenue($fh, ?Carbon $from, ?Carbon $to, array $f): void
    {
        fputcsv($fh, ['Period', 'Invoices', 'Revenue (BDT)', 'Paid (BDT)', 'Due (BDT)']);
        foreach ($this->revenueData($from, $to, $f)['byPeriod'] as $row) {
            fputcsv($fh, [$row['period'], $row['count'], number_format($row['total'], 2), number_format($row['paid'], 2), number_format($row['due'], 2)]);
        }
    }

    private function exportPayments($fh, ?Carbon $from, ?Carbon $to, array $f): void
    {
        fputcsv($fh, ['Date', 'Payments', 'Total Amount (BDT)']);
        foreach ($this->paymentData($from, $to, $f)['dailyCollection'] as $row) {
            fputcsv($fh, [$row['date'], $row['count'], number_format($row['total'], 2)]);
        }
    }

    private function exportInvoices($fh, ?Carbon $from, ?Carbon $to, array $f): void
    {
        fputcsv($fh, ['Invoice #', 'Student', 'Course', 'Issue Date', 'Due Date', 'Total (BDT)', 'Paid (BDT)', 'Due (BDT)', 'Status']);
        $this->applyInvoiceFilters(Invoice::with(['student', 'course']), $from, $to, $f)
            ->orderBy('issue_date', 'desc')->lazy()
            ->each(function ($inv) use ($fh) {
                fputcsv($fh, [$inv->invoice_number, $inv->student?->name ?? '', $inv->course?->name ?? '', $inv->issue_date?->format('Y-m-d'), $inv->due_date?->format('Y-m-d'), number_format($inv->total_amount, 2), number_format($inv->paid_amount, 2), number_format($inv->due_amount, 2), $inv->status]);
            });
    }

    private function exportStudents($fh, ?Carbon $from, ?Carbon $to, array $f): void
    {
        fputcsv($fh, ['Student', 'UID', 'Invoices', 'Total Billed (BDT)', 'Total Paid (BDT)', 'Total Due (BDT)']);
        foreach ($this->studentData($from, $to, $f)['outstanding'] as $row) {
            fputcsv($fh, [$row['student'], $row['uid'] ?? '', $row['invoices'], number_format($row['total'], 2), number_format($row['paid'], 2), number_format($row['due'], 2)]);
        }
    }

    private function exportDue($fh, ?Carbon $from, ?Carbon $to, array $f): void
    {
        fputcsv($fh, ['Course', 'Invoices', 'Due Amount (BDT)']);
        foreach ($this->dueCollectionData($from, $to, $f)['byCourse'] as $row) {
            fputcsv($fh, [$row['course'], $row['count'], number_format($row['due'], 2)]);
        }
    }
}
