'use client'
import { type FC, useEffect, useState } from 'react'
import 'react-calendar/dist/Calendar.css';
import Calendar from 'react-calendar';

interface CalendarProps {
  handleDate: (date: Date) => void
// as ISO strings
}



const CalendarComponent: FC<CalendarProps> = ({ handleDate }) => {

    const [date, setDate] = useState<Date | undefined>()
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 10);
    
  return (
    <div className='flex  flex-col items-center justify-center'>
      <p className='text-sm text-red-400'>
        we are only allowing 10 days in advance for free plan users
      </p>
        <Calendar
          minDate={minDate}
          maxDate={maxDate}
          className='REACT-CALENDAR p-2'
          view='month'
          onClickDay={(value) => {
            console.log(date)
            setDate(value)
            handleDate(value)
          }}
          
        />
      
    </div>
  )
}

export default CalendarComponent