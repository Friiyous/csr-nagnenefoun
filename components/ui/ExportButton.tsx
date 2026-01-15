'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { Button } from './Button';
import { exportToPDF, exportToExcel, formatDataForExport } from '@/lib/export';

type ExportFormat = 'csv' | 'excel' | 'pdf';

interface ExportButtonProps {
  data: Record<string, unknown>[];
  filename: string;
  title?: string;
  headers?: string[];
  showCSV?: boolean;
  showExcel?: boolean;
  showPDF?: boolean;
}

export function ExportButton({
  data,
  filename,
  title = 'Exporter',
  headers,
  showCSV = true,
  showExcel = true,
  showPDF = true,
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    setIsOpen(false);
    
    try {
      if (data.length === 0) {
        alert('Aucune donnée à exporter');
        return;
      }

      const exportHeaders = headers || Object.keys(data[0]);

      // Formater les données
      const { headers: formattedHeaders, rows } = formatDataForExport(data, 
        exportHeaders.map(h => ({ key: h as keyof Record<string, unknown>, header: h }))
      );

      switch (format) {
        case 'pdf':
          exportToPDF({
            headers: formattedHeaders,
            rows,
            title: filename,
            filename,
          });
          break;
        case 'excel':
          exportToExcel({
            headers: formattedHeaders,
            rows,
            title: filename,
            filename,
          });
          break;
        case 'csv':
          // Créer CSV manuellement
          const csvContent = [
            formattedHeaders.join(','),
            ...rows.map(row => row.join(','))
          ].join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${filename}.csv`;
          link.click();
          break;
      }
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="secondary"
        disabled={exporting}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {exporting ? (
          <>
            <span className="animate-spin">⏳</span>
            Exportation...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            {title}
            <ChevronDown className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Menu dropdown */}
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-100 dark:border-slate-700 py-2 z-20 overflow-hidden">
            <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
              Format d'export
            </div>
            
            {showPDF && (
              <button
                onClick={() => handleExport('pdf')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="p-1.5 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                PDF Document
              </button>
            )}
            
            {showExcel && (
              <button
                onClick={() => handleExport('excel')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
              >
                <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <FileSpreadsheet className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                Excel (.xlsx)
              </button>
            )}
            
            {showCSV && (
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Download className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                CSV
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}