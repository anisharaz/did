import prisma from "@/lib/db";
import { PublicKey } from "@solana/web3.js";
import { type NextRequest } from "next/server";
import nacl from "tweetnacl";
export async function POST(request: NextRequest) {
  const data: {
    public_key: string;
    signature: Uint8Array;
  } = await request.json();
  if (!data) {
    return new Response("Bad Request", { status: 400 });
  }
  const result = nacl.sign.detached.verify(
    data.signature,
    // @ts-ignore
    new Uint8Array(data.signature.data),
    new PublicKey(data.public_key).toBytes()
  );
  if (!result) {
    return new Response("Unauthorized", { status: 401 });
  }
  const userData = await prisma.people.findFirst({
    where: {
      pub_key: data.public_key,
    },
  });
  if (!userData) {
    return new Response("Not Found", { status: 404 });
  }
  return new Response(JSON.stringify(userData));
}
