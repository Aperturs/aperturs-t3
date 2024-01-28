interface Tweet {
  id: number;
  text: string;
}

interface Thread {
  threadId: 0;
  thread: Tweet[];
}
interface IThreadVersions {
  threadVersions: Thread[];
}

interface PostContent {
  id: string;
  name: string;
  socialType: string;
  content: string;
  unique: boolean;
  files: File[] | null;
}
