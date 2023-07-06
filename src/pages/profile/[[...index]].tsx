import { UserProfile } from "@clerk/nextjs";
import { ReactElement } from "react";
import { Layout } from "~/components";

const UserProfilePage = () => (
    <div className="w-full flex justify-center">
  <UserProfile path="/profile" routing="path" 
  />
  </div>
  );

export default UserProfilePage;


UserProfilePage.getLayout = function getLayout(page: ReactElement) {
    return (
      <Layout> 
        {page}
      </Layout>
    )
  }