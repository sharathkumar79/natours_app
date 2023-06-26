const nodemailer = require('nodemailer');
const pug = require('pug');

class Email {
  constructor(user, url) {
    this.user = user;
    this.url = url;
    this.firstname = user.name.split(' ')[0];
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      return 1;
    }
    return nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 2525,
      auth: {
        user: '4ff9f478366232',
        pass: '86fa11ab213e74',
      },
    });
  }

  async send(subject, template) {
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstname: this.firstname,
      url: this.url,
      subject,
    });
    const mailOptions = {
      from: 'sharath kumar <sharathkumarananthula79@gmail.com>',
      to: this.user.email,
      subject,
      html,
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome to Natours app frnds', 'welcomeEmail');
  }

  async sendResetPasswordLink() {
    await this.send('reset Your password', 'resetPassword');
  }
}

module.exports = Email;
