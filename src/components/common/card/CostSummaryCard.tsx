import { useState } from 'react';

import { ChevronDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CostSummaryCard({}) {
  const [selectedDiscount, setSelectedDiscount] = useState('0%');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const discountOptions = ['0%', '5%', '10%', '15%', '20%', '25%'];

  const totalCost = 15000000; // 15 triệu VND
  const materialCost = 8500000; // 8.5 triệu VND

  const discountValue = parseInt(selectedDiscount.replace('%', '')) / 100;
  const finalCost = totalCost * (1 - discountValue);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <Card className="w-full">
      <CardContent className="mx-auto w-140 space-y-4">
        {/* Tổng chi phí */}
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600">Tổng chi phí:</span>
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
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600">Tổng chi phí NGV:</span>
          <span className="font-medium text-gray-600">
            {formatCurrency(materialCost)}
          </span>
        </div>

        {/* Dropdown Discount */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Giảm giá:</span>

          <div className="relative flex items-center gap-4">
            <span className="text-red-600">
              -{formatCurrency(totalCost * discountValue)}
            </span>

            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 rounded-md border border-gray-400 bg-white px-3 py-1.5 hover:bg-gray-50"
            >
              <span className="font-medium text-red-600">
                {selectedDiscount}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 z-10 mt-1 w-20 rounded-md border border-gray-200 bg-white shadow-lg">
                {discountOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedDiscount(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                      selectedDiscount === option
                        ? 'bg-blue-50 font-medium text-red-600'
                        : 'text-gray-700'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
