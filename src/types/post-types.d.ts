import { ProfileOwnedByMe } from "@lens-protocol/react-web"

interface Tweet {
    id:number,
    text:string
}

interface SelectedSocial  {
  lensProfile?: ProfileOwnedByMe
  id:number ,
  type:string
}


 