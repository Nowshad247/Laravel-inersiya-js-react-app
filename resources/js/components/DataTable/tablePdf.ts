import type { ColumnDef } from '@tanstack/react-table';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PdfColumn<TData> {
    key: string;
    header: string;
    getValue: (record: TData) => unknown;
}

function getNestedValue(record: unknown, key: string): unknown {
    return key.split('.').reduce<unknown>((value, part) => {
        if (value && typeof value === 'object') {
            return (value as Record<string, unknown>)[part];
        }

        return undefined;
    }, record);
}

function formatPdfValue(value: unknown): string {
    if (value === null || value === undefined || value === '') {
        return '-';
    }

    if (Array.isArray(value)) {
        return value
            .map((item) => {
                if (item && typeof item === 'object') {
                    return String((item as Record<string, unknown>).name ?? '');
                }

                return String(item);
            })
            .filter(Boolean)
            .join(', ');
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

function getPdfColumns<TData>(columns: ColumnDef<TData>[]): PdfColumn<TData>[] {
    return columns.flatMap((column) => {
        if (
            !('accessorKey' in column) ||
            typeof column.accessorKey !== 'string'
        ) {
            return [];
        }

        const key = column.accessorKey;
        const header = typeof column.header === 'string' ? column.header : key;

        return [
            {
                key,
                header,
                getValue: (record: TData) => getNestedValue(record, key),
            },
        ];
    });
}

export function downloadTablePdf<TData>({
    columns,
    data,
    filename,
}: {
    columns: ColumnDef<TData>[];
    data: TData[];
    filename: string;
}): void {
    const pdfColumns = getPdfColumns(columns);
    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: 'a4',
    });

    autoTable(pdf, {
        head: [pdfColumns.map((column) => column.header)],
        body: data.map((record) =>
            pdfColumns.map((column) => formatPdfValue(column.getValue(record))),
        ),
        margin: { top: 36, right: 24, bottom: 28, left: 24 },
        styles: { fontSize: 8, cellPadding: 4, overflow: 'linebreak' },
        headStyles: { fillColor: [30, 41, 59], textColor: 255 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
        theme: 'grid',
    });

    pdf.save(filename);
}
