import nodemailer from "nodemailer";

const testEmail = async () => {
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  const info = await transporter.sendMail({
    from: '"SWA Reports" <no-reply@swa.local>',
    to: "fake.manager@example.com",
    subject: "Test SWA Alert",
    html: "<p>This is a test email with dummy audit data.</p>",
  });

  console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
};

testEmail();
  