export const formatCurrency = (amount: number | undefined) => {
  if (amount === undefined) return '';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
