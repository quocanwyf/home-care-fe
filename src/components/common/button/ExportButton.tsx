import React from 'react';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  type ExportData,
  type ExportOptions,
  useExport,
} from '@/hooks/common/useExport';

import TooltipInfo from '../primitives/TooltipInfo';

interface ExportButtonProps {
  data: ExportData;
  options?: ExportOptions;
  onExportComplete?: (success: boolean, message: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'default' | 'secondary' | 'ghost';
  disabled?: boolean;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  data,
  options = {},
  onExportComplete,
  className = '',
  size = 'sm',
  variant = 'outline',
  disabled = false,
}) => {
  const { isExporting, handleExport } = useExport();

  const onExport = async (format: 'csv' | 'excel' | 'pdf') => {
    const result = await handleExport(format, data, options);

    if (onExportComplete) {
      onExportComplete(result.success, result.message);
    }
  };

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
        <DropdownMenuItem
          onClick={() => onExport('csv')}
          className="cursor-pointer"
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onExport('excel')}
          className="cursor-pointer"
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onExport('pdf')}
          className="cursor-pointer"
          disabled={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;
