import "server-only";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILUSER,
    pass: process.env.EMAILPASSWORD,
  },
});

export default function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: process.env.EMAILUSER,
    to,
    subject,
    html,
  });
}
