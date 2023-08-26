import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@material-tailwind/react";
import { format } from "date-fns";
import { Fragment, useState } from "react";
import { toast } from "react-hot-toast";
import { useStore } from "~/store/post-store";
import CalendarComponent from "./calender";

function formatDate(date: Date): string {
  return format(date, "dd MMMM yyyy");
}

export default function Picker() {
  // const { date, setDate } = useContext(PostContext);
  const date = useStore((state) => state.date);
  const setDate = useStore((state) => state.setDate);
  const time = useStore((state) => state.time);
  const setTime = useStore((state) => state.setTime);

  const [open, setOpen] = useState(false);

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTime(event.target.value);
  };

  function handleIsPastTime(date: Date, value: string): boolean {
    if (!date || !value) {
      return true; // Return true if any of the inputs are undefined
    }
    const now = new Date();
    const scheduledTime = new Date(date);
    const [hours, minutes] = value.split(":");
    scheduledTime.setHours(Number(hours), Number(minutes), 0);

    // Calculate the time 20 minutes from now
    const tenMinutesFromNow = new Date(now.getTime() + 20 * 60000);

    if (scheduledTime < tenMinutesFromNow) {
      // If the scheduled time is less than present time + 10 minutes
      // Update the date to 10 minutes from now
      const newScheduledTime = new Date(tenMinutesFromNow);
      setDate(newScheduledTime);
      const hours = newScheduledTime.getHours();
      const minutes = newScheduledTime.getMinutes();
      setTime(`${hours}:${minutes}`);
      toast(`date updated to ${formatDate(newScheduledTime)} at ${time}`);
      return false;
    }

    return true;
  }

  const handleOpen = () => {
    if (open) {
      if (date) {
        if (!handleIsPastTime(date, time)) {
          toast.error("Please select a time at least 20 minutes from now");
        }
      }
    }
    setOpen(!open);
  };

  const handleConfirm = () => {
    handleOpen();
  };

  return (
    <Fragment>
      <span
        className="btn-primary btn bg-primary font-medium  normal-case  text-white"
        onClick={handleOpen}
      >
        {date ? formatDate(date) : "Pick Date"}
      </span>
      <Dialog open={open} handler={handleOpen} className="w-auto">
        <DialogHeader className="text-xs sm:text-sm">
          Scheduled for {date ? formatDate(date) : ""} at {time}
        </DialogHeader>
        <DialogBody divider>
          <CalendarComponent handleDate={setDate} />
          <input
            type="time"
            value={time}
            onChange={onChange}
            className="time-input rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button variant="gradient" color="green" onClick={handleConfirm}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}
