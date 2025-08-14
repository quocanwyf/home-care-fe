import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/helpers/format-currency';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';

export default function CostSummaryCard() {
  const [selectedDiscount, setSelectedDiscount] = useState('0%');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const discountOptions = ['0%', '5%', '10%', '15%', '20%', '25%'];

  const totalCost = 15000000;
  const materialCost = 8500000;

  const discountValue = parseInt(selectedDiscount.replace('%', '')) / 100;
  const finalCost = totalCost * (1 - discountValue);

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent className="mx-auto w-140 space-y-4">
        {/* Tổng chi phí */}
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-600">Total cost order:</span>
          <span>
            {discountValue === 0 ? (
              <span className="text-blue-500">{formatCurrency(totalCost)}</span>
            ) : (
              <>
                <span className="mr-4 text-gray-500 line-through">
                  {formatCurrency(totalCost)}
                </span>
                <span className="font-semibold text-blue-500">
                  {formatCurrency(finalCost)}
                </span>
              </>
            )}
          </span>
        </div>

        {/* Tổng chi phí NGV */}
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-600">Total cost for maids:</span>
          <span className="font-medium text-gray-600">
            {formatCurrency(materialCost)}
          </span>
        </div>

        {/* Dropdown Discount */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Discounts:</span>

          <div className="flex items-center gap-4">
            <span className="text-red-600">
              -{formatCurrency(totalCost * discountValue)}
            </span>

            {/*  Use Popover instead of manual dropdown */}
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 px-3 py-1.5"
                >
                  <span className="font-medium text-red-600">
                    {selectedDiscount}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isPopoverOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-20 p-1" align="end" side="bottom">
                <div className="space-y-1 rounded-md border bg-white">
                  {discountOptions.map((option) => (
                    <Button
                      key={option}
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedDiscount(option);
                        setIsPopoverOpen(false);
                      }}
                      className={`w-full justify-start px-3 py-2 text-sm ${
                        selectedDiscount === option
                          ? 'bg-blue-50 font-medium text-red-600'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
