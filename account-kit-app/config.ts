import {
  AlchemyAccountsUIConfig,
  cookieStorage,
  createConfig,
} from "@account-kit/react";
import { alchemy, sepolia, shape } from "@account-kit/infra";
import { QueryClient } from "@tanstack/react-query";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "outline",
  auth: {
    sections: [[{ type: "social", authProviderId: "google", mode: "popup" }]],
    addPasskeyOnSignup: false,
  },
  supportUrl: "https://github.com/TalonDragon000/Hom3Town-v3/discussions",
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey: "ALCHEMY_API_KEY" }), // TODO: add your Alchemy API key - https://dashboard.alchemy.com/accounts
    chain: shape,
    ssr: true, // more about ssr: https://accountkit.alchemy.com/react/ssr
    storage: cookieStorage, // more about persisting state with cookies: https://accountkit.alchemy.com/react/ssr#persisting-the-account-state
    enablePopupOauth: true, // must be set to "true" if you plan on using popup rather than redirect in the social login flow
  },
  uiConfig
);

export const queryClient = new QueryClient();
