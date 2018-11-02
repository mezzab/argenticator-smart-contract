var nodemailer = require('nodemailer');
var develop = require('../../config/develop');
var utils = require('./utils');

module.exports = function (app, db) {
  app.post('/sendEmail', (req, res) => {
    console.log('* * * * * *  EMAIL * * * * * * ');
    var transporter = nodemailer.createTransport({
      service: develop.mail.service,
      auth: {
        user: develop.mail.user,
        pass: develop.mail.pass,
      },
    });

    var code = utils.randomCode();

    transporter.sendMail(utils.mailOptions(req.body.mail, code), function (
      error,
      info
    ) {
      if (error) {
        console.log('Error sending mail: ', error);
      } else {
        console.log(
          'Email sent to: ' +
          req.body.mail +
          '. Verification code: *** ' +
          code +
          ' *** .Extra info:' +
          info.response
        );
      }
    });

    res.send({ code });

    /* lo ideal seria guardar el codigo en una db con el mail
      y cuando el user presiona continuar abria que pegarle de nuevo al back con el codigo
      para que el verifique si es el que guardo en la db.*/
  });

  app.post('/saveUserInSmartContract', (req, res) => {
    console.log('* * * * * * SAVE USER IN SMART CONTRACT * * * * * * ');
    res.send('no implementamos esto todavia guacho');
  });

  app.post('/sendSMS', (req, res) => {
    console.log('* * * * * *  SMS * * * * * * ');
    var accountSid = develop.sms.accountSid; // Your Account SID from www.twilio.com/console
    var authToken = develop.sms.authToken; // Your Auth Token from www.twilio.com/console

    var twilio = require('twilio');
    var client = new twilio(accountSid, authToken);

    var code = utils.randomCode();
    console.log('SMS sent. ' + '. Verification code: *** ' + code + ' *** .');
    client.messages
      .create({
        body: 'Yor code is: *** ' + code,
        to: '+54' + req.body.phone, // Text this number
        from: '+15866661838', // From a valid Twilio number
      })
      .then(message => console.log('message.sid: ', message.sid));
    res.send({ code });
  });

  app.post('/saveIPFS', (req, res) => {
    console.log('* * * * * *  IPFS * * * * * * ');
    console.log('el legajo que se guardara es: ', req.body.legajo);

    const ipfsAPI = require('ipfs-api');

    const ipfs = ipfsAPI('ipfs.infura.io', '5001', { protocol: 'https' });

    let testBuffer = new Buffer(req.body.legajo);


    return ipfs.files.add(testBuffer, function (err, file) {
      if (err) {
        console.log('Error saving file: ', err);
        res.send(err)
      }
      console.log('> File successfully saved ✓ ');
      console.log(file)
      res.send(file)
    });
  });
};
