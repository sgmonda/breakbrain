var option = process.argv[2];
var count = process.argv[3]|0 || 10;

var server = require('./server.js').run(function(db, fs, register){

    if(option == '--create' || option == '--clean'){
        
        var removeFalseUsers = function(callback){
            db.users.remove({country: 'Fakeland'}, function(err){
                if(err) console.log('ERROR while removing a user');
            });
            db.brains.remove({country: 'Fakeland'}, function(err){
                if(!err) callback && callback();
                else console.log('ERROR while removing a user');
            });
        };

        var randomNames = [];

        function readNames(callback) {
            var input = fs.createReadStream('randomNames.csv');
            var remaining = '';

            input.on('data', function(data) {
                remaining += data;
                var index = remaining.indexOf('\n');
                while (index > -1) {
                    var line = remaining.substring(0, index);
                    remaining = remaining.substring(index + 1);
                    var name = remaining.match(/".+"/);
                    if(name){
                        name = name.toString();
                        randomNames.push(name);
                    }
                    index = remaining.indexOf('\n');
                }
            });

            input.on('end', function() {
                callback && callback();
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

        var generateAndRegister = function(count, callback){
            if(count){
                var user = generateUser(count);
                register(user, function(){
                    console.log(user.email + ' inserted. Remaining: ' + (count-1));
                    generateAndRegister(--count, callback);
                });
            } else callback && callback();
        };

        if(option == '--create'){        
            console.log('Reading false names from randomNames.csv...');
            readNames(function(){
                console.log(randomNames.length + ' names loaded');

                console.log('Creating false users...');
                generateAndRegister(count, function(){
                    console.log(count + ' users written in the database');
                    process.exit();
                });    

                
            });
        }else{

            console.log('Cleaning database...');
            removeFalseUsers(function(){
                console.log('False users removed successfully from database');
                process.exit();
            });            

        }
    } else console.log('Usage: node generator.js [--create <count> | --clean]');
    
});