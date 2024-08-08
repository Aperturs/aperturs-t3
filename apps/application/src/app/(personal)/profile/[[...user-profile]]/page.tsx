import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="mx-10 justify-center">
    {/* <AccountTabs /> */}
    <section className="flex w-full justify-center">
      <UserProfile
        path="/profile"
        routing="path"
        appearance={{
          variables: {
            borderRadius: "0.25rem",
          },
          elements: {
            card: "shadow-none",
            navbar: "hidden",
            navbarMobileMenuButton: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            width: "w-full",
          },
        }}
      />
    </section>
  </div>
);

export default UserProfilePage;
