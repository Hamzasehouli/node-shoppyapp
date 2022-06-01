const nodemailer = require("nodemailer");
const sgMail = require("@sendgrid/mail");
const env = process.env.NODE_ENV.trim();

module.exports = async function (obj) {
  try {
    if (env === "development") {
      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "830699f99d7a38",
          pass: "153833a9a6ce16",
        },
      });

      const data = await transporter.sendMail({
        from: `${process.env.COMPANY}@team.com`, // sender address
        to: obj.to, // list of receivers
        subject: obj.subject, // Subject line
        text: obj.text, // plain text body
        // html: '<b>Hello world?</b>', // html body
      });
      return data;
    } else if (env === "production") {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: "pileset934@aethiops.com", // Change to your recipient
        from: "sehouli.hamza@gmail.com", // Change to your verified sender
        subject: obj.subject,
        text: obj.text,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      };
      const data = await sgMail.send(msg);
      return data;
    }
  } catch (err) {
    throw err;
  }
};
