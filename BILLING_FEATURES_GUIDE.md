# Billing Features Guide

## New Features Implemented

### 1. Fee Type Management

#### Display Fee Types
- **Location**: Billings Table (`/billings`)
- **Columns**: Now shows `feeType` for each invoice
- **Example**: Tuition, Exam, Lab, etc.

#### Store Fee Types
- When creating an invoice, the **first fee item's type** is stored as the primary fee type
- Displayed in all invoice views and reports
- Exported in all CSV reports

### 2. Monthly Reports Filter

#### Access Reports
- **URL**: `/billings/reports`
- **New Filter**: Month dropdown (last 24 months available)
- **Options**: Each month shown as "Month YYYY" (e.g., "July 2026")
- **Combined Filters**: Works with Course, Batch, Student, Status filters

#### Revenue Breakdown by Fee Type
- New data section: `byFeeType` in revenue data
- Shows for each fee type:
  - Total invoiced amount (BDT)
  - Total paid amount (BDT)
  - Total due amount (BDT)
  - Number of invoices

### 3. CSV Export Functions

#### Three New Export Types

**A. Comprehensive Export** (`/billings/reports/export-comprehensive`)
```
Export Name: billing_comprehensive_{period}_{date}.csv
Columns: 
  - Invoice#
  - Student Name
  - Student UID
  - Phone
  - Email
  - Course
  - Batch
  - Fee Type
  - Issue Date
  - Due Date
  - Subtotal (BDT)
  - Discount (BDT)
  - Tax (BDT)
  - Total (BDT)
  - Paid (BDT)
  - Due (BDT)
  - Status
  - Payment Method
  - Last Payment Date
  - Days Overdue
  - Created At

Usage: Full audit trail of all invoices with complete details
```

**B. Fee Type Summary** (`/billings/reports/export-fee-type`)
```
Export Name: billing_by_fee_type_{period}_{date}.csv
Columns:
  - Fee Type
  - Count (# of invoices)
  - Total (BDT)
  - Paid (BDT)
  - Due (BDT)
  - Avg (BDT) - Average per invoice

Usage: Analyze billing by fee type categories
```

**C. Payment Details** (`/billings/reports/export-payments`)
```
Export Name: billing_payments_detail_{period}_{date}.csv
Columns:
  - Payment Date
  - Invoice #
  - Student Name
  - Student UID
  - Amount (BDT)
  - Method (e.g., Cash, Card, Online)
  - Status (Verified, Pending)
  - Transaction ID
  - Note

Usage: Detailed payment transaction records
```

#### Existing Exports (Enhanced)
- **Collections Export**: Now includes Fee Type column
- **Invoice Export**: Now includes Student UID and Fee Type columns
- **All exports**: UTF-8 BOM for proper Bengali text rendering

### 4. Due Report Export

**Location**: `/billings/collections/export`
- **New Field**: Fee Type column added
- **Shows**: Invoice ID, Student, Course, **Fee Type**, Due Date, Amounts, Status

---

## Database Changes

### Invoices Table
```sql
ALTER TABLE invoices ADD COLUMN fee_type VARCHAR(255) NULLABLE;
```

- Migration: `2026_07_02_164502_add_fee_type_to_invoices_table`
- Column: `fee_type` (after `type` column)
- Default: NULL (displays as "General" if empty)

---

## Usage Scenarios

### Scenario 1: Track Tuition vs Lab Fee Revenue
1. Go to `/billings/reports`
2. Select desired month from dropdown
3. Scroll to "Revenue by Fee Type" section
4. Click "Export by Fee Type"
5. Analyze tuition, lab, exam fees separately

### Scenario 2: Generate Complete Invoice Report
1. Navigate to `/billings/reports`
2. Set filters: Month, Course, Status
3. Click "Export Comprehensive"
4. Get full invoice data with student contact info, amounts, and status

### Scenario 3: Payment Reconciliation
1. Go to `/billings/reports`
2. Select payment period
3. Click "Export Payments"
4. Get all payment transactions with invoice references
5. Match payments to invoices for reconciliation

### Scenario 4: Monthly Collection Analysis
1. Visit `/billings/collections`
2. Review due amounts
3. Click "Export Due Report"
4. Get due invoices by fee type
5. Plan collection strategy by fee type

---

## API Routes Reference

### Reports
- `GET /billings/reports` - View reports page with filters
- `GET /billings/reports/export` - Generic export (type parameter)
- `GET /billings/reports/export-comprehensive` - Full details
- `GET /billings/reports/export-fee-type` - By fee type
- `GET /billings/reports/export-payments` - Payment details

### Billings
- `GET /billings` - Main billings with fee types
- `GET /billings/invoices` - Invoice list with fee types
- `GET /billings/collections/export` - Collections export with fee type

---

## Query Parameters

### Common Parameters for All Exports
```
?period=monthly              (monthly, yearly, custom)
?date_from=2026-07-01       (if period=custom)
?date_to=2026-07-31         (if period=custom)
?student_id=5               (optional)
?course_id=2                (optional)
?batch_id=3                 (optional)
?payment_method=cash        (optional, for payments)
?status=paid                (optional)
```

### Example Export URLs
```
/billings/reports/export-comprehensive?period=monthly&student_id=5
/billings/reports/export-fee-type?period=custom&date_from=2026-01-01&date_to=2026-06-30
/billings/reports/export-payments?period=monthly&payment_method=card
```

---

## Notes

- All CSV exports include **UTF-8 BOM** (`\xEF\xBB\xBF`) for proper Excel rendering
- Fee types can be: Tuition, Lab, Exam, or custom values entered when creating invoices
- Month filter shows last 24 months of data
- Days Overdue: 0 if payment is on time or fully paid
- All amounts in BDT (Bangladeshi Taka)
- Last Payment Date: Most recent payment for that invoice

