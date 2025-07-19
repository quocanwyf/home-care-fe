import { Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

const TableHeader = ({
  title,
  onAdd,
  addButtonText = 'Add',
}: {
  title: string;
  onAdd?: () => void;
  addButtonText?: string;
}) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white p-6">
      <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
      {onAdd && (
        <Button
          onClick={onAdd}
          className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {addButtonText}
        </Button>
      )}
    </div>
  );
};

export default TableHeader;
