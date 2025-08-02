import React, { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

export const Calendar: React.FC = () => {
  const { events, notices } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toDateString();
    return events.filter(event => event.date.toDateString() === dateString);
  };

  const getNoticesForDate = (date: Date) => {
    const dateString = date.toDateString();
    return notices.filter(notice => {
      const createdDate = notice.createdAt.toDateString();
      const expiresDate = notice.expiresAt.toDateString();
      return createdDate === dateString || expiresDate === dateString;
    });
  };

  const hasActivity = (date: Date) => {
    return getEventsForDate(date).length > 0 || getNoticesForDate(date).length > 0;
  };

  const getDaysInCalendar = () => {
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isCurrentMonth = (date: Date) => date.getMonth() === currentDate.getMonth();
  const isSelected = (date: Date) => selectedDate?.toDateString() === date.toDateString();

  const days = getDaysInCalendar();

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day headers */}
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
        
        {/* Calendar days */}
        {days.map((date, index) => {
          const hasEvents = hasActivity(date);
          
          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
                p-2 text-sm relative hover:bg-sky-50 rounded-lg transition-all duration-200 min-h-[40px] flex items-center justify-center
                ${!isCurrentMonth(date) ? 'text-gray-300' : 'text-gray-700'}
                ${isToday(date) ? 'bg-sky-500 text-white hover:bg-sky-600' : ''}
                ${isSelected(date) && !isToday(date) ? 'bg-sky-100 text-sky-900' : ''}
                ${hasEvents && !isToday(date) && !isSelected(date) ? 'bg-blue-50' : ''}
              `}
            >
              {date.getDate()}
              {hasEvents && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sky-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-4 p-4 bg-sky-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
            <CalendarIcon className="w-4 h-4 text-sky-600" />
            <span>{selectedDate.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </h4>
          
          <div className="space-y-2">
            {getEventsForDate(selectedDate).map(event => (
              <div key={event.id} className="p-3 bg-white rounded border-l-4 border-blue-500">
                <p className="font-medium text-gray-900">{event.title}</p>
                <p className="text-sm text-gray-600">{event.description}</p>
                <span className="inline-block mt-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full capitalize">
                  {event.type}
                </span>
              </div>
            ))}
            
            {getNoticesForDate(selectedDate).map(notice => (
              <div key={notice.id} className="p-3 bg-white rounded border-l-4 border-sky-500">
                <p className="font-medium text-gray-900">{notice.title}</p>
                <p className="text-sm text-gray-600 line-clamp-2">{notice.content}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">By {notice.author}</span>
                  <span className="inline-block px-2 py-1 bg-sky-100 text-sky-800 text-xs rounded-full capitalize">
                    {notice.category}
                  </span>
                </div>
              </div>
            ))}
            
            {!hasActivity(selectedDate) && (
              <p className="text-gray-500 text-sm">No events or notices for this date.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};