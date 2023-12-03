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

interface SelectedSocial {
  id: string;
  type: string;
  name: string;
}

interface ContentSocialSelected {
  id: string;
  platform: string;
}

interface PostContent {
  id: string;
  name: string;
  socialType: string;
  content: string;
}
