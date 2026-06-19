import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Search, Download, FileSpreadsheet } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { downloadService } from '@dashboard/services';
import { DownloadReportData, DownloadReportEntry, DownloadReportSection } from '@dashboard/types';
import { QUERY_KEYS } from '@dashboard/constants';
import { Button, EmptyState } from '@dashboard/components/ui';
import { SectionSpinner } from '@dashboard/components/ui/Spinner';
import { ErrorState } from '@dashboard/components/ui/ErrorState';

export function DownloadPage() {
  const [companyName, setCompanyName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [QUERY_KEYS.DOWNLOAD_REPORT, searchQuery],
    queryFn: () => downloadService.getReport(searchQuery),
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim()) setSearchQuery(companyName.trim());
  };

  // jsPDF Helvetica does not support the Unicode ₹ symbol (U+20B9) — use "Rs." instead
  const pdfAmount = (amount: number) => `Rs. ${amount.toLocaleString('en-IN')}`;

  const entryToRow = (e: DownloadReportEntry) => [
    e.id,
    format(new Date(e.date), 'dd MMM yyyy'),
    e.projectTitle,
    e.purpose,
    pdfAmount(e.amount),
    e.paymentMode,
    e.refId,
    e.vendorName || '-',
    e.invoiceNumber || '-',
    e.gstNumber || '-',
  ];

  const tableHeaders = ['ID', 'Date', 'Project', 'Purpose', 'Amount (Rs.)', 'Mode', 'Ref ID', 'Vendor', 'Invoice#', 'GST'];

  // Landscape A4 usable width = 297mm - 14mm left - 14mm right = 269mm
  // Column widths must sum to 269mm
  const txColStyles = {
    0: { cellWidth: 20 },                        // ID
    1: { cellWidth: 22 },                        // Date
    2: { cellWidth: 36 },                        // Project
    3: { cellWidth: 52 },                        // Purpose
    4: { cellWidth: 30, halign: 'right' as const }, // Amount — wide enough for Rs.1,05,820
    5: { cellWidth: 16 },                        // Mode
    6: { cellWidth: 26 },                        // Ref ID
    7: { cellWidth: 24 },                        // Vendor
    8: { cellWidth: 21 },                        // Invoice#
    9: { cellWidth: 22 },                        // GST
    // Total: 20+22+36+52+30+16+26+24+21+22 = 269mm ✓
  };

  const calcProfitPercentage = (creditTotal: number, debitTotal: number): number => {
    if (creditTotal === 0 && debitTotal === 0) return 0;
    if (creditTotal === 0) return -100;
    return ((creditTotal - debitTotal) / creditTotal) * 100;
  };

  const addSectionToPdf = (doc: jsPDF, title: string, section: DownloadReportSection, startY: number): number => {
    let y = startY;

    // Section title
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text(title, 14, y);
    y += 8;

    // Credits
    if (section.credits.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 128, 61); // green-700
      doc.text(`Credits (${section.credits.length})`, 14, y);
      doc.text(`Total: ${pdfAmount(section.creditTotal)}`, 283, y, { align: 'right' });
      y += 2;

      autoTable(doc, {
        startY: y,
        head: [tableHeaders],
        body: section.credits.map(entryToRow),
        foot: [['', '', '', 'TOTAL CREDITS', pdfAmount(section.creditTotal), '', '', '', '', '']],
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [220, 252, 231], textColor: [21, 128, 61], fontStyle: 'bold' },
        footStyles: { fillColor: [220, 252, 231], textColor: [21, 128, 61], fontStyle: 'bold' },
        columnStyles: txColStyles,
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    // Debits
    if (section.debits.length > 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(185, 28, 28); // red-700
      doc.text(`Debits (${section.debits.length})`, 14, y);
      doc.text(`Total: ${pdfAmount(section.debitTotal)}`, 283, y, { align: 'right' });
      y += 2;

      autoTable(doc, {
        startY: y,
        head: [tableHeaders],
        body: section.debits.map(entryToRow),
        foot: [['', '', '', 'TOTAL DEBITS', pdfAmount(section.debitTotal), '', '', '', '', '']],
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 2 },
        headStyles: { fillColor: [254, 226, 226], textColor: [185, 28, 28], fontStyle: 'bold' },
        footStyles: { fillColor: [254, 226, 226], textColor: [185, 28, 28], fontStyle: 'bold' },
        columnStyles: txColStyles,
        margin: { left: 14, right: 14 },
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    }

    if (section.credits.length === 0 && section.debits.length === 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(150, 150, 150);
      doc.text('No transactions', 14, y);
      y += 10;
    }

    // Profit Summary Box
    const netProfit = section.creditTotal - section.debitTotal;
    const profitPct = Math.round(calcProfitPercentage(section.creditTotal, section.debitTotal) * 100) / 100;
    const isProfit = netProfit >= 0;
    const summaryFill: [number, number, number] = isProfit ? [220, 252, 231] : [254, 226, 226];
    const summaryText: [number, number, number] = isProfit ? [21, 128, 61] : [185, 28, 28];

    // Summary table: 4 columns, total 269mm
    // Label cols: 60mm each, Value cols: 74.5mm each → 60+74.5+60+74.5 = 269mm
    autoTable(doc, {
      startY: y,
      head: [['Project Profit Summary', '', '', '']],
      body: [
        ['Total Credits', pdfAmount(section.creditTotal), 'Total Debits', pdfAmount(section.debitTotal)],
        ['Net Profit / Loss', `${isProfit ? '+' : ''}${pdfAmount(netProfit)}`, 'Profit %', `${profitPct}%`],
      ],
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3, fontStyle: 'bold' },
      headStyles: { fillColor: summaryFill, textColor: summaryText, fontStyle: 'bold', halign: 'center' },
      bodyStyles: { fillColor: summaryFill, textColor: summaryText },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 74.5, halign: 'right' },
        2: { cellWidth: 60 },
        3: { cellWidth: 74.5, halign: 'right' },
      },
      margin: { left: 14, right: 14 },
    });
    y = (doc as any).lastAutoTable.finalY + 12;

    return y;
  };

  const handleDownload = () => {
    if (!data) return;

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('Payment Advice & Billing Report', 14, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Company: ${data.companyName}`, 14, 25);
    doc.text(`Generated: ${format(new Date(data.generatedAt), 'dd MMM yyyy, hh:mm a')}`, 14, 30);
    doc.text(`Projects: ${data.projects.map((p) => p.projectTitle).join(', ')}`, 14, 35);

    // Divider line
    doc.setDrawColor(200, 200, 200);
    doc.line(14, 38, 283, 38);

    let y = 44;

    // Payment Advice Section
    y = addSectionToPdf(doc, 'Payment Advice', data.paymentAdvice, y);

    // Check if we need a new page
    if (y > 170) {
      doc.addPage();
      y = 18;
    }

    // Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(14, y - 2, 283, y - 2);
    y += 4;

    // Billing Section
    addSectionToPdf(doc, 'Billing', data.billing, y);

    // Footer on each page
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(160, 160, 160);
      doc.text(`Balaji & Co - Confidential | Page ${i} of ${pageCount}`, 148, 200, { align: 'center' });
    }

    doc.save(`report-${data.companyName.replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const renderSection = (title: string, section: DownloadReportData['paymentAdvice']) => {
    const hasData = section.credits.length > 0 || section.debits.length > 0;
    const netProfit = section.creditTotal - section.debitTotal;
    const profitPct = Math.round(calcProfitPercentage(section.creditTotal, section.debitTotal) * 100) / 100;
    const isProfit = netProfit >= 0;

    if (!hasData) return (
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500">No data</p>
      </div>
    );

    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>

        {section.credits.length > 0 && (
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-green-700">Credits ({section.credits.length})</h4>
              <span className="text-sm font-bold text-green-700">Total: ₹{section.creditTotal.toLocaleString('en-IN')}</span>
            </div>
            <ReportTable entries={section.credits} />
          </div>
        )}

        {section.debits.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-red-700">Debits ({section.debits.length})</h4>
              <span className="text-sm font-bold text-red-700">Total: ₹{section.debitTotal.toLocaleString('en-IN')}</span>
            </div>
            <ReportTable entries={section.debits} />
          </div>
        )}

        {/* Profit Summary */}
        <div className={`px-6 py-4 border-t border-gray-100 ${isProfit ? 'bg-green-50' : 'bg-red-50'}`}>
          <h4 className={`text-sm font-semibold mb-3 ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
            Project Profit Summary
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-500 text-xs">Total Credits</p>
              <p className="font-semibold text-green-700">₹{section.creditTotal.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Total Debits</p>
              <p className="font-semibold text-red-700">₹{section.debitTotal.toLocaleString('en-IN')}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Net Profit / Loss</p>
              <p className={`font-bold ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                {isProfit ? '+' : ''}₹{netProfit.toLocaleString('en-IN')}
              </p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Profit %</p>
              <p className={`font-bold ${isProfit ? 'text-green-700' : 'text-red-700'}`}>
                {profitPct}%
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Download Report</h1>
        <p className="text-sm text-gray-500 mt-1">Search by company name to download Payment Advice & Billing report</p>
      </div>

      <div className="bg-white shadow-sm rounded-xl border border-gray-100 p-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Enter company name..."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="pl-9 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>
          <Button type="submit" disabled={!companyName.trim()}>
            <Search className="h-4 w-4 mr-2" /> Search
          </Button>
        </form>
      </div>

      {isLoading && <SectionSpinner />}
      {isError && <ErrorState message="Failed to load report" onRetry={() => refetch()} />}

      {data && (
        <>
          {data.projects.length === 0 ? (
            <EmptyState
              icon={FileSpreadsheet}
              title="No data found"
              description={`No projects found matching "${searchQuery}". Try a different company name.`}
            />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Found {data.projects.length} project{data.projects.length !== 1 ? 's' : ''} for <strong>{data.companyName}</strong>
                </p>
                <Button onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>
              </div>

              {renderSection('Payment Advice', data.paymentAdvice)}
              {renderSection('Billing', data.billing)}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReportTable({ entries }: { entries: DownloadReportEntry[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">ID</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Date</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Project</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Purpose</th>
            <th className="text-right px-3 py-2 text-xs font-medium text-gray-500">Amount</th>
            <th className="text-left px-3 py-2 text-xs font-medium text-gray-500">Mode</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td className="px-3 py-2 font-mono text-xs text-forest-600">{entry.id}</td>
              <td className="px-3 py-2 text-xs text-gray-500">{format(new Date(entry.date), 'dd MMM yyyy')}</td>
              <td className="px-3 py-2 text-xs truncate max-w-[150px]">{entry.projectTitle}</td>
              <td className="px-3 py-2 text-xs truncate max-w-[200px]">{entry.purpose}</td>
              <td className="px-3 py-2 text-xs text-right font-medium">₹{entry.amount.toLocaleString('en-IN')}</td>
              <td className="px-3 py-2 text-xs capitalize">{entry.paymentMode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
