<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 12px;
            color: #1e293b;
            background: #fff;
        }

        .wrap {
            padding: 32px;
        }

        .hdr {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .co-name {
            font-size: 20px;
            font-weight: bold;
            color: #0f172a;
        }

        .inv-label {
            font-size: 26px;
            font-weight: bold;
            color: #0f172a;
            text-align: right;
        }

        .inv-meta {
            font-size: 11px;
            color: #64748b;
            text-align: right;
            line-height: 1.8;
        }

        .badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .b-draft {
            background: #e2e8f0;
            color: #475569;
        }

        .b-sent {
            background: #dbeafe;
            color: #1d4ed8;
        }

        .b-paid {
            background: #dcfce7;
            color: #166534;
        }

        .b-cancelled {
            background: #fee2e2;
            color: #991b1b;
        }

        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 16px 0;
        }

        .info-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            padding: 12px;
        }

        .info-lbl {
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #94a3b8;
            margin-bottom: 6px;
        }

        .info-name {
            font-size: 14px;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 3px;
        }

        .info-val {
            font-size: 11px;
            color: #475569;
            line-height: 1.7;
        }

        .tbl {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 16px;
        }

        .tbl th {
            background: #0f172a;
            color: #fff;
            padding: 9px 12px;
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
            text-align: left;
        }

        .tbl th.r {
            text-align: right;
        }

        .tbl td {
            padding: 9px 12px;
            border-bottom: 1px solid #f1f5f9;
            vertical-align: top;
            font-size: 12px;
        }

        .tbl tr:nth-child(even) td {
            background: #f8fafc;
        }

        .tbl td.r {
            text-align: right;
        }

        .ft {
            font-weight: 600;
            color: #0f172a;
        }

        .fd {
            font-size: 10px;
            color: #94a3b8;
            margin-top: 2px;
        }

        .sum-tbl {
            width: 100%;
            border-collapse: collapse;
        }

        .sum-tbl td {
            padding: 5px 12px;
            font-size: 12px;
        }

        .sum-row td:first-child {
            color: #64748b;
        }

        .sum-row td:last-child {
            text-align: right;
            font-weight: 500;
        }

        .sum-tot {
            border-top: 2px solid #0f172a;
        }

        .sum-tot td {
            padding: 10px 12px;
            font-size: 14px;
            font-weight: bold;
        }

        .sum-tot td:last-child {
            text-align: right;
        }

        .sum-due td {
            background: #fef2f2;
            color: #dc2626;
            font-weight: bold;
            padding: 10px 12px;
            font-size: 13px;
        }

        .sum-due td:last-child {
            text-align: right;
        }

        .pay-box {
            background: #f0fdf4;
            border: 1px solid #86efac;
            padding: 12px;
            margin-bottom: 16px;
        }

        .note-box {
            background: #fafafa;
            border: 1px solid #e2e8f0;
            padding: 12px;
        }

        .footer {
            margin-top: 28px;
            text-align: center;
            font-size: 10px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 12px;
        }

        .terms-box {
            background: #fffbeb;
            border: 1px solid #fde68a;
            padding: 12px;
            margin-bottom: 16px;
        }

        .terms-box ul {
            margin: 0;
            padding-left: 16px;
        }

        .terms-box li {
            font-size: 10.5px;
            color: #475569;
            line-height: 1.7;
        }

        .terms-box a {
            color: #1d4ed8;
            text-decoration: none;
        }
    </style>
</head>

