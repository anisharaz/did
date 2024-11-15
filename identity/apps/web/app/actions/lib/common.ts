import prisma from "@/lib/db";
import { PublicKey } from "@solana/web3.js";
import { createHash } from "crypto";
export type PersonBasicDetail = {
  id: string;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  email: string;
  phone: string;
  address_line: string;
  city: string;
  state: string;
  pin_code: string;
  dob: Date;
  photo: string | null;
  gender: string;
  public_key: string;
};

export async function GetUserBasicDetail({
  public_key,
}: {
  public_key: string;
}) {
  const person = await prisma.people.findFirst({
    where: {
      pub_key: public_key,
    },
  });
  if (!person) {
    return {
      success: false,
      data: null,
      data_hash: null,
    };
  }
  const Filtered_Person_Data = {
    id: person.id,
    first_name: person.first_name,
    middle_name: person.middle_name,
    last_name: person.last_name,
    email: person.email,
    phone: person.phone,
    address_line: person.address_line,
    city: person.city,
    state: person.state,
    pin_code: person.pin_code,
    dob: person.dob,
    photo: person.photo,
    gender: person.gender,
    public_key: person.pub_key as string,
  };
  return {
    success: true,
    data: Filtered_Person_Data,
    data_hash: createHash("sha256")
      .update(JSON.stringify(Filtered_Person_Data))
      .digest("hex"),
  };
}
// TODO: ass the program if
export const ProgramId = new PublicKey(
  "C37QCGvJAbrYBb4hSXLJeHLSazP4h3Sg6BUX6tJXb1Ja"
);
