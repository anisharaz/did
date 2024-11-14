import WalletButton from "@/components/ui/WalletButton";

function Home() {
  return (
    <div className="min-h-16 shadow-lg flex items-center">
      <div className="flex-1">
        <div>LOGO</div>
      </div>
      <div>
        <WalletButton />
      </div>
    </div>
  );
}

export default Home;
