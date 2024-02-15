"use client";
import { useEffect, useState } from "react";
import QueueCard from "./queueCard";

interface IPost {
  time: string;
  type: string;
}

interface IDay {
  date: string;
  day: string;
  posts: {
    time: string;
    type: string;
  }[];
}

const queue = [
  {
    day: "Monday",
    posts: [
      {
        time: "10:15",
        type: "",
      },
      {
        time: "12:16",
        type: "",
      },
    ],
  },
  {
    day: "Tuesday",
    posts: [
      {
        time: "10:15",
        type: "",
      },
    ],
  },
  {
    day: "Wednesday",
    posts: [
      {
        time: "23:15",
        type: "",
      },
    ],
  },
  // Add more days...
];

const dayMap = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function filterTodayPosts(posts: IPost[], currentTime: string): IPost[] {
  return posts.filter((post) => post.time >= currentTime);
}

export const QueueNav = () => {
  const [filteredQueue, setFilteredQueue] = useState<IDay[]>([]);

  useEffect(() => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const currentDayIndex = currentDate.getDay();

    const availableSlots: IDay[] = [];
    let dayCount = 0;

    while (availableSlots.length < 7) {
      const nextDayIndex = (currentDayIndex + dayCount) % 7;
      const nextDay = dayMap[nextDayIndex];
      const queueDay = queue.find((day) => day.day === nextDay);
      if (queueDay) {
        const availablePosts = filterTodayPosts(
          queueDay.posts,
          dayCount === 0 ? currentTime : "00:00",
        );
        if (availablePosts.length > 0) {
          const nextDate = new Date(currentDate);
          nextDate.setDate(currentDate.getDate() + dayCount);
          const formattedDate = nextDate.toLocaleDateString();
          const dayInfo: IDay = {
            date: formattedDate,
            day:
              dayCount === 0
                ? `Today (${formattedDate})`
                : dayCount === 1
                  ? `Tomorrow (${formattedDate})`
                  : `${queueDay.day} (${formattedDate})`,
            posts: availablePosts,
          };
          availableSlots.push(dayInfo);
        }
      }

      dayCount++;
    }

    setFilteredQueue(availableSlots);
  }, []);

  return (
    <div className="w-full max-w-screen-lg">
      {/* ... existing JSX */}
      <h2 className="my-2 text-2xl font-bold">Queue</h2>
      {/* <Alert
        className="my-4"
        color="amber"
        icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
      >
        You are currently on the free plan. You can schedule tweets and threads
        up to 2 days ahead.Grab a Aperturs subscription to unlock unlimited
        scheduling, autoplugs, recurrent promotional posts and much more.
      </Alert> */}
      <div className="my-4 w-full">
        {filteredQueue.map((dayInfo) => (
          <div key={dayInfo.date} className="">
            <h3 className="pl-1 text-lg font-bold">{dayInfo.day}</h3>
            <div className="my-2 grid grid-cols-2 gap-2 ">
              {dayInfo.posts.map((post, index) => (
                <QueueCard key={index} time={post.time} type={post.type} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
