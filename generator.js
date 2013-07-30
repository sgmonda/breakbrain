/**
 * Generador de datos
 * Requisitos de ejecución: servidor en funcionamiento
 * Ejecución: node data-generator.js [--create <count> | --delete]
 */

var input = require('in'),
    fs = require('fs'),
    io = require('socket.io-client'),
    breakbrain_websockets_server = 'http://localhost:20661',
    socket = io.connect(breakbrain_websockets_server),
    timeout = 5000;

var opt = input.getopt({
    'create': {key: 'c', args: 1},
    'delete': {key: 'd'}
});

var randomNames = fs.readFileSync('randomNames.csv', 'utf-8').match(/\".+\"/g);
randomNames.forEach(function(item, index){
    randomNames[index] = item.replace(/\"/g, '');
});

var resetTimeout = function(){
    timeout = 5000;
};

setInterval(function(){
    timeout -= 1000;
    if(!timeout){
        console.log('Timeout exceeded');
        process.exit(1);
    }
}, 1000);

if(opt.delete){
    console.log('Deleting false users...');
    socket.emit('delete-false-users').on('delete-false-users', function(err){
        if(!err) console.log('False users deleted successfully');
        else console.warn(err);
    });
}

var generateUser = function(seed){
    var u =  {
        realname: randomNames[seed],
        password: '7cb6efb98ba5972a9b5090dc2e517fe14d12cb04',
        email: seed + '@falseuser.com',
        country: 'Fakeland', // VERY IMPORTANT FOR CLEANING PURPOSES
        birthday: '10/19/1972',
        active: true,
        nick: 'I am not a real person',
        score: Math.random() * 1000 | 0
    };
    return u;
};

if(opt.create){
    socket.on('register', function(err){
        if(err) console.log(err);
    });
    console.log('Creating false users...');
    for(var i = 0, len = opt.create.args; i < len; i++){
        var user = generateUser(i);
        socket.emit('register', user);
    }
}
