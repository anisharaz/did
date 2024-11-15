import WalletConnectPipe from "@/app/pipes/WalletConnectionPipe";
import prisma from "@/lib/db";
import VerifyRegistrationButton from "./VerifyButton";
import { Button } from "@/components/ui/button";

async function VerifyRegistration({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const reg_id = (await searchParams)?.reg_id;
  console.log(searchParams);

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
          <div className="text-4xl">
            Verification Complete{" "}
            <a href="/">
              <Button variant={"link"} className="text-4xl text-blue-400">
                Click Here
              </Button>
            </a>
          </div>
        ) : (
          <VerifyRegistrationButton registration_id={reg_id as string} />
        )}
      </WalletConnectPipe>
    </div>
  );
}

export default VerifyRegistration;
