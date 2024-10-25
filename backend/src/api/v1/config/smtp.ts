import nodemailer from "nodemailer";


// const transport = nodemailer.createTransport({
//   host: process.env.NODEMAILER_HOST,
//   port: 587,
//   secure: false,
//   auth: {
//     user: process.env.NODEMAILER_USER,
//     pass: process.env.NODEMAILER_PASS,
//   },
// });

const transport = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});


export default transport;
