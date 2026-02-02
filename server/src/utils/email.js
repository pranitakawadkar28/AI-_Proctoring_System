import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS, FRONTEND_URL } from "../config/env.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Pranita's App" <${EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Sending mail to:", to);
  } catch (error) {
    console.log("Error sending email:", error.message);
    throw new Error("Email not sent");
  }
};
