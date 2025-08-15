export const addHoursToTime = (time: string, hoursToAdd: number) => {
  if (!time) return '';
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour + hoursToAdd, minute);
  return date.toTimeString().slice(0, 5); // HH:mm
};

export const isEvenHourInterval = (
  startTime: string,
  endTime: string
): boolean => {
  if (!startTime || !endTime) return false;

  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startTotalMinutes = startHour * 60 + startMinute;
  const endTotalMinutes = endHour * 60 + endMinute;

  const diffMinutes = endTotalMinutes - startTotalMinutes;
  const diffHours = diffMinutes / 60;

  // Check if difference is whole number (1h, 2h, 3h, etc.)
  return diffHours > 0 && Number.isInteger(diffHours);
};
