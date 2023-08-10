interface Tweet {
  id: number;
  text: string;
}

interface SelectedSocial {
  lensProfile?: ProfileOwnedByMe;
  id: number;
  type: string;
  name: string;
}

interface PostContent {
  id: number;
  name: string;
  socialType: SocialType;
  content: string;
}
