import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Types pour l'export
export interface ExportData {
  headers: string[];
  rows: (string | number | boolean | Date)[][];
  title?: string;
  filename?: string;
}

// Export PDF
export function exportToPDF(data: ExportData) {
  const doc = new jsPDF();
  const { headers, rows, title = 'Rapport' } = data;

  // Titre
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 20);
  
  // Date
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 14, 28);

  // Tableau
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 35,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [59, 130, 246],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
  });

  // Sauvegarder
  doc.save(`${data.filename || 'rapport'}.pdf`);
}

// Export Excel
export function exportToExcel(data: ExportData) {
  const { headers, rows, title = 'Données' } = data;

  // Créer le workbook
  const wb = XLSX.utils.book_new();
  
  // Créer la sheet avec les données
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Style de la sheet
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
  
  // Mettre en gras les headers
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cell = ws[XLSX.utils.encode_cell({ r: 0, c: col })];
    if (cell) {
      cell.s = {
        font: { bold: true },
        fill: { fgColor: { rgb: '3B82F6' } },
        font: { color: { rgb: 'FFFFFF' } },
      };
    }
  }

  // Ajouter la sheet au workbook
  XLSX.utils.book_append_sheet(wb, ws, title.substring(0, 31));

  // Sauvegarder
  XLSX.writeFile(wb, `${data.filename || 'export'}.xlsx`);
}

// Export CSV
export function exportToCSV(data: ExportData) {
  const { headers, rows, filename = 'export' } = data;

  // Créer le workbook
  const wb = XLSX.utils.book_new();
  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  XLSX.utils.book_append_sheet(wb, ws, 'Données');
  XLSX.writeFile(wb, `${filename}.csv`);
}

// Formater les données pour l'export
export function formatDataForExport<T extends Record<string, any>>(
  items: T[],
  columns: { key: keyof T; header: string; format?: (value: any) => string | number }[]
): { headers: string[]; rows: (string | number)[][] } {
  const headers = columns.map(col => col.header);
  const rows = items.map(item =>
    columns.map(col => {
      const value = item[col.key];
      if (col.format) return col.format(value);
      if (value instanceof Date) return value.toLocaleDateString('fr-FR');
      if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
      return value || '-';
    })
  );

  return { headers, rows };
}