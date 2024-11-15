"use server";

import prisma from "@/lib/db";
import { SendRegistrationCompletionEmail } from "@/lib/email/EmailSender";
import { v4 as uuid } from "uuid";
export async function RegisterAction({
  firstName,
  middleName,
  lastName,
  dob,
  gender,
  phone,
  email,
  address_line,
  city,
  state,
  pin_code,
  photo,
}: {
  firstName: string;
  lastName: string;
  dob: Date;
  gender: string;
  phone: string;
  email: string;
  address_line: string;
  city: string;
  state: string;
  pin_code: number;
  middleName?: string | undefined;
  photo: any;
}) {
  try {
    const res = await prisma.people.create({
      data: {
        first_name: firstName,
        middle_name: middleName,
        last_name: lastName,
        email: email,
        phone: phone,
        address_line: address_line,
        city: city,
        state: state,
        pin_code: pin_code,
        dob: dob,
        registration_id: uuid(),
        photo: photo,
        gender: gender,
        role: ["citizen"],
      },
    });
    await SendRegistrationCompletionEmail({
      firstname: firstName,
      to: email,
      href: `${process.env.BASE_URL}/verify?reg_id=${res.registration_id}`,
    });
    console.log(res);
    return {
      success: true,
      msg: "Registration successful",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "Registration failed",
    };
  }
}

export async function VerifyRegistrationAction({
  registration_id,
  public_key,
  registration_tx_signature,
}: {
  registration_id: string;
  public_key: string;
  registration_tx_signature: string;
}) {
  const people = await prisma.people.findUnique({
    where: {
      registration_id: registration_id,
    },
  });
  if (!people) {
    return {
      success: false,
      msg: "Invalid verification id",
    };
  }
  if (people?.verification_complete) {
    return {
      success: false,
      msg: "Verification already completed",
    };
  }
  try {
    const res = await prisma.people.update({
      where: {
        registration_id: registration_id,
      },
      data: {
        pub_key: public_key,
        verification_complete: true,
        registration_tx_signature: registration_tx_signature,
      },
    });

    return {
      success: true,
      msg: "Verification successful",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      msg: "Verification failed",
    };
  }
}

export async function CreateMultiSigAction({
  id,
  creator_pub_key,
}: {
  id: string;
  creator_pub_key: string;
}) {
  const res = await prisma.multisig_action.create({
    data: {
      action_id: id,
      creator_pub_key: creator_pub_key,
      action_type: "UpdateIdentityCardHash",
      user_involved: true,
      government_involved: true,
      nominee_involved: false,
      judicial_involved: false,
    },
  });
  return {
    success: true,
    msg: "Action created",
  };
}

export async function UpdateActionCreation_tx({
  creation_tx,
  action_id,
}: {
  creation_tx: string;
  action_id: string;
}) {
  await prisma.multisig_action.update({
    where: {
      id: action_id,
    },
    data: {
      creation_tx: creation_tx,
    },
  });
  return {
    success: true,
    msg: "Creation tx added",
  };
}

export async function UpdateUserData({
  public_key,
  phone,
}: {
  public_key: string;
  phone: string;
}) {
  const people = await prisma.people.findFirst({
    where: {
      pub_key: public_key,
    },
  });
  const res = await prisma.people.update({
    where: {
      id: people?.id,
    },
    data: {
      phone: phone,
    },
  });
  return {
    success: true,
    msg: "Phone number updated",
  };
}
