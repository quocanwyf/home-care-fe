// src/components/common/TooltipInfo.tsx
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function TooltipInfo({
  content,
  children,
  side = 'top',
  align = 'center',
  delay = 300,
}: {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
}) {
  return (
    <Tooltip delayDuration={delay}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side={side} align={align}>
        <p className="text-sm font-medium">{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
