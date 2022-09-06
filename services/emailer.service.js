const nodemailer = require("nodemailer");


const sendEmail = (data) => {
  const transporter = nodemailer.createTransport({
    host: `${process.env.EMAIL_HOST}`,
    port: 465,
    auth: {
      user: `${process.env.EMAIL_USER}`,
      pass: `${process.env.EMAIL_PASS}`,
    },
  });

  transporter.sendMail(
    {
      from: `${process.env.EMAIL_USER}`,
      to: `${process.env.EMAIL_TO}`,
      subject: "RSVP BITCH",
      text: "😊",
      attachments: [
        {
          filename: "rsvps.csv",
          content: data,
        },
      ],
    },
    (err, info) => {
      if (err) {
        throw new Error("Error occurred. " + err.message);
      }
      console.log("Message sent: %s", info.messageId);
      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  );
};

module.exports = {
  sendEmail
}