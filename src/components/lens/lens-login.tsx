import { useWalletLogin } from "@lens-protocol/react-web";
import { toast } from "react-hot-toast";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export function LensLoginButton() {
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();
    if (connector instanceof InjectedConnector) {
      const walletClient = await connector.getWalletClient();
      await login({
        address: walletClient.account.address,
      });
    }

    if (loginError) {
      toast.error(loginError.message);
    }
  };
  return (
    <div>
      {/* {loginError && <p>{loginError.message}</p>} */}
      <button
        className="btn btn-primary w-full text-white"
        disabled={isLoginPending}
        onClick={onLoginClick}
      >
        Log in
      </button>
    </div>
  );
}
