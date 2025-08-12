const RendarCalendar = ({
  currentYear,
  currentMonth,
  currentDate, //ngay hien tai ngay hom nay
  value, //ngay dc chon
  handleDateSelect,
}: {
  currentYear: number;
  currentMonth: number;
  currentDate: Date;
  value: string | undefined;
  handleDateSelect: (day: number) => void;
}) => {
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday

  const calendarDays = [];

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="p-2"></div>);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isToday =
      day === currentDate.getDate() &&
      currentMonth === currentDate.getMonth() &&
      currentYear === currentDate.getFullYear();

    const isSelected =
      value &&
      new Date(value).getDate() === day &&
      new Date(value).getMonth() === currentMonth &&
      new Date(value).getFullYear() === currentYear;

    calendarDays.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDateSelect(day)}
        className={`rounded-md p-2 text-sm transition-colors hover:bg-indigo-50 ${isToday ? 'bg-indigo-100 font-semibold text-indigo-700' : ''} ${isSelected ? 'bg-indigo-600 text-white' : 'text-gray-700'} hover:text-indigo-600`}
      >
        {day}
      </button>
    );
  }

  return calendarDays;
};
export default RendarCalendar;
