import prisma from "@/lib/db";
import { createHash } from "crypto";
import { type NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const data: {
    registration_id: string;
  } = await request.json();

  const person = await prisma.people.findUnique({
    where: {
      registration_id: data.registration_id,
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

  return new Response(
    JSON.stringify({
      success: true,
      data: Filtered_Person_Data,
      data_hash: createHash("sha256")
        .update(JSON.stringify(Filtered_Person_Data))
        .digest("hex"),
    })
  );
}
