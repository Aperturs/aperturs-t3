import QueueCard from "./queueCard";
import { Alert } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

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
    day: 'Monday',
    posts: [
      {
        time: '10:15',
        type: 'instagram',
      },
      {
        time: '12:16',
        type: 'twitter recurring',
      },
    ],
  },
  {
    day: 'Tuesday',
    posts: [
      {
        time: '10:15',
        type: 'instagram',
      }
    ]
  },
  {
    day: 'Wednesday',
    posts: [
      {
        time: '23:15',
        type: 'instagram',
      },
    ]
  }
  // Add more days...
];


const dayMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function filterTodayPosts(posts: IPost[], currentTime: string): IPost[] {
  return posts.filter((post) => post.time >= currentTime);
}


export const QueueNav = () => {
  const [filteredQueue, setFilteredQueue] = useState<IDay[]>([]);


  useEffect(() => {
    const currentDate = new Date();
    const currentTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const currentDayIndex = currentDate.getDay();
  
    const availableSlots: IDay[] = [];
    let dayCount = 0;
  
    while (availableSlots.length < 7) {
      const nextDayIndex = (currentDayIndex + dayCount) % 7;
      const nextDay = dayMap[nextDayIndex];
      const queueDay = queue.find((day) => day.day === nextDay);
      if (queueDay) {
        const availablePosts = filterTodayPosts(queueDay.posts, (dayCount === 0) ? currentTime : '00:00');
        if (availablePosts.length > 0) {
          const nextDate = new Date(currentDate);
          nextDate.setDate(currentDate.getDate() + dayCount);
          const formattedDate = nextDate.toLocaleDateString();
          const dayInfo: IDay = {
            date: formattedDate,
            day: (dayCount === 0) ? `Today (${formattedDate})` : (dayCount === 1) ? `Tomorrow (${formattedDate})` : `${queueDay.day} (${formattedDate})`,
            posts: availablePosts,
          };
          availableSlots.push(dayInfo);
        }
      }
  
      dayCount++;
    }
  
    setFilteredQueue(availableSlots);
  }, [queue]);
  
  
  
  
  

  return (
    <div className="max-w-screen-lg">
      {/* ... existing JSX */}
      <h2 className="text-2xl my-2 font-bold">Queue</h2>
      <Alert
        className="my-4"
        color="amber"
        icon={<InformationCircleIcon strokeWidth={2} className="h-6 w-6" />}
      >
        You are currently on the free plan. You can schedule tweets and threads
        up to 2 days ahead.Grab a Aperturs subscription to unlock unlimited
        scheduling, autoplugs, recurrent promotional posts and much more.
      </Alert>
      <div className="my-4">
        {filteredQueue.map((dayInfo) => (
          <div key={dayInfo.date} className="">
            <h3 className="font-bold text-lg pl-1">{dayInfo.day}</h3>
            <div className="grid grid-cols-2 gap-2 my-2 ">
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





