import { ProfileOwnedByMe } from "@lens-protocol/react-web"

export type Tweet = {
    id:number,
    text:string
}

export type SelectedSocial = {
  lensProfile?: ProfileOwnedByMe
  id:number ,
  type:string
}

export  enum SocialType {
    Twitter = 'twitter',
    Linkedin = 'linkedin',
    Lens = 'lens'
}