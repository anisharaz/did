import { render } from "@react-email/components";
import nodemailer from "nodemailer";
import { RegistrationEmailTemple } from "./tamples/registration";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.RESEND_SMPT_USER,
    pass: process.env.RESEND_SMPT_PASS,
  },
});

export async function SendRegistrationCompletionEmail({
  to,
  href,
  firstname,
}: {
  to: string;
  href: string;
  firstname: string;
}) {
  try {
    const htmlConetnt = await render(
      RegistrationEmailTemple({
        userFirstname: firstname,
        CompleteRegistrationUrl: href,
      })
    );
    const info = await transporter.sendMail({
      from: `"DID" <verify@mail.blockx3.xyz>`,
      to: to,
      subject: "DID registration Completion",
      html: htmlConetnt,
    });
    return {
      success: true,
      msg: "",
    };
  } catch (error) {
    return {
      success: false,
      msg: "Failed to send email, Try again !",
    };
  }
}
