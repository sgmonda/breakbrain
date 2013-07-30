var util = require('./server/util.js'),
    breakbrain_websockets_server = 'http://localhost:20661',
    io = require('socket.io-client'),
    socket = io.connect(breakbrain_websockets_server),
    finished = 0, reqCount = require('in').getopt().args[0];

console.log('STRESS-TEST:', 'Starting stress test');

console.time('Time spent in whole stress test');

// END EVENT

socket.on('empty', function(){
    console.log('STRESS-TEST:', 'False users deleted');
    console.log('STRESS-TEST:', 'Stress test finished in ');
    console.timeEnd('Time spent in ' + reqCount + ' false users deletion');
    console.timeEnd('Time spent in whole stress test');
    process.exit();
});

// USER REGISTRATION

console.time('Time spent in ' + reqCount + ' false users registration');
for(var i = 1; i <= reqCount; i++){
    var name = 'stress-test-' + i;

    // Register 
    socket.emit('register', {
        realname: name,
        birthday: '',
        password: 'test',
        email: name + '@test.com',
        country: 'Fakeland',
        sex: '',
        nick: '',
        active: true,
        reqCount: reqCount
    });
}

// USER DELETION (WHEN REGISTRATION FINISHES)

var first = true;
socket.on('stress-registered', function(){    
    if(first){        
        first = false;

        // Deleting brains
        socket.emit('delete-brains');    
        
        console.log('STRESS-TEST:', reqCount + ' false users registered');
        console.timeEnd('Time spent in ' + reqCount + ' false users registration');
        console.time('Time spent in ' + reqCount + ' false users deletion');
        for(i = 1; i <= reqCount; i++){
            name = 'stress-test-' + i;    
            // Deleting users    
            socket.emit('delete-user', name + '@test.com');    
        }

    }
    
});

