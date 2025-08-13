//formatDateToDDMMYYYY(new Date(2025, 7, 13)) // "13/08/2025"
export const formatDateToDDMMYYYY = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

//parseDDMMYYYYToDate("13/08/2025") // Date object: Wed Aug 13 2025 ...
export const parseDDMMYYYYToDate = (dateString: string): Date | null => {
  if (!dateString) return null;

  const [day, month, year] = dateString
    .split('/')
    .map((num) => parseInt(num, 10));
  if (!day || !month || !year) return null;

  return new Date(year, month - 1, day);
};
//check in past
export const isDateInPast = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};
