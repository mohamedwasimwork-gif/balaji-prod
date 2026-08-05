import { useState } from 'react';
import { endOfDay, format, startOfDay } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download, FileSpreadsheet } from 'lucide-react';
import toast from 'react-hot-toast';

import { Button, Modal } from '@dashboard/components/ui';
import { usePermissions } from '@dashboard/hooks/usePermissions';
import { useProjectOptions } from '@dashboard/hooks/useProjectOptions';
import { expensesService, invoicesService } from '@dashboard/services';

export type LedgerKind = 'expenses' | 'invoices';

interface LedgerEntry {
  id: string;
  date: string;
  projectTitle: string;
  companyName: string;
  purpose: string;
  amount: number;
  amountType: string;
  paymentMode: string;
  refId: string;
  vendorName: string;
  invoiceNumber: string;
  gstNumber: string;
  remarks: string;
}

interface ReportFilters {
  limit: number;
  startDate: string;
  endDate: string;
  amountType?: 'credit' | 'debit';
  projectId?: string;
}

/**
 * Payment Advice and Billing produce the same report from two collections that
 * differ only in their id and date field names, so the whole thing is one
 * component driven by this config rather than two near-identical copies.
 */
const REPORT_CONFIG: Record<
  LedgerKind,
  {
    modalTitle: string;
    pdfHeading: string;
    pdfFooter: string;
    fileStem: string;
    idHeader: string;
    emptyMessage: string;
    fetch: (filters: ReportFilters) => Promise<LedgerEntry[]>;
  }
> = {
  expenses: {
    modalTitle: 'Download Expenses Report',
    pdfHeading: 'Payment Advice (Expenses) Report',
    pdfFooter: 'Balaji & Co - Payment Advice Report',
    fileStem: 'expenses-report',
    idHeader: 'Expense ID',
    emptyMessage: 'No expenses found for the selected filters',
    fetch: async (filters) => {
      const response = await expensesService.getExpenses(filters as never);
      return response.expenses.map((e) => toEntry(e, e.expenseId, e.expenseDate));
    },
  },
  invoices: {
    modalTitle: 'Download Invoices Report',
    pdfHeading: 'Billing (Invoices) Report',
    pdfFooter: 'Balaji & Co - Billing Report',
    fileStem: 'invoices-report',
    idHeader: 'Invoice ID',
    emptyMessage: 'No invoices found for the selected filters',
    fetch: async (filters) => {
      const response = await invoicesService.getInvoices(filters as never);
      return response.invoices.map((i) => toEntry(i, i.invoiceId, i.invoiceDate));
    },
  },
};

