import type { SelectSingleEventHandler } from "react-day-picker";
import * as React from "react";
import { addHours } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import { DateTime } from "luxon";

import { Button } from "@aperturs/ui/button";
import { Calendar } from "@aperturs/ui/calendar";
import { Input } from "@aperturs/ui/input";
import { Label } from "@aperturs/ui/label";
import { cn } from "@aperturs/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@aperturs/ui/popover";

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<
    DateTime | undefined
  >(date ? DateTime.fromJSDate(date) : undefined);

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected);
    const modifiedDay = selectedDay.set({
      hour: selectedDateTime?.hour,
      minute: selectedDateTime?.minute,
    });

    setSelectedDateTime(modifiedDay);
    setDate(modifiedDay.toJSDate());
  };

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target;
    const hours = Number.parseInt(value.split(":")[0] ?? "00", 10);
    const minutes = Number.parseInt(value.split(":")[1] ?? "00", 10);
    const modifiedDay = selectedDateTime?.set({ hour: hours, minute: minutes });
    setSelectedDateTime(modifiedDay);
    if (!modifiedDay) {
      return;
    }
    setDate(modifiedDay.toJSDate());
  };

  const footer = (
    <>
      <div className="px-4 pb-4 pt-0">
        <Label>Time</Label>
        <Input
          type="time"
          onChange={handleTimeChange}
          value={
            selectedDateTime ? selectedDateTime.toFormat("HH:mm") : undefined
          }
        />
      </div>
      {/* {!selectedDateTime && <p className="m-3">Please pick a day.</p>} */}
    </>
  );

  return (
    <Popover>
      <div className="flex w-full gap-1">
        <PopoverTrigger asChild className="z-10">
          <Button
            variant="outline"
            className={cn(
              "flex-1 justify-start  text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDateTime ? (
              selectedDateTime.toFormat("DDD HH:mm")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => {
            setDate(undefined);
            setSelectedDateTime(undefined);
          }}
          // className="py-6 "
        >
          <X />
        </Button>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={selectedDateTime ? selectedDateTime.toJSDate() : undefined}
          onSelect={handleSelect}
          initialFocus
          fromDate={new Date()}
          toDate={DateTime.now().plus({ days: 10 }).toJSDate()}
        />
        {footer}
        <div className="m-3 grid grid-cols-2 gap-1">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDateTime(DateTime.fromJSDate(addHours(new Date(), 1)));
              setDate(addHours(new Date(), 1));
            }}
          >
            in hour
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDateTime(DateTime.fromJSDate(addHours(new Date(), 6)));
              setDate(addHours(new Date(), 6));
            }}
          >
            in 6 hours
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDateTime(
                DateTime.fromJSDate(addHours(new Date(), 12)),
              );
              setDate(addHours(new Date(), 12));
            }}
          >
            in 12 hours
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedDateTime(
                DateTime.fromJSDate(addHours(new Date(), 24)),
              );
              setDate(addHours(new Date(), 24));
            }}
          >
            in 24 hours
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
