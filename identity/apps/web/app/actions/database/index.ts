"use server";

import { SendRegistrationCompletionEmail } from "@/lib/email/EmailSender";

export async function RegisterAction() {
//   {
//   firstName,
//   middleName,
//   lastName,
//   dob,
//   gender,
//   phone,
//   email,
//   address,
//   photo,
// }: {
//   firstName: string;
//   lastName: string;
//   dob: Date;
//   gender: string;
//   phone: string;
//   email: string;
//   address: string;
//   middleName?: string | undefined;
//   photo?: any;
// }
  // console.log(
  //   firstName,
  //   middleName,
  //   lastName,
  //   dob,
  //   gender,
  //   phone,
  //   email,
  //   address,
  //   photo
  // );
  await SendRegistrationCompletionEmail({
    firstname: "Anish",
    to: "anisharaz919@gmail.com",
    href: "https://blockx3.xyz",
  });
  return {
    success: true,
    msg: "Registration successful",
  };
}