<body>
    <div class="wrap">

        <!-- Header -->
        <table class="hdr">
            <tr>
                <td width="55%" style="vertical-align:top;">
                    @if (!empty($logoBase64))
                        <img src="{{ $logoBase64 }}"
                            style="max-height:54px;max-width:160px;margin-bottom:6px;display:block;" alt="Logo">
                    @endif
                    <div class="co-name">{{ $siteName }}</div>
                    @if (!empty($siteAddress))
                        <div style="font-size:11px;color:#64748b;margin-top:3px;">{{ $siteAddress }}</div>
                    @endif
                    @if (!empty($sitePhone))
                        <div style="font-size:11px;color:#64748b;">{{ $sitePhone }}</div>
                    @endif
                    @if (!empty($siteEmail))
                        <div style="font-size:11px;color:#64748b;">{{ $siteEmail }}</div>
                    @endif
                </td>
                <td width="45%" style="text-align:right;vertical-align:top;">
                    <div class="inv-label">INVOICE</div>
                    <div class="inv-meta">
                        {{ $invoice->invoice_number }}<br>
                        Date: {{ $invoice->issue_date?->format('d M Y') }}<br>
                        Due: {{ $invoice->due_date?->format('d M Y') }}<br>
                        <span class="badge b-{{ $invoice->status }}">{{ ucfirst($invoice->status) }}</span>
                    </div>
                </td>
            </tr>
        </table>

        <hr class="divider">

        <!-- Bill To + Summary -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr>
                <td width="48%" style="vertical-align:top;">
                    <div class="info-box">
                        <div class="info-lbl">Bill To</div>
                        <div class="info-name">{{ $student->name }}</div>
                        @if ($student->student_uid)
                            <div class="info-val">UID: {{ $student->student_uid }}</div>
                        @endif
                        @if ($student->phone)
                            <div class="info-val">{{ $student->phone }}</div>
                        @endif
                        @if ($student->email)
                            <div class="info-val">{{ $student->email }}</div>
                        @endif
                        @if ($student->address)
                            <div class="info-val" style="color:#94a3b8;">{{ $student->address }}</div>
                        @endif
                    </div>
                </td>
                <td width="4%"></td>
                <td width="48%" style="vertical-align:top;">
                    <div class="info-box">
                        <div class="info-lbl">Payment Details</div>
                        <table style="width:100%;font-size:11px;">
                            <tr>
                                <td style="color:#64748b;padding:2px 0;">Status:</td>
                                <td style="text-align:right;font-weight:600;text-transform:capitalize;">
                                    {{ $invoice->meta['payment_status'] ?? 'unpaid' }}</td>
                            </tr>
                            <tr>
                                <td style="color:#64748b;padding:2px 0;">Method:</td>
                                <td style="text-align:right;text-transform:capitalize;">
                                    {{ $invoice->meta['payment_method'] ?? '—' }}</td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <hr style="border:none;border-top:1px solid #e2e8f0;margin:6px 0;">
                                </td>
                            </tr>
                            <tr>
                                <td style="color:#64748b;padding:2px 0;">Grand Total:</td>
                                <td style="text-align:right;font-weight:bold;">
                                    TK{{ number_format($invoice->total_amount, 2) }}</td>
                            </tr>
                            <tr>
                                <td style="color:#16a34a;padding:2px 0;">Paid:</td>
                                <td style="text-align:right;color:#16a34a;font-weight:600;">
                                    TK{{ number_format($invoice->paid_amount, 2) }}</td>
                            </tr>
                            <tr>
                                <td style="color:#dc2626;font-weight:bold;padding:2px 0;">Due:</td>
                                <td style="text-align:right;color:#dc2626;font-weight:bold;">
                                    TK{{ number_format($invoice->due_amount, 2) }}</td>
                            </tr>
                        </table>
                    </div>
                </td>
            </tr>
        </table>

        <!-- Items -->
        <table class="tbl">
            <thead>
                <tr>
                    <th width="4%">#</th>
                    <th width="22%">Fee Type</th>
                    <th width="34%">Description</th>
                    <th width="10%" class="r">Qty</th>
                    <th width="15%" class="r">Unit Price</th>
                    <th width="15%" class="r">Amount</th>
                </tr>
            </thead>
            <tbody>
                @foreach ($items as $i => $item)
                    <tr>
                        <td>{{ $i + 1 }}</td>
                        <td>
                            <div class="ft">{{ $item->fee_type }}</div>
                        </td>
                        <td>
                            <div class="fd">{{ $item->description }}</div>
                        </td>
                        <td class="r">{{ $item->quantity }}</td>
                        <td class="r">TK{{ number_format($item->unit_price, 2) }}</td>
                        <td class="r">TK{{ number_format($item->total, 2) }}</td>
                    </tr>
                @endforeach
            </tbody>
        </table>

        <!-- Summary right-aligned -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr>
                <td width="55%"></td>
                <td width="45%">
                    <table class="sum-tbl">
                        <tr class="sum-row">
                            <td>Subtotal</td>
                            <td style="text-align:right;">TK{{ number_format($invoice->sub_total, 2) }}</td>
                        </tr>
                        @if ($invoice->discount_amount > 0)
                            <tr class="sum-row">
                                <td>Discount</td>
                                <td style="text-align:right;color:#16a34a;">
                                    −TK{{ number_format($invoice->discount_amount, 2) }}</td>
                            </tr>
                        @endif
                        @if ($invoice->tax_amount > 0)
                            <tr class="sum-row">
                                <td>Tax & Charges</td>
                                <td style="text-align:right;">TK{{ number_format($invoice->tax_amount, 2) }}</td>
                            </tr>
                        @endif
                        <tr class="sum-tot">
                            <td>Grand Total</td>
                            <td style="text-align:right;">TK{{ number_format($invoice->total_amount, 2) }}</td>
                        </tr>
                        <tr class="sum-row">
                            <td style="color:#16a34a;">Paid</td>
                            <td style="text-align:right;color:#16a34a;font-weight:600;">
                                TK{{ number_format($invoice->paid_amount, 2) }}</td>
                        </tr>
                        <tr class="sum-due">
                            <td>Due Amount</td>
                            <td style="text-align:right;">TK{{ number_format($invoice->due_amount, 2) }}</td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>

        @if ($payments->count() > 0)
            <div class="pay-box" style="margin-bottom:16px;">
                <div class="info-lbl" style="margin-bottom:8px;">Payment Records</div>
                @foreach ($payments as $p)
                    <div style="font-size:12px;margin-bottom:3px;">
                        <strong>TK{{ number_format($p->amount, 2) }}</strong>
                        via {{ ucfirst($p->method ?? 'N/A') }}
                        @if ($p->transaction_id)
                            · TXN: {{ $p->transaction_id }}
                        @endif
                        @if ($p->payment_date)
                            · {{ $p->payment_date->format('d M Y') }}
                        @endif
                    </div>
                @endforeach
            </div>
        @endif

        @if ($invoice->notes)
            <div class="note-box" style="margin-bottom:16px;">
                <div class="info-lbl" style="margin-bottom:6px;">Notes</div>
                <div style="font-size:12px;color:#475569;">{{ $invoice->notes }}</div>
            </div>
        @endif

        <!-- Terms & Conditions -->
        <div class="terms-box">
            <div class="info-lbl" style="margin-bottom:6px;">Terms &amp; Conditions</div>
            <ul>
                <li>All courses offered by Skills Development Centre (SDC) are strictly <strong>Non-Refundable</strong>.
                </li>
                <li>By making payment, you agree to our Terms of Service and Privacy Policy.</li>
                <li>Privacy Policy: <a
                        href="https://sdcbd.net/privacy-policy-2/">https://sdcbd.net/privacy-policy-2/</a></li>
                <li>Terms of Service: <a href="https://sdcbd.net/terms-of-service/">https://sdcbd.net/terms/</a></li>
            </ul>
        </div>

        <div class="footer">
            <p>{{ $siteName }} &nbsp;·&nbsp; Generated on {{ now()->format('d M Y H:i') }}</p>
            <p style="margin-top:4px;">Generated by: {{ $generatedBy }}</p>
            <p style="margin-top:4px;">This is a computer-generated invoice. No signature required.</p>

        </div>

    </div>
</body>

</html>
