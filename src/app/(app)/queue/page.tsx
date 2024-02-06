import { QueueNav } from "~/components/queue/queue";

export default function Queue() {
  return (
    <div className="group relative flex justify-center">
      <div className="absolute z-50 hidden  h-full w-full place-content-center bg-black bg-opacity-20 group-hover:grid">
        Comming Soon...
      </div>
      <QueueNav />
    </div>
  );
}
