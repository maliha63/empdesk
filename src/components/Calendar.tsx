import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  events?: Record<string, number>; // date -> event count
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar({
  selectedDate = new Date(),
  onDateSelect,
  events = {},
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(selectedDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month days
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    });
  }

  // Next month days
  const remainingDays = 42 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    days.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getEventCount = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return events[dateStr] || 0;
  };

  return (
    <div className="bg-white dark:bg-[#111827] border border-[var(--border)] rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f2a3d] transition-colors"
        >
          <ChevronLeft size={20} className="text-[var(--text-muted)]" />
        </button>
        <h2 className="text-lg font-semibold text-[var(--text-primary)]">
          {MONTHS[month]} {year}
        </h2>
        <button
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1f2a3d] transition-colors"
        >
          <ChevronRight size={20} className="text-[var(--text-muted)]" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-[var(--text-muted)] py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((dayObj, idx) => {
          const eventCount = getEventCount(dayObj.date);
          const isToday =
            dayObj.date.toDateString() === new Date().toDateString();
          const isSelected =
            dayObj.date.toDateString() === selectedDate.toDateString();

          return (
            <button
              key={idx}
              onClick={() => onDateSelect?.(dayObj.date)}
              className={`
                relative aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-medium transition-all
                ${
                  isToday
                    ? "bg-blue-500 text-white font-bold"
                    : isSelected
                      ? "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-2 border-blue-500"
                      : dayObj.isCurrentMonth
                        ? "text-[var(--text-primary)] hover:bg-gray-100 dark:hover:bg-[#1f2a3d]"
                        : "text-[var(--text-muted)] bg-gray-50 dark:bg-[#0f172a]"
                }
              `}
            >
              <span>{dayObj.day}</span>
              {eventCount > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center absolute bottom-1">
                  {eventCount > 9 ? "9+" : eventCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
