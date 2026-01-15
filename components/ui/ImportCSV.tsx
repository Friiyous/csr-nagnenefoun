'use client';

import { useState, useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Modal } from './Modal';
import { z } from 'zod';

interface ImportCSVProps {
  title?: string;
  template?: Record<string, string>;
  onImport: (data: Record<string, unknown>[]) => Promise<void>;
  schema?: z.ZodSchema;
}

export function ImportCSV({
  title = 'Importer CSV',
  template = {},
  onImport,
  schema,
}: ImportCSVProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setError('Veuillez sélectionner un fichier CSV');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setSuccess(false);

    // Parse CSV
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setError('Le fichier CSV doit contenir au moins une ligne de données');
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      // Validate with schema if provided
      if (schema) {
        try {
          data.forEach((row, index) => {
            schema.parse(row);
          });
        } catch (err) {
          if (err instanceof z.ZodError) {
            setError(`Ligne ${index + 2}: ${err.errors[0].message}`);
            return;
          }
        }
      }

      setPreview(data.slice(0, 5)); // Show first 5 rows
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setError(null);

    try {
      // Re-parse full data
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const data = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
        const row: Record<string, unknown> = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });

      await onImport(data);
      setSuccess(true);
      setFile(null);
      setPreview([]);
      
      // Close after delay
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Erreur lors de l\'importation');
      console.error(err);
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const headers = Object.keys(template);
    const rows = [headers.join(',')];
    
    // Add example row
    const exampleRow = headers.map(h => template[h] || '').join(',');
    rows.push(exampleRow);

    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)}>
        <Upload className="h-4 w-4 mr-2" />
        {title}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          setFile(null);
          setPreview([]);
          setError(null);
          setSuccess(false);
        }}
        title={title}
        size="lg"
      >
        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">Import réussi !</h3>
            <p className="text-gray-500 mt-2">Les données ont été importées avec succès.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Template download */}
            {Object.keys(template).length > 0 && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">Télécharger le modèle</p>
                    <p className="text-sm text-gray-500">{Object.keys(template).length} colonnes</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={downloadTemplate}>
                  Modèle CSV
                </Button>
              </div>
            )}

            {/* File upload */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
              <p className="font-medium text-gray-900">
                {file ? file.name : 'Cliquez pour sélectionner un fichier CSV'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ou glissez-déposez le fichier ici
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-xl">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Preview */}
            {preview.length > 0 && (
              <div>
                <p className="font-medium mb-2">Aperçu (premières {preview.length} lignes)</p>
                <div className="bg-gray-50 rounded-xl p-4 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        {Object.keys(preview[0]).map(key => (
                          <th key={key} className="text-left p-2 font-medium text-gray-700">
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {preview.map((row, index) => (
                        <tr key={index}>
                          {Object.values(row).map((value: unknown, i) => (
                            <td key={i} className="p-2 text-gray-600">
                              {String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Total: {preview.length + (file ? '∞' : '0')} lignes prêtes à importer
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setFile(null);
                  setPreview([]);
                  setError(null);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={handleImport}
                disabled={!file || importing || !!error}
                loading={importing}
              >
                {importing ? 'Importation...' : 'Importer'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}