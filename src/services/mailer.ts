import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,
  port: Number(process.env.MAILER_PORT),
  secure: false,
  auth: {
    user: process.env.MAILER_EMAIL,
    pass: process.env.MAILER_PASSWORD,
  },
});

export async function sendMail(
  { name, email }: { name: string; email: string },
  subject: string,
  content: string
) {
  return await transporter
    .sendMail({
      from: `${process.env.MAILER_NAME} <${process.env.MAILER_EMAIL}>`,
      to: `${name} <${email}>`,
      subject: subject,
      html: content,
    })
    .then((info) => {
      console.log("✉", `Message sent: ${info.messageId}`);
      console.log("✉", `Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    })
    .catch((error) => {
      console.log("❌failed sending message.", error.message);
    });
}
