import { useWalletLogout } from "@lens-protocol/react-web";

export function LogoutButton() {
  const { execute: logout, isPending } = useWalletLogout();

  return (
    <button
      className="btn btn-primary my-4 w-full text-white "
      disabled={isPending}
      onClick={logout}
    >
      Log out
    </button>
  );
}
