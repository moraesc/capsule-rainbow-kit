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
import Capsule, { Environment } from "@usecapsule/react-sdk";
import { API_KEY, PROJECT_ID, APP_NAME } from "./constants";
import "./globals.css";
export interface DefaultWalletOptions {
  projectId: string;
  walletConnectParameters?: RainbowKitWalletConnectParameters;
}

export type RainbowWalletOptions = DefaultWalletOptions;

import CapsuleWeb, { CapsuleModal, newTheme } from "@usecapsule/react-sdk";
import { createRoot } from "react-dom/client";

function renderModal(
  capsule: CapsuleWeb,
  appName: string,
  onCloseArg: () => void
): void {
  const container = document.createElement("div");
  document.body.appendChild(container); // Add the container to the DOM
  const root = createRoot(container);
  const onClose = () => {
    root.unmount();
    container.remove(); // Remove the container from the DOM
    onCloseArg();
  };

  root.render(
    <CapsuleModal
      onClose={onClose}
      capsule={capsule}
      isOpen={true}
      appName={appName}
      theme={newTheme}
    />
  );
}

const capsuleWallet = ({ projectId }: RainbowWalletOptions): Wallet => ({
  id: "capsule",
  name: "Capsule",
  iconUrl: "/static/images/capsule-icon.png",
  iconBackground: "#000000",
  desktop: {
    getUri: (_uri: string) => {
      const capsule = new Capsule(Environment.DEVELOPMENT, API_KEY);
      renderModal(capsule, "Rainbow Test", () => {});
      return "";
    },
  },
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
