import { useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

import { Button } from "@aperturs/ui/button";
import { Calendar } from "@aperturs/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@aperturs/ui/dialog";

import { useStore } from "~/store/post-store";

function formatDate(date: Date): string {
  return format(date, "dd MMMM yyyy");
}

export default function Picker() {
  // const { date, setDate } = useContext(PostContext);
  const date = useStore((state) => state.date);
  const setDate = useStore((state) => state.setDate);
  const time = useStore((state) => state.time);
  const setTime = useStore((state) => state.setTime);
  const [canConfirm, setCanConfirm] = useState(false);
  const [displayMessage, setDisplayMessage] = useState("");

  const [open, setOpen] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  const handleIsPastTime = useCallback(
    (localdate: Date, localvalue: string): boolean => {
      const now = new Date();
      const scheduledTime = new Date(localdate);
      const [hours, minutes] = localvalue.split(":");
      scheduledTime.setHours(Number(hours), Number(minutes), 0);

      // Calculate the time 20 minutes from now
      const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);

      if (scheduledTime < tenMinutesFromNow) {
        // If the scheduled time is less than present time + 10 minutes
        // Update the date to 10 minutes from now
        // const newScheduledTime = new Date(tenMinutesFromNow);
        // setDate(newScheduledTime);
        // const hours = newScheduledTime.getHours();
        // const minutes = newScheduledTime.getMinutes();
        // setTime(`${hours}:${minutes}`);
        // toast(`date updated to ${formatDate(newScheduledTime)} at ${time}`);
        setDisplayMessage("Please select a time at least 10 minutes from now");
        canConfirm && setCanConfirm(false);
        return false;
      }
      setCanConfirm(true);
      return true;
    },
    [canConfirm],
  );
  useEffect(() => {
    if (date && time) {
      handleIsPastTime(date, time);
    } else {
      setCanConfirm(false);
      setDisplayMessage("Please select a date and time");
    }
  }, [date, handleIsPastTime, time]);

  const handleOpen = () => {
    console.log("open", open);
    if (!open) {
      setOpen(true);
    }
    if (open) {
      setDate(undefined);
      setTime(null);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setDate(undefined);
    setTime(null);
    setOpen(false);
  };

  const handleConfirm = () => {
    // handleOpen();
    if (open) {
      if (date && time) {
        if (!handleIsPastTime(date, time)) {
          toast.error("Please select a time at least 10 minutes from now");
        }
        setCanConfirm(true);
        setOpen(false);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={handleOpen} className="py-6">
          {date ? formatDate(date) : "Pick Date"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="text-xs sm:text-sm">
          Scheduled for {date ? formatDate(date) : ""} at {time}
        </DialogHeader>
        <p className="w-full text-center text-xs font-bold text-red-700 sm:text-sm">
          {displayMessage}
        </p>
        {/* <CalendarComponent handleDate={setDate} /> */}
        <Calendar className="w-full" />
        <input
          type="time"
          value={time ?? ""}
          onChange={onChange}
          className="time-input rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              color="red"
              onClick={handleCancel}
              className="mr-1"
            >
              <span>Cancel</span>
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              color="green"
              disabled={!canConfirm}
              onClick={handleConfirm}
            >
              <span>Confirm</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
