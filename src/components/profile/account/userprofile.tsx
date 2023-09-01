import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="flex w-full justify-center">
    <UserProfile
      appearance={{
        elements: {
          card: "shadow-none",
          navbar: "hidden",
          navbarMobileMenuButton: "hidden",
          headerTitle: "hidden",
          headerSubtitle: "hidden",
        },
      }}
    />
  </div>
);

export default UserProfilePage;
