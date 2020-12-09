const sgMail = require("@sendgrid/mail");
const pug = require("pug");
const htmlToText = require("html-to-text");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `CEO Seun Bankole <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    // Sendgrid
    return sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }

  // Send the actual email
  async send(template, subject) {
    // 1) Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });

    // 2) Define email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.fromString(html),
    };

    // 3) Create a transport and send email
    await this.newTransport().send(mailOptions);
  }

  async sendWelcome() {
    await this.send("welcome", "Welcome to the Glorifiers Savings and Loans!");
  }

  async sendVerifyEmail() {
    await this.send(
      "verify-email",
      "Welcome to Glorifiers! Confirm Your Email"
    );
  }

  async sendPasswordReset() {
    await this.send(
      "passwordReset",
      "Your password reset token (valid for only 10 minutes)"
    );
  }
};
