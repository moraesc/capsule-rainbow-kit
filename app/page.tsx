"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  RainbowKitWalletConnectParameters,
  Wallet,
  connectorsForWallets,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider, createConfig, createConnector, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Main from "./main";
import { openPopup } from "@usecapsule/react-sdk/dist/modal/utils";

const PROJECT_ID = "2c84fab0c5c7fc61e1e0dbc17057cfb7";
const APP_NAME = "capsule-rainbow-kit";

export interface DefaultWalletOptions {
  projectId: string;
  walletConnectParameters?: RainbowKitWalletConnectParameters;
}

export type RainbowWalletOptions = DefaultWalletOptions;

const capsuleWallet = ({ projectId }: RainbowWalletOptions): Wallet => ({
  id: "capsule",
  name: "Capsule",
  iconUrl: "/static/images/capsule-icon.png",
  iconBackground: "#000000",
  desktop: {
    getUri: (uri: string) => {
      openPopup("https://demo.beta.usecapsule.com/");
      // return "https://demo.beta.usecapsule.com/";
    },
  },
  // downloadUrls: {
  //   safari:
  //     "https://7f4shq8oyfd.typeform.com/to/F86oVLhb?typeform-source=usecapsule.com",
  // },
  // mobile: {
  //   getUri: (uri: string) => uri,
  // },
  // desktop: {
  //   getUri: (uri: string) => uri,
  // },
  createConnector: getWalletConnectConnector({ projectId }),
});

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [rainbowWallet, metaMaskWallet],
    },
    {
      groupName: "Others",
      wallets: [coinbaseWallet, walletConnectWallet],
    },
    {
      groupName: "Custom",
      wallets: [capsuleWallet],
    },
  ],
  {
    appName: APP_NAME,
    projectId: PROJECT_ID,
  }
);

const config = createConfig({
  connectors,
  chains: [mainnet],
  multiInjectedProviderDiscovery: false,
  transports: {
    [mainnet.id]: http("https://mainnet.example.com"),
  },
});

const queryClient = new QueryClient();

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider coolMode>
            <Main />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </main>
  );
}
