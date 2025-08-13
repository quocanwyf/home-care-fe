import type { DateRange } from 'react-day-picker';

import type { QuickSelectionMode } from '@/components/common/date-picker/DateRangePicker';
import { Button } from '@/components/ui/button';

export const renderQuickSelections = (
  quickSelectionMode: QuickSelectionMode,
  handleSelect: (range: DateRange) => void
) => {
  const today = new Date();

  if (quickSelectionMode === 'none') {
    return null;
  }
  if (quickSelectionMode === 'past') {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const range = { from: today, to: today };
            handleSelect(range);
          }}
        >
          Hôm nay
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            const range = { from: yesterday, to: yesterday };
            handleSelect(range);
          }}
        >
          Hôm qua
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 6);
            const range = { from: weekAgo, to: today };
            handleSelect(range);
          }}
        >
          7 ngày qua
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const monthAgo = new Date(today);
            monthAgo.setDate(today.getDate() - 29);
            const range = { from: monthAgo, to: today };
            handleSelect(range);
          }}
        >
          30 ngày qua
        </Button>
      </>
    );
  } else {
    // Future mode
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const range = { from: today, to: today };
            handleSelect(range);
          }}
        >
          Hôm nay
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const range = { from: tomorrow, to: tomorrow };
            handleSelect(range);
          }}
        >
          Hôm sau
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 6);
            const range = { from: today, to: nextWeek };
            handleSelect(range);
          }}
        >
          7 ngày tới
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const nextMonth = new Date(today);
            nextMonth.setDate(today.getDate() + 29);
            const range = { from: today, to: nextMonth };
            handleSelect(range);
          }}
        >
          30 ngày tới
        </Button>
      </>
    );
  }
};

export default renderQuickSelections;
