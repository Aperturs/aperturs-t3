import { type ReactElement } from "react";
import Layout from "~/components/layouts/Layout";
import AccountTabs from "~/components/profile/account/tabs";

const UserProfilePage = () => (
  <div className="mx-10 justify-center">
    <AccountTabs />
  </div>
);

export default UserProfilePage;

UserProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
