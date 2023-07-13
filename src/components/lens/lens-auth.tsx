import { useActiveWallet } from '@lens-protocol/react-web';
import { MyProfile } from './lens-active-profile';
import { LogoutButton } from './lensLogout';
import { LensLoginButton } from './lens-login';


 export default function LensAuthenticate() {
  
  const { data: wallet, loading } = useActiveWallet();
  

  if (loading) {
    return <p>Loading...</p>;
  }

  if (wallet) {
    return (
    <>
    <p>You are logged-in with {wallet.address}</p>
    <MyProfile />
    <LogoutButton />
    </>
    );
  } 


  return (
  <>
  <LensLoginButton />
  <p className='my-2'>You are logged-out</p>
  </>
  );
}