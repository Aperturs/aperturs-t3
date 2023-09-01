import { type ReactElement } from "react";
import { Layout } from "~/components";
import AccountTabs from "~/components/profile/account/tabs";

const UserProfilePage = () => <AccountTabs />;

export default UserProfilePage;

UserProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
