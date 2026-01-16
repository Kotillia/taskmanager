const nodemailer = require('nodemailer');

// ADD INFO TO ENV
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendInvitationEmail = async (email, projectName, inviteLink) => {
  await transporter.sendMail({
    from: '"System Zadań" <noreply@twoja-domena.pl>',
    to: email,
    subject: `Zostałeś zaproszony do projektu ${projectName}`,
    html: `
      <h1>Cześć!</h1>
      <p>Zostałeś zaproszony do projektu <b>${projectName}</b>.</p>
      <p>Kliknij w poniższy link, aby dołączyć:</p>
      <a href="${inviteLink}">Akceptuj zaproszenie</a>
      <p>Link wygaśnie za 48 godzin.</p>
    `,
  });
};

module.exports = { sendInvitationEmail };