import { useMemo, useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { calculateOrderCost } from '@/helpers/calculate-total-cost';
import { formatCurrency } from '@/helpers/format-currency';
import type { OrderFormData } from '@/types/params/order-params';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@radix-ui/react-popover';

interface DiscountOption {
  id: string;
  label: string;
  value: number;
  type: 'percentage' | 'fixed';
  title: string;
}

export default function CostSummaryCard({
  onUpdateFormData,
  availableDiscounts,
  dataForCalculate,
}: {
  onUpdateFormData: (newData: Partial<OrderFormData>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableDiscounts: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForCalculate: any;
}) {
  const result = calculateOrderCost(dataForCalculate);

  const [selectedDiscountId, setSelectedDiscountId] = useState('no-discount');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const discountOptions = useMemo((): DiscountOption[] => {
    const options: DiscountOption[] = [
      {
        id: 'no-discount',
        label: '0%',
        value: 0,
        type: 'percentage',
        title: 'No discount',
      },
    ];

    if (availableDiscounts && Array.isArray(availableDiscounts)) {
      availableDiscounts.forEach((discount) => {
        const now = new Date();
        const startDate = new Date(discount.applyStartDate);
        const endDate = new Date(discount.applyEndDate);

        if (now >= startDate && now <= endDate) {
          if (discount.rate <= 100) {
            // Likely percentage
            options.push({
              id: discount._id,
              label: `${discount.rate}%`,
              value: discount.rate,
              type: 'percentage',
              title: discount.title,
            });
          } else {
            // Fixed amount (like 50k)
            options.push({
              id: discount._id,
              label: `${formatCurrency(discount.rate)}`,
              value: discount.rate,
              type: 'fixed',
              title: discount.title,
            });
          }
        }
      });
    }

    return options;
  }, [availableDiscounts]);

  const selectedDiscount = useMemo(() => {
    return (
      discountOptions.find((option) => option.id === selectedDiscountId) ||
      discountOptions[0]
    );
  }, [selectedDiscountId, discountOptions]);

  const totalCost = result.totalCost || 0;

  const { discountAmount, finalCost } = useMemo(() => {
    let discountAmount = 0;
    let finalCost = totalCost;

    if (selectedDiscount.type === 'percentage') {
      discountAmount = totalCost * (selectedDiscount.value / 100);
      finalCost = totalCost - discountAmount;
    } else if (selectedDiscount.type === 'fixed') {
      discountAmount = Math.min(selectedDiscount.value, totalCost);
      finalCost = totalCost - discountAmount;
    }

    return {
      discountAmount: Math.max(0, discountAmount),
      finalCost: Math.max(0, finalCost),
    };
  }, [totalCost, selectedDiscount]);

  const handleDiscountChange = (optionId: string) => {
    setSelectedDiscountId(optionId);
    setIsPopoverOpen(false);

    const option = discountOptions.find((opt) => opt.id === optionId);
    if (option && onUpdateFormData) {
      let calculatedDiscountAmount = 0;
      let calculatedFinalCost = totalCost;

      if (option.type === 'percentage') {
        calculatedDiscountAmount = totalCost * (option.value / 100);
        calculatedFinalCost = totalCost - calculatedDiscountAmount;
      } else if (option.type === 'fixed') {
        calculatedDiscountAmount = Math.min(option.value, totalCost);
        calculatedFinalCost = totalCost - calculatedDiscountAmount;
      }

      onUpdateFormData({
        selectedDiscountId: optionId,
        totalCost: calculatedFinalCost,
        detailCost: result.detailCost,
      });
    }
  };

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent className="mx-auto w-140 space-y-4">
        {/* Tổng chi phí */}
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-600">Total cost order:</span>
          <span>
            {discountAmount === 0 ? (
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

        {/* Dropdown Discount */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Discounts:</span>

          <div className="flex items-center gap-4">
            <span className="text-red-600">
              -{formatCurrency(discountAmount)}
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
                    {selectedDiscount.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isPopoverOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="my-2 max-h-60 max-w-60 overflow-auto"
                align="center"
                side="bottom"
              >
                <div className="space-y-1 rounded-md border bg-white">
                  {discountOptions.map((option) => (
                    <Button
                      key={option.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDiscountChange(option.id)}
                      className={`w-full cursor-pointer justify-start px-3 py-6 text-sm`}
                    >
                      <div className="flex w-full flex-col items-start">
                        <div className="flex w-full justify-between">
                          <span
                            className={`${
                              selectedDiscountId === option.id
                                ? 'font-medium text-red-600 hover:text-red-600'
                                : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </span>
                        </div>
                        <span
                          className={`w-full text-left text-xs ${
                            selectedDiscountId === option.id
                              ? 'font-medium text-red-600 hover:text-red-600'
                              : 'text-gray-700'
                          }`}
                        >
                          {option.title}
                        </span>
                      </div>
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
