"use client";

import { Fragment, useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import CalendarComponent from "./calender";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { PostContext } from "~/components/post/postWrapper";
import { TimePicker } from "react-time-picker-typescript";
import "react-time-picker-typescript/dist/style.css";


function formatDate(date: Date): string {
  return format(date, "dd MMMM yyyy");
}
function formatTime(hours?: number, minutes?: number): string {
  if (hours === undefined || minutes === undefined) {
    return "00:00";
  }

  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}


export default function Picker() {
  const {date,setDate,} = useContext(PostContext)
  const [open, setOpen] = useState(false);
  // const [date, setDate] = useState<Date>(new Date());
  const [minutes, setminutes] = useState<number>(0);
  const [hours, sethours] = useState<number>(0);
  const formattedTime = formatTime(hours, minutes);
  console.log("mounting")
  const [value, setValue] = useState('10:00');

   const onChange = (timeValue:any) => {
      setValue(timeValue);
   }

  function handleIsPastTime(date: Date ,hours: number,minutes: number): boolean {
    // if (!date || !hours || !minutes) {
    //   return true; // Return true if any of the inputs are undefined
    // }


    const now = new Date();
    const scheduledTime = new Date(date);
    scheduledTime.setHours(hours, minutes, 0);

    // Calculate the time 10 minutes from now
    const tenMinutesFromNow = new Date(now.getTime() + 10 * 60000);

    if (scheduledTime < tenMinutesFromNow) {
      // If the scheduled time is less than present time + 10 minutes
      // Update hours, minutes, and date to 10 minutes from now
      const newScheduledTime = new Date(tenMinutesFromNow);
      const newHours = newScheduledTime.getHours();
      const newMinutes = newScheduledTime.getMinutes();

      setDate(newScheduledTime);
      sethours(newHours);
      setminutes(newMinutes);

      return false;
    }

    return true;
  }

  const handleOpen = () => {
    if(open) {
    if (!handleIsPastTime(date, hours, minutes)) {
      toast.error("Please select a time at least 10 minutes from now");
    }
    }
    setOpen(!open);
  };

  const handleConfirm = () => {
    console.log(
      `scheduled for ${formatDate(date || new Date())} at ${formatTime}`
    );
    handleOpen();
  };



  return (
    <Fragment>
      <span className="btn  btn-primary  py-2 px-8 bg-primary text-white" onClick={handleOpen}>{date ? formatDate(date) : "Pick Date"}</span>
      <Dialog open={open} handler={handleOpen} className="w-auto">
        <DialogHeader className="sm:text-sm text-xs">
          Scheduled for {date ? formatDate(date) : ""} at {formattedTime}
        </DialogHeader>
        <DialogBody divider>
          <CalendarComponent handleDate={setDate} />
          <TimePicker onChange={onChange} value={value} />

          {/* <TimePicker
            Date={date || new Date()}
            onMinuteChange={setminutes}
            onHourChange={sethours}
          /> */}
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
