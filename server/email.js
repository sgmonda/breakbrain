// #############################################################################
// ## EMAIL ####################################################################
// #############################################################################

var email   = require('emailjs');
var util = require('./util.js');

var godticEmailServer  = email.server.connect({
    user:    "no-replay+breakbrain.com", 
    password:"bb-norep_//breakbrain", 
    host:    "mail.breakbrain.com", 
    port: 26,
    ssl:     false
});

var gmailBBServer  = email.server.connect({
    user: 'breakbrain.no.replay@gmail.com', 
    password: 'elPato_77p?', 
    host: 'smtp.gmail.com', 
    port: 465,
    ssl: true
});


//var emailServer = godticEmailServer;
var emailServer = gmailBBServer; 

module.exports.send = function(to, subject, message){
    emailServer.send({
        text:    message,
        from:    "BreakBrain <no-replay@breakbrain.com>", 
        to:      '<' + to + '>',
        subject: subject,
        attachment: [
            {data:"<html>" + message + "</html>", alternative:true}
        ]
    }, function(err, message) {
        if(err) console.warn('ERROR sending an email: ', err);        
        else util.log('EMAIL-MODULE', 'Email about "' + subject + '" sent to ' + to);
    });
};

util.log('EMAIL-MODULE', 'Email subsystem ready to send emails');

    


