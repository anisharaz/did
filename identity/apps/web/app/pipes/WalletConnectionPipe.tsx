"use client";
import WalletButton from "@/components/ui/WalletButton";
import { useWallet } from "@solana/wallet-adapter-react";
function WalletConnectPipe({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { connected } = useWallet();
  return (
    <>
      {connected ? (
        children
      ) : (
        <div className="main-body flex flex-col gap-4 justify-center items-center">
          <div className="text-4xl underline underline-offset-8">{title}</div>
          <WalletButton />
        </div>
      )}
    </>
  );
}

export default WalletConnectPipe;
