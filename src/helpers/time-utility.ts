export const addHoursToTime = (time: string, hoursToAdd: number) => {
  if (!time) return '';
  const [hour, minute] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(hour + hoursToAdd, minute);
  return date.toTimeString().slice(0, 5); // HH:mm
};
