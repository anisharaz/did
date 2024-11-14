import WalletConnectPipe from "@/app/pipes/WalletConnectionPipe";

async function VerifyRegistration({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const reg_id = (await searchParams).reg_id;
  return (
    <div>
      <WalletConnectPipe title="Connect Wallet To continue verification">
        <div>Verify Registration </div>
      </WalletConnectPipe>
    </div>
  );
}

export default VerifyRegistration;
