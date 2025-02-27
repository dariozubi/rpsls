import { PropsWithChildren } from "react";
import { Chain, hardhat, sepolia } from "wagmi/chains";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { metaMask } from "wagmi/connectors";

const chain = (
  process.env.NEXT_PUBLIC_CHAIN === "hardhat" ? hardhat : sepolia
) as Chain;

export const config = createConfig({
  chains: [chain],
  connectors: [metaMask()],
  transports: {
    [chain.id]: http(),
  },
});

const queryClient = new QueryClient();

export default function Providers({ children }: PropsWithChildren) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
