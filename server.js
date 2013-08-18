/**
 * breakbrain
 */

/*jshint node:true, noempty:true, laxcomma:true, laxbreak:false */

"use strict";

var callback;

var util = require('./server/util.js');
var input = require('in');
var ops = input.getopt({
    'test': {key: 't'}
});

var test_module = require('./test.js');
test_module.optest = ops.test;
var test = test_module.ok;

var PORT = 20661;

var constants = require('./server/constants.js');
test('constants module load', constants != null, 'constants module = ' + constants);

// #############################################################################
// ## DATABASE #################################################################
// #############################################################################


require('./server/database.js')(util, test, function(db, bson){
    var BSON = bson;
    test('database object instantiation', db != null, 'db = ' + db);

    // #############################################################################
    // ## WEB SERVER ###############################################################
    // #############################################################################

    var fs = require('fs'),
        express = require('express'),
        http = require('http');

    test('fs module load', fs != null, 'fs = ' + fs);
    test('express module load', express != null, 'express = ' + express);
    test('http module load', http != null, 'http = ' + http);

    var app = express();
    var server = http.createServer(app);

    test('web app creation', app != null, 'app = ' + app);

    app.configure(function(){
        app.use(express.static(__dirname+'/public'));
    });

    app.get('/', function(req,res){
        fs.createReadStream(__dirname + '/index.html').pipe(res);
    });

    app.get('/version', function(req,res){
        res.writeHeader(200, {'Content-type':'application/json'});
        res.end('{"version":"'+ process.version +'"}');
    });

    app.get('*', function(req,res){
        res.statusCode = 404;
        res.end(':: not found ::');
    });

    server.listen(PORT, function(){
        util.log('WEB SERVER', 'running on port ' + this.address().port);
    });

    // #############################################################################
    // ## EMAIL SERVER #############################################################
    // #############################################################################

    var emailsys = require('./server/email.js');
    test('email module load', emailsys != null, 'emailsys = '+ emailsys);

    //emailsys.send('sgmonda@gmail.com', 'prueba', 'llega llamando a emailsys.send()');

    // #############################################################################
    // ## PERSISTENCIA #############################################################
    // #############################################################################

    var login = function(email, password, callback){
        db.users.findOne({email: email}, function(err, u){
            if(err){
                console.warn('ERROR while retrieving users');
                callback && callback(null);
            }else if(u != null){
                if(u.password == password) callback && callback(u);
                else callback && callback({error: 'wrong password'});
            }else{
                callback && callback({error: 'There is not any user user with email "' + email + '". Have you written it correctly?'});
            }
        });
    };

    var sendActivationEmail = function(email, url, callback){
		url = url || 'http://breakbrain.com';
        db.users.findOne({email: email}, function(err, u){
            if(err){
                console.warn('ERROR while sending an activation email to "' + email + '"');
            }else if(u){
                var link = url + '?activate=' + u._id;
                emailsys.send(email, 'Complete your registration', 'You signed up for BreakBrain.com. The last step is to activate your account, going to the following link:<br><a href="' + link + '">' + link + '</a><br><br>If you have not signed up for BreakBrain, ignore this email.');
                callback && callback(null);
            }else{
                callback && callback({msg: 'Email ' + email + ' has not been registered. If this is your email address, you have not registered successfully, so try to register again.'});
            }
        });
    };

    var sendPasswordEmail = function(email, url, callback){
		url = url || 'http://breakbrain.com';
        db.users.findOne({email: email}, function(err, u){
            if(err){
                console.warn('ERROR while sending a password changer email to "' + email + '"');
            }else if(u){
                var link = url + '/password.html?passwordChange=' + u.hash;
                emailsys.send(email, 'Password change', 'You have requested a password change because you can\'t remember the current one.<br>Follow this link to create a new password:<br><a href="' + link + '">' + link + '</a><br><br>If you have not requested a password change ignore this email.');
                callback && callback(null);
	    }else{
                callback && callback({msg: 'Email ' + email + ' has not been registered. If this is your email address, you have not registered successfully, so try to register again.'});
            }
        });  
    };

    var register = function(user, callback){
        function ins(){
            db.users.insert({
                realname: user.realname,
                password: user.password,
	        email: user.email,
	        country: user.country,
                birthday: user.birthday,
                followees: [],
                followers: [],
                active: user.active || false,
                hash: util.hash(user.email + util.time()),
	        time: util.time(),
                nick: user.nick || 'I\'m new at BreakBrain!',
                avatar: user.avatar || constants.default_avatar,
                score: user.score || 0
            }, {safe: true}, function(err){
	        if(err){
	            console.warn('ERROR while inserting an user');
	        }else{
                    !user.active && sendActivationEmail(user.email);
                    db.brains.insert(brain, {safe: true}, function(err){
	                if(err){
	                    console.warn('ERROR while inserting a brain');
	                }else{
                            callback && callback(null);
                        }
                    });           
                }
            });               
        }
        
        var brain = {
            email: user.email,
            country: user.country,
            year: [ [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0] ],
            month: [ [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0] ],
            week: [ [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0], [0,0,0,0,0] ],
            day: [0,0,0,0,0],
            times: [0,0,0,0,0],
            interests: {
                memory: {
                    working_memory: true,
                    spatial_recall: true,
                    face_name_recall: true
                },
                flexibility: {
                    response_inhibition: true,
                    planning: true,
                    task_switching: true,
                    verbal_fluency: true
                },
                problem_solving: {
                    arithmetic: true,
                    logical_reasoning: true,
                    quantitative_reasoning: true
                },
                speed: {
                    spatial_orientation: true,
                    information_processing: true
                },
                attention: {
                    focus: true,
                    visual_field: true
                }
            }
        };
        
        if(user.active){ // Estamos creando un usuario falso
            for(var i=0; i < 5; i++){
                brain.day[i] = Math.random() * 100 | 0;
                brain.times[i] = Math.random() * 100 | 0;
            }
            for(var i=0; i < 7; i++){
                for(var j=0; j < 5; j++){
                    brain.week[i][j] = Math.random() * 100 | 0;                    
                }

            }
            for(var i=0; i < 30; i++){
                for(var j=0; j < 5; j++){
                    brain.month[i][j] = Math.random() * 100 | 0;                    
                }

            }
            for(var i=0; i < 12; i++){
                for(var j=0; j < 5; j++){
                    brain.year[i][j] = Math.random() * 100 | 0;                    
                }

            }
        } 
        
        db.users.findOne({email: user.email}, function(err, u){
	    if(err || !u){
                ins(callback);
	    }else{
                callback && callback({msg: 'email-taken'});
            }
        });        
    };


    var activate = function(userID, callback){
        db.users.findOne({_id: BSON.ObjectID(userID)}, function(err, u){
	    if(err || !u){
                callback && callback({msg: 'wrong identifier'});
	    }else{
                db.users.update({_id: BSON.ObjectID(userID)}, {$set:{active: true}}, {safe:true}, function(err) {
                    if(err){
                        console.warn('ERROR while activating user ' + userID);
                        callback && callback(err);
                    }else{
                        util.log('DATABASE', 'New user (' + u.email + ') has been activated.');
                        callback && callback(null);
                    }
                }); 
            }
        });           
    };

    var deleteUser = function(email, callback){
        db.users.remove({email: email}, function(err){
            if(err) util.error('MAIN SERVER', 'Error deleting user ' + email);
            callback(err);
        });
    };
    
    var deleteFalseUsers = function(callback){
        db.users.remove({country: 'Fakeland'}, function(err){
            if(err) util.error('MAIN SERVER', 'Error deleting false users');
            callback(err);
        });
    };    
    
    var deleteBrain = function(email, callback){
        db.brains.remove({email: email}, function(err){
            if(err) util.error('MAIN SERVER', 'Error deleting brain profile of ' + email);
            callback(err);
        });
    };
    
    var deleteBrains = function(){
        db.brains.remove({}, function(err){
            if(err) util.error('MAIN SERVER', 'Error deleting all brain ');
            else util.log('MAIN SERVER', 'All brains deleted');
        });
    };
    
    var deleteFalseBrains = function(callback){
        db.brains.remove({email: /@falseuser.com/}, function(err){
            if(err) util.error('MAIN SERVER', 'Error deleting all brain ');
            else util.log('MAIN SERVER', 'All brains deleted');
            callback();
        });
    };

    
    var changePassword = function(hashCode, newPassword, callback){
        db.users.findOne({hash: hashCode}, function(err, u){
	    if(err || !u){
                callback && callback({msg: 'invalid-hash'});
	    }else{            
                db.users.update({email: u.email}, {$set:{password: newPassword, hash: util.hash(u.email + util.time())}}, {safe:true}, function(err, count) {
                    if(err){
                        console.warn('ERROR while changing password of user ' + u.email);
                        callback && callback({msg: err});
                    }else if(count != 1){
                        callback && callback({msg: 'No password changed. Invalid hash.'});
                    }else callback && callback(null);
                });
            }
        });        

    };

    var checkHash = function(hash, callback) {
        db.users.findOne({hash: hash}, function(err, u){
	    if(err || !u){
                callback && callback({msg: 'invalid'});
	    }else{
                callback && callback();
            }
        });
    };

    var searchUsers = function(query, callback) {
        var results = [];
        var cursor = db.users.find({realname: new RegExp('' + query + '', 'i')}).limit(50);
        cursor.each(function(err, u){
	    if(u){
                results.push(u);
	    }else{
                callback && callback(results);
            }
        });
    };

    var getUserInfo = function(userID, callback){
        var id = BSON.ObjectID(userID);

        var readSimpleInfo = function(callback){
            db.users.findOne({_id: id}, function(err, u){
	        if(err || !u){
                    callback && callback(null);
	        }else{
                    callback && callback(u);
                }
            });    
        };
        
        var readBrainProfile = function(email, callback){
            db.brains.findOne({email: email}, {day: true}, function(err, b){
	        if(err || !b){
                    callback && callback(null);
	        }else{
                    callback && callback(b);
                }
            });        
        };
        
        readSimpleInfo(function(i){
            readBrainProfile(i.email, function(b){
                callback && callback({
                    realname : i.realname,
                    score : i.score,
                    nick : i.nick,
                    birthday : i.birthday,
                    country : i.country,
                    avatar: i.avatar,
                    followers: i.followers,
                    brain: b.day,
                    id: userID
                });
            });
        });

    };

    var getBrain = function(email, callback){
        db.brains.findOne({email: email}, function(err, b){
	    if(err || !b){
                callback && callback(null);
	    }else{
                callback && callback(b);
            }
        });        
    };

    var followAndUnfollow = function(followerID, followeeID, callback){
        function updateFollower(clbk){
            db.users.findOne({_id: BSON.ObjectID(followerID)}, function(err, u){
	        if(err || !u){
                    clbk && clbk({err: 'follower doesn\'t exists'});
	        }else{
                    var array = u.followees || [];
                    var index = array.indexOf(followeeID);
                    var follow = false;
                    if(index < 0){
                        array.push(followeeID);
                        follow = true;
                    }else{
                        array.splice(index, 1);
                    }            
                    db.users.update({_id: BSON.ObjectID(followerID)}, {$set:{followees: array}}, {safe:true}, function(err, count) {
                        if(err){
                            console.warn('ERROR while updating followees of user ' + u.email);
                            clbk && clbk({err: err});
                        }else{
                            follow && util.log('DATABASE', 'User ' + u.email + ' now follows ' + followeeID);
                            !follow && util.log('DATABASE', 'User ' + u.email + ' has stopped following ' + followeeID);
                            clbk && clbk({followeeID: followeeID, following: follow, user: u});
                        }
                    }); 
                }
            });
        }
        function updateFollowee(clbk){
            db.users.findOne({_id: BSON.ObjectID(followeeID)}, function(err, u){
	        if(err || !u){
                    clbk && clbk({err: 'followee doesn\'t exists'});
	        }else{
                    var array = u.followers || [];
                    var index = array.indexOf(followerID);
                    if(index < 0){
                        array.push(followerID);
                    }else{
                        array.splice(index, 1);
                    }            
                    db.users.update({_id: BSON.ObjectID(followeeID)}, {$set:{followers: array}}, {safe:true}, function(err, count) {
                        if(err){
                            console.warn('ERROR while updating followers of user ' + u.email);
                            clbk && clbk({err: err});
                        }else{
                            clbk && clbk();
                        }
                    }); 
                }
            });
        }
        updateFollowee(function(err){
            if(!err) updateFollower(callback);
            else console.warn(err.err);
        });
    };

    var getUsersCount = function(callback){
        db.users.count(function(err, c){
            callback(c);
        });
    };
    
    var getBrainsCount = function(callback){
        db.brains.count(function(err, c){
            callback(c);
        });
    };
    
    var isFollowing = function(followerID, followeeID, callback){
        db.users.findOne({_id: BSON.ObjectID(followerID)}, function(err, u){
            if(err || !u){
                callback && callback({err: 'follower doesn\'t exists'});
            }else{
                var array = u.followees || [];
                var following = array.indexOf(followeeID) > -1;
                callback && callback({following: following, followeeID: followeeID});
            }
        });
    };

    var updateUser = function(data, callback){
        db.users.update({email: data.email}, {$set:{realname: data.realname, avatar: data.avatar, birthday: data.birth, nick: data.nick, country: data.country}}, {safe:true}, function(err, count) {
            if(err){
                console.warn('ERROR while updating user ' + data.email);
                callback && callback();
            }else{
                db.brains.update({email: data.email}, {$set:{interests: data.interests}}, {safe:true}, function(err, count) {
                    if(err){
                        console.warn('ERROR while updating brain of user ' + data.email);
                        callback && callback();
                    }else{
                        db.users.findOne({email: data.email}, function(err, u){
                            if(err || !u){
                                callback && callback({msg: 'write but not recovered'});
                            }else{
                                callback && callback(u);
                            }
                        });            
                    }
                });                 
            }
        }); 

    };
    
    var recommendUsers = function(email, callback){
        callback([1, 2, 3]);        
    };
    
    
    // #############################################################################
    // ## GAMES SERVER #############################################################
    // #############################################################################

    require('./server/games.js')(util, test, fs, function(games, recommendGames){

        // games = games.concat(games.slice()); // for testing. delete later
        // games = games.concat(games.slice()); // for testing. delete later
        // games = games.concat(games.slice()); // for testing. delete later

        
        test('games module load', games != null, 'games = ' + games);
        
        if(!games){
            util.error('MAIN SERVER', 'Games server didn\'t return a games list');
            process.exit();
        }

        // #############################################################################
        // ## SOCKET.IO ################################################################
        // #############################################################################

        var io = require('socket.io').listen(server, {log: false});
        test('websockets module load (socket.io)', io != null, 'io = ' + io);
        util.log('WEBSOCKETS SERVER', 'running on port ' + PORT + '');

        // Sockets communication
        
        var sockets = [];

        io.on('connection', function(socket) {
            
            // Games socket
            
            games.forEach(function(g){
                socket.on(g.name, function(data){
                    g.on(data);
                });
                g.emit = function(msg){
                    socket.emit(g.name, msg);
                    socket.broadcast.emit(g.name, msg);
                };
            });

            // Events
            
            socket.on('login', function(data){
                var id = data.reqID;
                login(data.email, data.password, function(user){
                    socket.emit('login' + (id ? '-' + id : ''), user);
                });
            });
            
            var stress_sent = false;
            socket.on('register', function(user){
                var reqCount = user.reqCount;
                register(user, function(err){
                    util.log('MAIN SERVER', 'Registered user ' + user.email);
                    socket.emit('register', err);
                    getUsersCount(function(c){                        
                        if(c == reqCount && !stress_sent){
                            stress_sent = true;
                            console.log('Stress register for ' + reqCount + ' false users finishes');
                            socket.emit('stress-registered'); // stress-test only
                        }
                    });
                });
            });
            
            socket.on('delete-user', function(email){
                deleteUser(email, function(err){
                    util.log('MAIN SERVER', 'Deleted user ' + email);
                    socket.emit('delete-user-' + email, err);
                    getBrainsCount(function(c){
                        getUsersCount(function(c2){
                            if(c == 0 && c2 == 0 && !empty_sent){
                                empty_sent = true;
                                console.log('Stress deletion finishes');
                                socket.emit('empty');                        
                            }
                        });                        
                    });
                });
            });
            
            var empty_sent = false;
            socket.on('delete-brain', function(email){
                deleteBrain(email, function(err){
                    util.log('MAIN SERVER', 'Deleted brain ' + email);
                    socket.emit('delete-brain-' + email, err);
                });
            });

            socket.on('get-games', function(){
                socket.emit('get-games', games); // << provided by games module when loaded
            });           
            
            socket.on('recommend-games', function(email){
                recommendGames(email, function(recommended){
                    socket.emit('recommend-games', recommended);
                });
            });    
            
            socket.on('recommend-users', function(email){
                recommendUsers(email, function(recommended){
                    socket.emit('recommend-users', recommended);                
                });
            });    
            
            
            
            socket.on('delete-brains', function(){
                deleteBrains();
            });
            
            socket.on('users-count', function(id){                
                getUsersCount(function(count){
                    socket.emit('users-count' + (id ? '-' + id : ''), count);
                });
            });
            
            socket.on('brains-count', function(id){
                getBrainsCount(function(count){
                    socket.emit('brains-count' + (id ? '-' + id : ''), count);
                });
            });
            
            socket.on('activate', function(data){
                var userID = data.userID;
                activate(userID, function(err){
                    socket.emit('activate', err);
                });
            });
            
            socket.on('send-activation-email', function(data){
                var email = data.email;
				var url = null;
				if (data.url && !data.url.match(/breakbrain|54.235.122.62/)) {
					url = 'http://localhost:20661';
				}
                sendActivationEmail(email, url, function(err){
                    socket.emit('send-activation-email', err);
                });
            });
            
            socket.on('send-password-change-email', function(data){
				var url = null;
				if (data.url && !data.url.match(/breakbrain|54.235.122.62/)) {
					url = 'http://localhost:20661';
				}
                sendPasswordEmail(data.email, url, function(err){
                    socket.emit('send-password-change-email', err);
                });
            });
            
            socket.on('password-change', function(data){
                changePassword(data.hash, data.newpassword, function(err){
                    socket.emit('password-change', err);
                });
            });
            
            socket.on('check-hash', function(data){
                checkHash(data.hash, function(err){
                    socket.emit('check-hash', err);
                });
            });
            
            socket.on('search-users', function(data){
                searchUsers(data.query, function(results){
                    socket.emit('search-users', results);
                });
            });
            
            socket.on('user-complete-info', function(data){
                getUserInfo(data.userID, function(info){
                    socket.emit('user-complete-info', info);
                });
            });

            socket.on('follow/unfollow', function(data){
                var id = data.reqID;
                followAndUnfollow(data.followerID, data.followeeID, function(err){
                    socket.emit('follow/unfollow' + (id ? '-' + id : ''), err);
                });
            });
            
            socket.on('is following?', function(data){
                var id = data.reqID;
                isFollowing(data.followerID, data.followeeID, function(data){
                    socket.emit('is following?'  + (id ? '-' + id : ''), data);
                });
            });
            
            socket.on('brain', function(data){
                getBrain(data.email, function(brain){
                    socket.emit('brain', brain);
                });
            });
            
            socket.on('update-user', function(data){
                updateUser(data, function(user){
                    socket.emit('update-user', user);
                });
            });
            
            socket.on('ping', function(data){                
                socket.emit('ping' + (data ? data : ''), 'this is the ping confirmation');
            });
            
            socket.on('echo', function(data){                
                socket.emit('echo', data);
            });
            
            socket.on('delete-false-users', function(data){
                deleteFalseBrains(function(err){
                    deleteFalseUsers(function(err){
                        socket.emit('delete-false-users', err);                
                    });                
                });
            });

            socket.on('get-news', function(email){
                var n = {name: 'Perico de los Palotes', time: '2h ago', new: 'Has won 20 points of Memory playing example game', avatar: 'http://imagenes.es.sftcdn.net/avatars/gallery/MoviesAnimated/Oscar.jpg'};
                var news = [n,n,n,n];
                socket.emit('get-news', news);
            });

            socket.on('get-global-news', function(email){
                var n = {name: 'Perico de los Palotes', time: '2h ago', new: 'Has won 20 points of Memory playing example game', avatar: 'http://imagenes.es.sftcdn.net/avatars/gallery/MoviesAnimated/Oscar.jpg'};
                var news = [n,n];
                socket.emit('get-global-news', news);
            });
            
        });
        
        // #############################################################################
        // ## CALLBACK #################################################################
        // #############################################################################

        util.log('MAIN SERVER', 'The whole server is ready!');
        callback && callback(db, fs, register);        
        
        // #############################################################################
        // ## TESTS ####################################################################
        // #############################################################################
        
        if(ops.test){
            console.log();
            util.log('CORRECT UNIT TESTS', test_module.correct + ' (' + (test_module.correct / test_module.total * 100 | 0) + '%)');
            test_module.failed && util.error('FAILED UNIT TESTS', test_module.failed  + ' (' + (test_module.failed / test_module.total * 100 | 0) + '%)');
        }
    });
    
});
