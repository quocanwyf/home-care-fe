import { useState } from 'react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export interface ExportData {
  [key: string]: any;
}

export interface ExportOptions {
  fileName?: string;
  chartSelector?: string;
  title?: string;
}

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = (
    data: ExportData,
    options: ExportOptions = {}
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      // Flatten data structure for CSV
      const flattenData = (obj: any, prefix = ''): any[] => {
        const result: any[] = [];

        Object.keys(obj).forEach((key) => {
          const value = obj[key];
          const newKey = prefix ? `${prefix}.${key}` : key;

          if (Array.isArray(value)) {
            // Handle arrays - add header then data
            result.push([newKey.toUpperCase()]);
            if (value.length > 0 && typeof value[0] === 'object') {
              // Array of objects - add headers then rows
              const headers = Object.keys(value[0]);
              result.push(headers);
              value.forEach((item) => {
                result.push(headers.map((header) => item[header] || ''));
              });
            } else {
              // Array of primitives
              value.forEach((item) => result.push([item]));
            }
            result.push([]); // Empty row
          } else if (typeof value === 'object' && value !== null) {
            result.push([newKey.toUpperCase()]);
            const subData = flattenData(value);
            result.push(...subData);
            result.push([]); // Empty row
          } else {
            result.push([newKey, value]);
          }
        });

        return result;
      };

      try {
        const csvData = flattenData(data);

        // Convert to CSV string
        const csvContent = csvData
          .map((row) =>
            Array.isArray(row)
              ? row.map((cell) => `"${cell}"`).join(',')
              : `"${row}"`
          )
          .join('\n');

        // Create and download file
        const blob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${options.fileName || 'export'}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const exportToExcel = (
    data: ExportData,
    options: ExportOptions = {}
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.utils.book_new();

        // Process each key in data as a separate sheet
        Object.keys(data).forEach((key) => {
          const value = data[key];
          let worksheet;

          if (Array.isArray(value)) {
            // Convert array to worksheet
            worksheet = XLSX.utils.json_to_sheet(value);
          } else if (typeof value === 'object' && value !== null) {
            // Convert object to array of key-value pairs
            const kvPairs = Object.keys(value).map((k) => ({
              Property: k,
              Value: value[k],
            }));
            worksheet = XLSX.utils.json_to_sheet(kvPairs);
          } else {
            // Single value
            worksheet = XLSX.utils.aoa_to_sheet([[key, value]]);
          }

          // Clean sheet name (Excel sheet names have restrictions)
          const sheetName = key.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 31);
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
        });

        // Save file
        const fileName = `${options.fileName || 'export'}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };

  const exportToPDF = async (
    data: ExportData,
    options: ExportOptions = {}
  ): Promise<boolean> => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yPosition = 20;

    // Add title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    const title = options.title || 'Export Report';
    pdf.text(title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Add export date
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Export Date: ${new Date().toLocaleString()}`, 20, yPosition);
    yPosition += 15;

    // Process data sections
    Object.keys(data).forEach((key) => {
      const value = data[key];

      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }

      // Add section header
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(key.toUpperCase(), 20, yPosition);
      yPosition += 10;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      if (Array.isArray(value)) {
        // Handle arrays
        value.forEach((item, index) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }

          if (typeof item === 'object') {
            const text = Object.entries(item)
              .map(([k, v]) => `${k}: ${v}`)
              .join(', ');
            pdf.text(`${index + 1}. ${text}`, 20, yPosition);
          } else {
            pdf.text(`${index + 1}. ${item}`, 20, yPosition);
          }
          yPosition += 6;
        });
      } else if (typeof value === 'object' && value !== null) {
        // Handle objects
        Object.entries(value).forEach(([k, v]) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          pdf.text(`${k}: ${v}`, 20, yPosition);
          yPosition += 6;
        });
      } else {
        // Handle primitives
        pdf.text(`${value}`, 20, yPosition);
        yPosition += 6;
      }

      yPosition += 10; // Space between sections
    });

    // Add chart if selector provided
    if (options.chartSelector) {
      const chartElement = document.querySelector(options.chartSelector);
      if (chartElement) {
        try {
          const canvas = await html2canvas(chartElement as HTMLElement);
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 40;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          // Check if we need a new page for chart
          if (yPosition + imgHeight > 280) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.addImage(imgData, 'PNG', 20, yPosition, imgWidth, imgHeight);
        } catch (error) {
          console.error('Chart capture failed:', error);
          // Continue without chart rather than failing entirely
        }
      }
    }

    // Save PDF
    const fileName = `${options.fileName || 'export'}.pdf`;
    pdf.save(fileName);

    return true;
  };

  // ✅ Main export handler - proper error handling
  const handleExport = async (
    format: 'csv' | 'excel' | 'pdf',
    data: ExportData,
    options: ExportOptions = {}
  ) => {
    try {
      setIsExporting(true);

      switch (format) {
        case 'csv':
          await exportToCSV(data, options);
          break;
        case 'excel':
          await exportToExcel(data, options);
          break;
        case 'pdf':
          await exportToPDF(data, options);
          break;
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      return {
        success: true,
        message: `Successfully exported as ${format.toUpperCase()}`,
      };
    } catch (error) {
      console.error('Export failed:', error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Export failed. Please try again.',
      };
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    handleExport,
    exportToCSV,
    exportToExcel,
    exportToPDF,
  };
};
