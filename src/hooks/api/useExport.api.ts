import { type ExportParams, downloadExcelExportApi } from '@/apis/export.api';
import { useMutation } from '@tanstack/react-query';

export const useDownloadExcelExport = () => {
  return useMutation({
    mutationFn: (params: ExportParams) => downloadExcelExportApi(params),
    onSuccess: (blob, variables) => {
      // Auto download file
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename with date range
      const fileName = `dashboard-export-${variables.startDate.replace(/\//g, '-')}-to-${variables.endDate.replace(/\//g, '-')}.xlsx`;
      link.download = fileName;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup
      URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error('Export failed:', error);
    },
  });
};
