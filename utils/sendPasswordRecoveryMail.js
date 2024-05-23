const nodemailer = require('nodemailer');

const send = (x = "", sendto, subjects, htmls) => {
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false, // true for 465, false for other ports
    port: 587,

    auth: {
      user: "tragedela@gmail.com",
      pass: Mailer_Password = "sxuqodqvepdjxpyl"
    },
    tls: {
      rejectUnauthorized: false
  }
  });
  let mailOptions = {
    from: "kraiemabid300@gmail.com",
    to: sendto,
    subject: subjects,
    html: `<p><b>Cher(e) membre</b>,</p>
      <p> Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte. Veuillez utiliser le lien ci-dessous pour accéder à la page de réinitialisation : </p>
      <p>Lien de récupération : <a href="http://localhost:4200/#/reset-password/${htmls}"> http://localhost:4200/#/reset-password/${htmls}</a> </p>
      <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail. Votre compte est sécurisé.</p>
      <p>Si vous rencontrez des difficultés lors de la réinitialisation de votre mot de passe ou si vous avez des questions, n'hésitez pas à nous contacter. Nous sommes là pour vous aider.</p>
      <p> Cordialement,</p>
      <p><strong>Mobelite</strong></p>
      <img src="https://media.licdn.com/dms/image/C4D0BAQFvrxjsjO6r1w/company-logo_200_200/0/1674053287838/mobelite_logo?e=1721260800&v=beta&t=28ukKfAIkWlPgweqr4a37dOg7jQslMWEd_CkcE3eyG4" alt="Logo de l'entreprise" width="256" height="75">`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent:' + info.response);
    }
  });
}
module.exports = { send: send }