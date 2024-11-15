"use client";
import { Button } from "@/components/ui/button";
import { useWallet } from "@solana/wallet-adapter-react";
import { VerifyRegistrationAction } from "../actions/database";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

function VerifyRegistrationButton({
  registration_id,
}: {
  registration_id: string;
}) {
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();
  const router = useRouter();
  return (
    <div className="space-y-4 text-2xl">
      <div>
        Complete registration with wallet{" "}
        <span className="text-green-600">{publicKey?.toString()}</span>
      </div>
      <div className="text-red-600 text-base underline underline-offset-4">
        Be carefult This is one time action
      </div>
      <Button
        onClick={async () => {
          setLoading(true);
          const res = await VerifyRegistrationAction({
            public_key: publicKey?.toString() as string,
            registration_id: registration_id,
          });
          if (res.success) {
            alert("Registration Verified");
            router.push("/");
          } else {
            alert("Failed to verify registration");
          }
          setLoading(false);
        }}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" />{" "}
            <span className="pl-2">Please Wait..</span>
          </>
        ) : (
          <>Verify</>
        )}
      </Button>
    </div>
  );
}

export default VerifyRegistrationButton;
