import { UserProfile } from "@clerk/nextjs";
import { type ReactElement } from "react";
import { Layout } from "~/components";

const UserProfilePage = () => (
  <div className="flex w-full justify-center">
    <UserProfile path="/profile" routing="path" />
  </div>
);

export default UserProfilePage;

UserProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
