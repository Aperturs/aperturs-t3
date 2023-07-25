
interface Tweet {
    id:number,
    text:string
}

 interface SelectedSocial  {
  lensProfile?: ProfileOwnedByMe
  id:number ,
  type:string
}

const SocialType =  {
  Twitter: "twitter",
  Linkedin: "linkedin",
  Lens: "lens",
} as const

type ObjectValue<T> = T[keyof T]
type SOCIAL_TYPES = ObjectValue<typeof SocialType>

 