function toEntry(record: any, id: string, date?: string): LedgerEntry {
  return {
    id,
    // Records predating the date field fall back to when they were inserted.
    date: date ?? record.createdAt,
    projectTitle: record.projectSnapshot?.projectTitle || '',
    companyName: record.projectSnapshot?.companyName || '',
    purpose: record.purpose || '',
    amount: record.amount,
    amountType: record.amountType,
    paymentMode: record.paymentMode,
    refId: record.refId || '',
    vendorName: record.vendorName || '',
    invoiceNumber: record.invoiceNumber || '',
    gstNumber: record.gstNumber || '',
    remarks: record.remarks || '',
  };
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export function DownloadLedgerReportModal({
  kind,
  open,
  onClose,
}: {
  kind: LedgerKind;
  open: boolean;
  onClose: () => void;
}) {
  const config = REPORT_CONFIG[kind];
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [amountType, setAmountType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterProjectId, setFilterProjectId] = useState('all');
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  const { projects } = useProjectOptions(open);
  // Credit/debit totals and net profit are admin-only everywhere else in the
  // app, so the report summary follows the same rule.
  const { canViewProfit } = usePermissions();

  // Returns null when the caller should stop: invalid range, or nothing to report.
  const loadEntries = async (): Promise<LedgerEntry[] | null> => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return null;
    }
    if (new Date(startDate) > new Date(endDate)) {
      toast.error('The start date must be on or before the end date');
      return null;
    }

    const filters: ReportFilters = {
      limit: 10000,
      startDate: startOfDay(new Date(startDate)).toISOString(),
      endDate: endOfDay(new Date(endDate)).toISOString(),
    };
    if (amountType !== 'all') filters.amountType = amountType;
    if (filterProjectId !== 'all') filters.projectId = filterProjectId;

    const entries = await config.fetch(filters);
    if (entries.length === 0) {
      toast.error(config.emptyMessage);
      return null;
    }
    return entries;
  };

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const entries = await loadEntries();
      if (!entries) return;

      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text(config.pdfHeading, 14, 18);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Date Range: ${format(new Date(startDate), 'dd MMM yyyy')} to ${format(new Date(endDate), 'dd MMM yyyy')}`,
        14,
        25
      );
      doc.text(`Type: ${amountType.toUpperCase()}`, 14, 30);

      const projectLabel =
        filterProjectId === 'all'
          ? 'All Projects'
          : projects.find((p) => p._id === filterProjectId)?.projectTitle || 'Selected Project';
      doc.text(`Project: ${projectLabel}`, 14, 35);

      doc.setDrawColor(200, 200, 200);
      doc.line(14, 38, 283, 38);

      // Helvetica has no rupee glyph, so amounts are prefixed "Rs." in PDFs.
      const pdfAmount = (amount: number) => `Rs. ${amount.toLocaleString('en-IN')}`;

      autoTable(doc, {
        startY: 42,
        head: [['ID', 'Date', 'Project', 'Purpose', 'Amount (Rs.)', 'Type', 'Mode', 'Ref ID', 'Vendor', 'Invoice#', 'GST']],
        body: entries.map((e) => [
          e.id,
          format(new Date(e.date), 'dd MMM yyyy'),
          e.projectTitle,
          e.purpose,
          pdfAmount(e.amount),
          e.amountType.toUpperCase(),
          e.paymentMode.toUpperCase(),
          e.refId,
          e.vendorName || '-',
          e.invoiceNumber || '-',
          e.gstNumber || '-',
        ]),
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [20, 83, 45], textColor: [255, 255, 255], fontStyle: 'bold' },
        columnStyles: {
          0: { cellWidth: 18 },
          1: { cellWidth: 20 },
          2: { cellWidth: 32 },
          3: { cellWidth: 44 },
          4: { cellWidth: 26, halign: 'right' as const },
          5: { cellWidth: 14 },
          6: { cellWidth: 16 },
          7: { cellWidth: 24 },
          8: { cellWidth: 22 },
          9: { cellWidth: 21 },
          10: { cellWidth: 32 },
        },
        margin: { left: 14, right: 14 },
      });

      if (canViewProfit) {
        const totalCredit = entries
          .filter((e) => e.amountType === 'credit')
          .reduce((acc, e) => acc + e.amount, 0);
        const totalDebit = entries
          .filter((e) => e.amountType === 'debit')
          .reduce((acc, e) => acc + e.amount, 0);
        const netBalance = totalCredit - totalDebit;

        let y = (doc as any).lastAutoTable.finalY + 8;
        if (y > 175) {
          doc.addPage();
          y = 18;
        }

        autoTable(doc, {
          startY: y,
          head: [['Report Summary', '', '']],
          body: [
            ['Total Credits (Receipts)', pdfAmount(totalCredit), 'Total Debits (Payments)', pdfAmount(totalDebit)],
            ['Net Profit / Balance', `${netBalance >= 0 ? '+' : ''}${pdfAmount(netBalance)}`, '', ''],
          ],
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 3, fontStyle: 'bold' },
          headStyles: { fillColor: [240, 240, 240], textColor: [30, 30, 30], fontStyle: 'bold', halign: 'center' },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 74.5, halign: 'right' },
            2: { cellWidth: 60 },
            3: { cellWidth: 74.5, halign: 'right' },
          },
          margin: { left: 14, right: 14 },
        });
      }

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(160, 160, 160);
        doc.text(`${config.pdfFooter} | Page ${i} of ${pageCount}`, 148, 200, { align: 'center' });
      }

      doc.save(`${config.fileStem}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      toast.success('PDF report downloaded successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate PDF report');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleDownloadExcel = async () => {
    setDownloadingExcel(true);
    try {
      const entries = await loadEntries();
      if (!entries) return;

      const csvHeaders = [
        config.idHeader,
        'Date',
        'Project Title',
        'Company Name',
        'Purpose',
        'Amount',
        'Amount Type',
        'Payment Mode',
        'Ref ID',
        'Vendor Name',
        'Invoice Number',
        'GST Number',
        'Remarks',
      ];

      const csvRows = entries.map((e) => [
        e.id,
        format(new Date(e.date), 'yyyy-MM-dd'),
        csvCell(e.projectTitle),
        csvCell(e.companyName),
        csvCell(e.purpose),
        e.amount,
        e.amountType,
        e.paymentMode,
        csvCell(e.refId),
        csvCell(e.vendorName),
        csvCell(e.invoiceNumber),
        csvCell(e.gstNumber),
        csvCell(e.remarks),
      ]);

      const csvContent = [csvHeaders.join(','), ...csvRows.map((row) => row.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${config.fileStem}-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Excel (CSV) report downloaded successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate Excel report');
    } finally {
      setDownloadingExcel(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={config.modalTitle}>
      <div className="space-y-4">
        <Modal.Body>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate || undefined}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate || undefined}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Type</label>
              <select
                value={amountType}
                onChange={(e) => setAmountType(e.target.value as 'all' | 'credit' | 'debit')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">All (Credits &amp; Debits)</option>
                <option value="debit">Debits Only</option>
                <option value="credit">Credits Only</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Selection</label>
              <select
                value={filterProjectId}
                onChange={(e) => setFilterProjectId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
              >
                <option value="all">All Projects</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.projectTitle} — {p.companyName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <div className="flex gap-2">
            <Button
              onClick={handleDownloadExcel}
              loading={downloadingExcel}
              disabled={downloadingPdf}
              variant="secondary"
              className="flex items-center gap-1.5"
            >
              <FileSpreadsheet className="h-4 w-4 text-green-700" /> Export Excel
            </Button>
            <Button
              onClick={handleDownloadPdf}
              loading={downloadingPdf}
              disabled={downloadingExcel}
              className="flex items-center gap-1.5"
            >
              <Download className="h-4 w-4" /> Export PDF
            </Button>
          </div>
        </Modal.Footer>
      </div>
    </Modal>
  );
}
