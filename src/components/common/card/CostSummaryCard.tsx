import { useEffect, useMemo, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { calculateOrderCost } from '@/helpers/calculate-total-cost';
import { formatCurrency } from '@/helpers/format-currency';
import type { OrderFormSchemaType } from '@/types/schema/order-form-schema-type';
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

interface CostSummaryCardProps {
  form: UseFormReturn<OrderFormSchemaType>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  availableDiscounts: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataForCalculate: any;
}

export default function CostSummaryCard({
  form,
  availableDiscounts,
  dataForCalculate,
}: CostSummaryCardProps) {
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;
  const { t } = useLanguage();
  const currentTotalCost = watch('totalCost');
  const currentDetailCost = watch('detailCost');

  const result = calculateOrderCost(dataForCalculate);
  const [selectedDiscountId, setSelectedDiscountId] = useState('no-discount');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  //   Fix 1: Separate useEffect for base cost update only
  useEffect(() => {
    if (result && result.totalCost > 0) {
      // Only update if the calculated cost is different from current form value
      // AND no discount is applied
      if (
        selectedDiscountId === 'no-discount' &&
        result.totalCost !== currentTotalCost
      ) {
        setValue('totalCost', result.totalCost, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }

      // Always update base detail cost if different
      if (
        JSON.stringify(result.detailCost) !== JSON.stringify(currentDetailCost)
      ) {
        setValue('detailCost', result.detailCost || [], {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [result?.totalCost, selectedDiscountId]); //  Remove setValue from deps

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
            options.push({
              id: discount._id,
              label: `${discount.rate}%`,
              value: discount.rate,
              type: 'percentage',
              title: discount.title,
            });
          } else {
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

  const baseTotalCost = result?.totalCost || 0;

  const { discountAmount, finalCost } = useMemo(() => {
    let discountAmount = 0;
    let finalCost = baseTotalCost;

    if (selectedDiscount && selectedDiscount.type === 'percentage') {
      discountAmount = baseTotalCost * (selectedDiscount.value / 100);
      finalCost = baseTotalCost - discountAmount;
    } else if (selectedDiscount && selectedDiscount.type === 'fixed') {
      discountAmount = Math.min(selectedDiscount.value, baseTotalCost);
      finalCost = baseTotalCost - discountAmount;
    }

    return {
      discountAmount: Math.max(0, discountAmount),
      finalCost: Math.max(0, finalCost),
    };
  }, [baseTotalCost, selectedDiscount]);

  //   Fix 2: Separate useEffect for discount updates with proper conditions
  useEffect(() => {
    if (baseTotalCost > 0 && finalCost !== currentTotalCost) {
      // Update final cost in form only if different
      setValue('totalCost', finalCost, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Update detail cost with discount info
      const baseDetailCost = result?.detailCost || [];
      let updatedDetailCost = [...baseDetailCost];

      // Add discount info if discount is applied
      if (selectedDiscountId !== 'no-discount' && discountAmount > 0) {
        updatedDetailCost.push({
          type: 'discount',
          description: selectedDiscount.title,
          discountType: selectedDiscount.type,
          discountValue: selectedDiscount.value,
          discountAmount: discountAmount,
          cost: -discountAmount,
          appliedAt: new Date().toISOString(),
        });
      }

      setValue('detailCost', updatedDetailCost, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [selectedDiscountId, discountAmount]); //   Only depend on discount changes

  const handleDiscountChange = (optionId: string) => {
    setSelectedDiscountId(optionId);
    setIsPopoverOpen(false);
  };

  const totalCostError = errors.totalCost?.message;

  return (
    <Card className="w-full overflow-x-auto">
      <CardContent className="mx-auto w-140 space-y-4">
        {/* Total cost display with validation error */}
        <div className="flex justify-between border-b border-gray-200 pb-2">
          <span className="text-gray-600">{t('orders.totalCostOrder')}:</span>
          <div className="flex flex-col items-end">
            <span>
              {discountAmount === 0 ? (
                <span className="text-blue-500">
                  {formatCurrency(baseTotalCost)}
                </span>
              ) : (
                <>
                  <span className="mr-4 text-gray-500 line-through">
                    {formatCurrency(baseTotalCost)}
                  </span>
                  <span className="font-semibold text-blue-500">
                    {formatCurrency(finalCost)}
                  </span>
                </>
              )}
            </span>
            {totalCostError && (
              <span className="mt-1 text-xs text-red-500">
                {totalCostError}
              </span>
            )}
          </div>
        </div>

        {/* Dropdown Discount */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">{t('orders.discounts')}:</span>

          <div className="flex items-center gap-4">
            <span className="text-red-600">
              -{formatCurrency(discountAmount)}
            </span>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 px-3 py-1.5"
                  disabled={!dataForCalculate || baseTotalCost <= 0}
                >
                  <span className="font-medium text-red-600">
                    {selectedDiscount?.label || '0%'}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                      isPopoverOpen ? 'rotate-180' : ''
                    }`}
                  />
                </Button>
              </PopoverTrigger>

              <PopoverContent
                className="z-50 my-2 max-h-60 max-w-60 overflow-auto"
                align="center"
                side="bottom"
              >
                <div className="space-y-1 rounded-md border bg-white shadow-lg">
                  {discountOptions.map((option) => (
                    <Button
                      key={option.id}
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDiscountChange(option.id)}
                      className={`w-full cursor-pointer justify-start px-3 py-6 text-sm hover:bg-gray-50 ${
                        selectedDiscountId === option.id ? 'bg-red-50' : ''
                      }`}
                    >
                      <div className="flex w-full flex-col items-start">
                        <div className="flex w-full justify-between">
                          <span
                            className={`${
                              selectedDiscountId === option.id
                                ? 'font-medium text-red-600'
                                : 'text-gray-700'
                            }`}
                          >
                            {option.label}
                          </span>
                          {selectedDiscountId === option.id && (
                            <span className="text-red-600">✓</span>
                          )}
                        </div>
                        <span
                          className={`w-full text-left text-xs ${
                            selectedDiscountId === option.id
                              ? 'font-medium text-red-600'
                              : 'text-gray-500'
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
