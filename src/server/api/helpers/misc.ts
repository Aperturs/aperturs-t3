import { prisma } from "~/server/db"


export const ConnectSocial = async ({user}:{user:string}):Promise<boolean> =>{
    try {
      const accounts = await prisma.user.findUnique({
        where:{
          clerkUserId:user
        },
        select:{
          twitterTokens:true,
          linkedInTokens:true
        }
      });
      if(accounts){
      const number = accounts.linkedInTokens.length + accounts.twitterTokens.length;
      if(number<2){
        return true
      }
      return false;
    }
    return false;
    } catch (error) {
      console.error(error);
      throw error; // or handle it in some other way
    }
  }
  