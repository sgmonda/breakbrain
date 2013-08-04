// #############################################################################
// ## EMAIL ####################################################################
// #############################################################################

var emailjs = require('emailjs');
var util = require('./util.js');
var secret = require('./secret.js');

var server = emailjs.server.connect({
	user: secret.EMAIL_ACCOUNT_NOREPLY.EMAIL,
	password: secret.EMAIL_ACCOUNT_NOREPLY.PASSWORD,
	host: secret.EMAIL_ACCOUNT_NOREPLY.SERVER,
	port: secret.EMAIL_ACCOUNT_NOREPLY.PORT,
	ssl: secret.EMAIL_ACCOUNT_NOREPLY.SSL
});

module.exports.send = function(to, subject, message){

    server.send({
        text:    message,
        from:    "BreakBrain <noreply@breakbrain.com>", 
        to:      '<' + to + '>',
        subject: subject + ' (' + (new Date()).toISOString() + ')',
        attachment: [
            {data:"<html>" + message + "</html>", alternative:true}
        ]
    }, function(err, message) {
        if(err) console.warn('ERROR sending an email: ', err);        
        else util.log('EMAIL-MODULE', 'Email about "' + subject + '" sent to ' + to);
    });
};

util.log('EMAIL-MODULE', 'Email subsystem ready to send emails');

exports.send('sgmonda@gmail.com', 'Prueba', 'Esto es un mensaje de prueba');


