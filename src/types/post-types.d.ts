
interface Tweet {
    id:number,
    text:string
}

interface SelectedSocial  {
  lensProfile?: ProfileOwnedByMe
  id:number ,
  type:string
}

interface PostContent {
  socialType: SocialType,
  content: string
}
 