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
  lensProfile?: ProfileOwnedByMe;
  id: string;
  type: string;
  name: string;
}

interface PostContent {
  id: string;
  name: string;
  socialType: SocialType;
  content: string;
}
