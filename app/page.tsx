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
// import { openPopup } from "@usecapsule/react-sdk/dist/modal/utils";
import Capsule, { Environment } from "@usecapsule/react-sdk";

const PROJECT_ID = "2c84fab0c5c7fc61e1e0dbc17057cfb7";
const APP_NAME = "capsule-rainbow-kit";

export interface DefaultWalletOptions {
  projectId: string;
  walletConnectParameters?: RainbowKitWalletConnectParameters;
}

export type RainbowWalletOptions = DefaultWalletOptions;

import CapsuleWeb, { CapsuleModal, newTheme } from "@usecapsule/react-sdk";
import { createRoot } from "react-dom/client";

function renderModal(capsule: CapsuleWeb, appName: string, onCloseArg: () => void): void {
  const container = document.createElement('div');
  document.body.appendChild(container); // Add the container to the DOM
  const root = createRoot(container);
  const onClose = () => {
    root.unmount()
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
      // will need to fill in actual api key to go through modal flow
      const API_KEY = '';
      const capsule = new Capsule(Environment.DEVELOPMENT, API_KEY);
      renderModal(capsule, 'Rainbow Test', () => {});
      return '';
      // openPopup("https://demo.beta.usecapsule.com/");
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
