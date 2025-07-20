import StatusFilterDropdown from './StatusFilterDropdown';

interface PageFooterProps {
  status: string;
  onStatusFilterChange?: (status: string) => void;
  className?: string;
}

export default function PageFooter({
  status,
  onStatusFilterChange,
  className = '',
}: PageFooterProps) {
  return (
    <div
      className={`mt-6 flex flex-col items-center justify-between gap-4 md:flex-row ${className}`}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Filter by status:</span>
        <StatusFilterDropdown
          status={status}
          onChange={onStatusFilterChange || (() => {})}
        />
      </div>
    </div>
  );
}
