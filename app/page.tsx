"use client";

import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  RainbowKitWalletConnectParameters,
  Wallet,
  connectorsForWallets,
  darkTheme,
  getWalletConnectConnector,
} from "@rainbow-me/rainbowkit";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base, zora } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Main from "./main";

const PROJECT_ID = "2c84fab0c5c7fc61e1e0dbc17057cfb7";
const APP_NAME = "capsule-rainbow-kit";

export interface DefaultWalletOptions {
  projectId: string;
  walletConnectParameters?: RainbowKitWalletConnectParameters;
}

export type RainbowWalletOptions = DefaultWalletOptions;

const rainbow = ({ projectId }: RainbowWalletOptions): Wallet => ({
  id: "rainbow",
  name: "Rainbow",
  iconUrl: "/rainbow.png",
  iconBackground: "#0c2f78",
  downloadUrls: {
    android:
      "https://play.google.com/store/apps/details?id=me.rainbow&referrer=utm_source%3Drainbowkit&utm_source=rainbowkit",
    ios: "https://apps.apple.com/app/apple-store/id1457119021?pt=119997837&ct=rainbowkit&mt=8",
    mobile: "https://rainbow.download?utm_source=rainbowkit",
    qrCode: "https://rainbow.download?utm_source=rainbowkit&utm_medium=qrcode",
    browserExtension: "https://rainbow.me/extension?utm_source=rainbowkit",
  },
  mobile: {
    getUri: (uri: string) => uri,
  },
  qrCode: {
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: "https://my-wallet/learn-more",
      steps: [
        {
          description:
            "We recommend putting My Wallet on your home screen for faster access to your wallet.",
          step: "install",
          title: "Open the My Wallet app",
        },
        {
          description:
            "After you scan, a connection prompt will appear for you to connect your wallet.",
          step: "scan",
          title: "Tap the scan button",
        },
      ],
    },
  },
  extension: {
    instructions: {
      learnMoreUrl: "https://my-wallet/learn-more",
      steps: [
        {
          description:
            "We recommend pinning My Wallet to your taskbar for quicker access to your wallet.",
          step: "install",
          title: "Install the My Wallet extension",
        },
        {
          description:
            "Be sure to back up your wallet using a secure method. Never share your secret phrase with anyone.",
          step: "create",
          title: "Create or Import a Wallet",
        },
        {
          description:
            "Once you set up your wallet, click below to refresh the browser and load up the extension.",
          step: "refresh",
          title: "Refresh your browser",
        },
      ],
    },
  },
  createConnector: getWalletConnectConnector({ projectId }),
});

const customRainbowWallet = rainbow({
  projectId: PROJECT_ID,
  walletConnectParameters: { isNewChainsStale: false },
});

console.log("rainbowWalletCustom: ", customRainbowWallet);
console.log("metaMaskWallet: ", metaMaskWallet);

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [metaMaskWallet],
    },
    {
      groupName: "Others",
      wallets: [coinbaseWallet, walletConnectWallet],
    },
    {
      groupName: "Custom",
      wallets: [customRainbowWallet],
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
          <RainbowKitProvider theme={darkTheme()} coolMode>
            <Main />
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </main>
  );
}
