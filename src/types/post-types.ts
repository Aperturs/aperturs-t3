export type Tweet = {
    id:number,
    text:string
}

export type SelectedSocial = {
  id:number,
  type:string
}

export  enum SocialType {
    Twitter = 'twitter',
    Linkedin = 'linkedin',
    Lens = 'lens'
}