import {
  LensProvider,
  appId,
  production,
  type LensConfig,
} from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { publicProvider } from "wagmi/providers/public";

const { publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai, polygon],
  [publicProvider()]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
  connectors: [
    new InjectedConnector({
      options: {
        shimDisconnect: false,
      },
    }),
  ],
});

const lensConfig: LensConfig = {
  appId: appId("aperturs"),
  sources: [appId("aperturs")],
  bindings: wagmiBindings(),
  environment: production,
};

export default function Lenswrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig config={config}>
      <LensProvider config={lensConfig}>{children}</LensProvider>
    </WagmiConfig>
  );
}
