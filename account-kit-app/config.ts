import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, sepolia, shape, shapeSepolia } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";
import dotenv from "dotenv";

dotenv.config();

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [[{ type: "social", authProviderId: "google", mode: "popup" }], 
    [{ type: "external_wallets", walletConnect: { projectId: `${process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID}` } }]],
    addPasskeyOnSignup: false,
  },
  supportUrl: "https://discord.gg/alchemy-builders",
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: `${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}` }),
    chain: shapeSepolia,
    ssr: true, // more about ssr: https://accountkit.alchemy.com/react/ssr
    storage: cookieStorage, // more about persisting state with cookies: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
  },
  uiConfig
);

export const queryClient = new QueryClient();
