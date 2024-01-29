const nodemailer = require("nodemailer");
const aws = require("@aws-sdk/client-ses");
let { defaultProvider } = require("@aws-sdk/credential-provider-node");
import { formatEmailType } from '../../shared/types';

const ses = new aws.SES({
  apiVersion: "2010-12-01",
  region: "eu-north-1",
  defaultProvider,
});

let transporter = nodemailer.createTransport({
  SES: { ses, aws },
});

export const sendEmailToReceipients = async ({ from, to, subject, text }: formatEmailType ): Promise<boolean> => {

  transporter.sendMail(
    {
      from,
      to,
      subject,
      text
      // ses: {
      //   // optional extra arguments for SendRawEmail
      //   // Tags: [
      //   //   {
      //   //     Name: "tag_name",
      //   //     Value: "tag_value",
      //   //   },
      //   // ],
      // },
    },
    (err: any, info: any) => {
      console.log(err);
      console.log(info);
      return false;
    }
  );

  return true;
}