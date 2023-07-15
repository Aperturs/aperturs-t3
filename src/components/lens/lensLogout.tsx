import { useWalletLogout } from '@lens-protocol/react-web';

export function LogoutButton() {
  const { execute: logout, isPending } = useWalletLogout();
  
  return (
    <button className='btn btn-primary w-full text-white my-4 ' disabled={isPending} onClick={logout}>Log out</button>
  );
}
