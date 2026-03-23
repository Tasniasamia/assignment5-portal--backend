import nodemailer from "nodemailer";
import { envVars } from "../../config/env";
import path from "path";
import ejs from "ejs";

const transporter = nodemailer.createTransport({
  host: envVars?.EMAIL_SENDER_SMTP_HOST,
  port: Number(envVars?.EMAIL_SENDER_SMTP_PORT),
  secure: true,
  auth: {
    user: envVars?.EMAIL_SENDER_SMTP_USER,
    pass: envVars?.EMAIL_SENDER_SMTP_PASS,
  },
});

interface TEmailpayload {
  to: string;
  subject: string;
  templateName: string;
  templateData: Record<string, any>;
  attachment?: {
    fileName: string;
    content: Buffer | string;
    contentType: string;
  };
}

export const sendEmail = async (emailPayload: TEmailpayload) => {
  const pathFile = await path.join(
    process.cwd(),
    `src/app/template/${emailPayload?.templateName}.ejs`
  );
  const htmlElement = await ejs.renderFile(
    pathFile,
    emailPayload?.templateData
  );
  await transporter.sendMail({
    from: "<info@healthCare.com>",
    to: emailPayload?.to,
    subject: emailPayload?.subject,
    html: htmlElement,
  });


};
