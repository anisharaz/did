import WalletConnectPipe from "@/app/pipes/WalletConnectionPipe";
import prisma from "@/lib/db";
import VerifyRegistrationButton from "./VerifyButton";

async function VerifyRegistration({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const reg_id = (await searchParams).reg_id;
  const people = await prisma.people.findUnique({
    where: {
      registration_id: reg_id as string,
    },
  });
  if (!people) {
    return (
      <div className="flex justify-center text-2xl">
        <div>Registration ID not found</div>
      </div>
    );
  }
  return (
    <div className="flex justify-center ">
      <WalletConnectPipe title="Connect Wallet To continue verification">
        {people?.verification_complete ? (
          <div>Verification Complete</div>
        ) : (
          <VerifyRegistrationButton registration_id={reg_id as string} />
        )}
      </WalletConnectPipe>
    </div>
  );
}

export default VerifyRegistration;
