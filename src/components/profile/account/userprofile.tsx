import { UserProfile } from "@clerk/nextjs";

const UserProfilePage = () => (
  <div className="flex w-full justify-center">
    <UserProfile
      appearance={{
        baseTheme: undefined,
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
  </div>
);

export default UserProfilePage;
