import React from 'react';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDownloadExcelExport } from '@/hooks/api/useExport.api';

import TooltipInfo from '../primitives/TooltipInfo';

interface ExportButtonProps {
  // ✅ Simplified props - only need date range for API
  dateRange: {
    startDate: string;
    endDate: string;
  };
  onExportComplete?: (success: boolean, message: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'default' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  dateRange,
  onExportComplete,
  className = '',
  size = 'sm',
  variant = 'outline',
  disabled = false,
}) => {
  const exportMutation = useDownloadExcelExport();

  const handleExportExcel = async () => {
    try {
      await exportMutation.mutateAsync({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });

      // Success callback
      if (onExportComplete) {
        onExportComplete(true, 'Successfully exported Excel file');
      }
    } catch (error) {
      // Error callback
      if (onExportComplete) {
        onExportComplete(false, 'Server error');
      }
    }
  };

  const isExporting = exportMutation.isPending;

  return (
    <DropdownMenu>
      <TooltipInfo content="Export data" side="bottom">
        <DropdownMenuTrigger asChild>
          <Button
            variant={variant}
            size={size}
            className={`bg-overlay-slider/90 hover:bg-overlay-slider h-10 cursor-pointer rounded-xl text-white transition duration-500 ease-in-out hover:scale-105 hover:text-white ${className}`}
            disabled={disabled || isExporting}
          >
            <span className="mobile:hidden">
              {isExporting ? 'Exporting...' : 'Export'}
            </span>
            <span className="mobile:inline hidden">
              {isExporting ? 'Exporting...' : 'Export'}
            </span>
            <Download
              className={`ml-1 h-2 w-2 ${isExporting ? 'animate-spin' : ''}`}
            />
          </Button>
        </DropdownMenuTrigger>
      </TooltipInfo>

      <DropdownMenuContent align="end" className="w-48">
        {/* ✅ Only Excel export via API */}
        <DropdownMenuItem
          onClick={handleExportExcel}
          className="cursor-pointer"
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          {isExporting ? 'Exporting...' : 'Export as Excel'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
