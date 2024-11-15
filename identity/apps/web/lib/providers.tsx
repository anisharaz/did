"use client";
import dynamic from "next/dynamic";
import { ConnectionProvider } from "@solana/wallet-adapter-react";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import { PhantomWalletName } from "@solana/wallet-adapter-phantom";

const WalletProviderDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react")).WalletProvider,
  { ssr: false }
);
const WalletModalProviderDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletModalProvider,
  { ssr: false }
);

import { clusterApiUrl } from "@solana/web3.js";

export default function ContextProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const endpoint = clusterApiUrl("devnet");
  const { select } = useWallet();
  select(PhantomWalletName);
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProviderDynamic
        wallets={[new PhantomWalletAdapter()]}
        autoConnect={true}
      >
        <WalletModalProviderDynamic>{children}</WalletModalProviderDynamic>
      </WalletProviderDynamic>
    </ConnectionProvider>
  );
}
