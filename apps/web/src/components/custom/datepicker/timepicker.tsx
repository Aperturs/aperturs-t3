import React, { useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface TimePickerProps {
  onHourChange: (time: number) => void;
  onMinuteChange: (time: number) => void;
  Date: Date;
}

const generateHours = () => {
  const hours = [];
  for (let hour = 0; hour < 24; hour++) {
    const formattedHour = hour.toString().padStart(2, "0");
    hours.push(formattedHour);
  }
  return hours;
};

const generateMinutes = () => {
  const minutes = [];
  for (let minute = 0; minute < 60; minute++) {
    const formattedMinute = minute.toString().padStart(2, "0");
    minutes.push(formattedMinute);
  }
  return minutes;
};

const hours = generateHours();
const minutes = generateMinutes();

const TimePicker: React.FC<TimePickerProps> = ({ onMinuteChange }) => {
  const [selectedMinute, setSelectedMinute] = useState(minutes[0]);

  return (
    <div className="flex items-center space-x-4">
      <Select
      // value={selectedHour}
      // onChange={(e) => {
      //   if(e){
      //   setSelectedHour(e.target || 0)
      //   onHourChange(parseInt(e.target.value))
      //   }
      // }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {hours.map((hour, index) => (
            <SelectItem key={index} value={hour}>
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <select
        value={selectedMinute}
        onChange={(e) => {
          setSelectedMinute(e.target.value);
          onMinuteChange(parseInt(e.target.value));
        }}
        className="w-auto rounded-lg bg-white py-2 pl-3 pr-6 text-sm text-gray-900 shadow-md focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {minutes.map((minute, index) => (
          <option key={index} value={minute}>
            {minute}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TimePicker;
