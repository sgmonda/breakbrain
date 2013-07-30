/**
 * Batería de tests funcionales
 * Requisitos de ejecución: módulo 'vows' instalado globalmente,
 *                          servidor en funcionamiento
 * Ejecución: vows tests-functionality.js
 */

var vows = require('vows'),
    assert = require('assert'),
    util = require('./server/util.js'),
    breakbrain_websockets_server = 'http://localhost:20661',
    io = require('socket.io-client'),
    randomEmail = 'test' + util.time().replace(/\s|:/g, '') + '@test.com',
    socket = io.connect(breakbrain_websockets_server);

vows.describe('Pruebas funcionales de BreakBrain').addBatch({

    'Websockets connection': { // ============================================================

        topic: function(){
            
            var clbk1 = this.callback;            
            var result = {};
            
            // Timeout
            
            setTimeout(function(){
                clbk1('Connection timeout', null);
            }, 10000);
            
            // Ping
            
            socket.emit('ping', 99).on('ping99', function(resp){
                result.ping = resp;
         
                // Repeat

                result.repeatspected = 'owhghh2u89723h';
                socket.emit('echo', result.repeatspected).on('echo', function(data){                    
                    result.repeatreceived = data;
                    
                    // Callback
                    
                    clbk1(null, result);
                });
                
                
                
            });           

        },
        'Ping test': function(err, result) {
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.ping == 'this is the ping confirmation', 
                'Wrong ping message: ' + result.ping
            );
        },
        'Message communication': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            assert.ok(result.repeatspected == result.repeatreceived,
                      'Messages sent and received are different: ' + result.repeatspected + ', ' + result.repeatreceived);
        }
    }
    
}).addBatch({

    'Users and brains registration': { // ============================================================
        
        topic: function(){
            var clbk = this.callback;            
            var result = {};
            
            // Timeout
            
            setTimeout(function(){
                clbk('Connection timeout', null);
            }, 10000);
            
            // Register

            socket.emit('users-count', 1).on('users-count-1', function(count1){
                socket.emit('register', {
                    realname: randomEmail,
                    birthday: '',
                    password: 'test',
                    email: randomEmail,
                    country: '',
                    sex: '',
                    nick: ''
                }).on('register', function(err){
                    socket.emit('users-count', 2).on('users-count-2', function(count2){
                        result.register = [count1, count2];
                        
                        // Register brain
                        
                        socket.emit('brains-count', 1).on('brains-count-1', function(bcount1){
                            result.registerBrain = bcount1;
                            
                            // Callback
                            clbk(null, result);
                            
                        });
                    });
                });

            });
            
        },
        'Users count': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.register && typeof result.register[0] == 'number' && result.register[0] >= 0,
                'Users count (before registration) is not a valid number.'
            );
        },
        'Brain profiles count': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.register && typeof result.registerBrain == 'number' && result.registerBrain >= 0,
                'Brains count (after registration) is not a valid number.'
            );
        },        
        'Register user': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.register && result.register[0] + 1 == result.register[1],                 
                result.register? 'Users before register: ' + result.register[0] + ', users after register: ' + result.register[1] : 'Users count before or after register are not valid numbers'
            );
        },
        'Users/Brains correspondence': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.register &&  result.register[1] == result.registerBrain,
                result.register ? 'Users after register: ' + result.register[1] + ', brains after register: ' + result.registerBrain : 'Users count or brain profiles count are not valid numbers'
            );
        }

    }
    
}).addBatch({

    'User management': { // ============================================================
        
        topic: function(){
            var clbk = this.callback;
            var result = {};
            
            // Timeout
            
            setTimeout(function(){
                clbk('Connection timeout', null);
            }, 10000);
            
            // Login
            
            socket.emit('login', {
                email: randomEmail, 
                password: 'test'
            }).on('login', function(resp){                
                result.login = resp;

                // Retrieve user info
                
                socket.emit('user-complete-info', {userID: resp._id}).on('user-complete-info', function(user){
                    result.userInfo = user;
                    
                    // User modification
                    
                    var modUser = util.clone(user);
                    modUser.realname = 'newname';
                    modUser.email = randomEmail;
                    modUser.password = 'test';

                    socket.emit('update-user', modUser).on('update-user', function(data){
                        socket.emit('login', {reqID: 2, email: modUser.email, password: modUser.password}).on('login-2', function(user2){
                            result.updatedUserInfo = user2;

                            // Activation
                            
                            socket.emit('activate', {userID: user2._id}).on('activate', function(err){
                                socket.emit('login', {reqID: 3, email: modUser.email, password: modUser.password}).on('login-3', function(user3){
                                    result.activatedUserInfo = user3;
                                                                                                           
                                    // Callback
                                    
                                    clbk(null, result);
                                    
                                });
                            });
                        });
                    });
                });               
            });            
            
        },
        'Login': function(err, result) {
            assert.ok(!err, 'Error: ' + err);
            result = result || {};            
            assert.ok(
                !err && result.login && result.login.realname == randomEmail, 
                result.login ? 'Retrieved user\'s name = ' + result.login.realname : 'retrieved object is not a user'
            );
        },
        'Retrieve user info': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.userInfo, 
                result.userInfo ? 'Retrieved user\'s info = ' + result.userInfo :  'retrieved object is not a user'
            );
        },
        'Updating user info': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.userInfo && result.userInfo.realname != result.updatedUserInfo.realname && result.updatedUserInfo.realname == 'newname', 
                result.userInfo ? 'Old user\'s name = ' + result.userInfo.realname + ', new user\'s name = ' + result.updatedUserInfo.realname :  'retrieved object is not a user'
            );
        },
        'User account activation': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            assert.ok(
                !err && !result.updatedUserInfo.active && result.activatedUserInfo.active, 
                'Old user\'s active status = ' + result.updatedUserInfo.active + 
                    ', new user\'s active status = ' + result.activatedUserInfo.active
            );        
        }
    }
    
}).addBatch({

    'Miscellaneous': { // ============================================================
    
        topic: function(){        
            var clbk = this.callback;
            var result = {};
            
            // Timeout
            
            setTimeout(function(){
                clbk('Connection timeout', null);
            }, 10000);
            
            // Login
            
            socket.emit('login', {
                reqID: 88,
                email: randomEmail, 
                password: 'test'
            }).on('login-88', function(user){                  
                var hash = user.hash;
                
                // Check hash
                
                socket.emit('check-hash', {hash: hash}).on('check-hash', function(err){                    
                    result.hashError = err || {};
                    
                    // Callback
                    
                    clbk(null, result);
                });
                
            });
        },
        'Hash checking process': function(err, result){            
            assert.ok(!err, 'Error: ' + err);
            assert.ok(
                !err && !result.hashError.msg, 
                'Hash error = ' + result.hashError.msg
            );        
        }
        
    }
    
}).addBatch({

    'Social behavoir': { // ============================================================

        topic: function(){
            
            var clbk = this.callback;            
            var result = {};
            
            // Timeout
            
            setTimeout(function(){
                clbk('Connection timeout', null);
            }, 10000);
                      
            // Login
            
            socket.emit('login', {
                reqID: 5,
                email: randomEmail, 
                password: 'test'
            }).on('login-5', function(user){
                
                // Following status
                
                socket.emit('is following?', {
                    reqID: 1,
                    followerID: user._id,
                    followeeID: user._id
                }).on('is following?-1', function(data){
                    result.following = data;
                    
                    // Start following
                    
                    socket.emit('follow/unfollow', {
                        reqID: 1,
                        followerID: user._id,
                        followeeID: user._id
                    }).on('follow/unfollow-1', function(data){
                        result.startFollowing = data.following;

                        // Stop following
                        
                        socket.emit('follow/unfollow', {
                            reqID: 2,
                            followerID: user._id,
                            followeeID: user._id
                        }).on('follow/unfollow-2', function(data){
                            result.stopFollowing = data.following;
                            
                            // Users search
                            
                            socket.emit('search-users', {query: ''}).on('search-users', function(data){
                                result.search = data;
                                
                                // Callback
                                
                                clbk(null, result);
                                
                            });                                                        
                        }); 
                    });
                });
            });

        },
        'Following status checking': function(err, result) {
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && !result.following.err, 
                'Bad following status received: ' + result.following.err
            );
        },
        'Start following': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.startFollowing === true, 
                'Bad following status received: ' + result.startFollowing
            );
        },
        'Stop following': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            result = result || {};
            assert.ok(
                !err && result.stopFollowing === false, 
                'Bad following status received: ' + result.stopFollowing
            );
        }
        ,
        'Users search': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            assert.ok(
                !err && result.search.length > 0,
                'Bad search result: ' + result.search
            );
        }
    }
    
}).addBatch({

    'Games module': {
        topic: function(){
            var clbk = this.callback;
            var result = {};

            // Timeout
            
            setTimeout(function(){
                clbk('Connection timeout', null);
            }, 10000);
            
            // Get games
            
            socket.emit('get-games').on('get-games', function(data){
                result.games = data;
                
                // Games recommendation
                
                socket.emit('recommend-games', randomEmail).on('recommend-games', function(data){
                    result.gamesRecommendation = data;

                    
                    // Users recommendation
                    
                    socket.emit('recommend-users', randomEmail).on('recommend-users', function(data){
                        result.usersRecommendation = data;

                        // Callback
                        
                        clbk(null, result);
                    });

                });
                

                
            });
        },
        'Get games list': function(err, result){
            assert.ok(!err, 'Error: ', err);
            assert.ok(
                result.games && result.games.length > 0, 
                'No games list retrieved. result.games=' + result.games
            );
        },
        'Games recommendation': function(err, result){
            assert.ok(!err, 'Error: ', err);
            assert.ok(
                result.gamesRecommendation && result.gamesRecommendation.length > 0, 
                'No games list retrieved. result.gamesRecommendation=' + result.gamesRecommendation
            );
        },
        'Users recommendation': function(err, result){
            assert.ok(!err, 'Error: ', err);
            assert.ok(
                result.usersRecommendation && result.usersRecommendation.length > 0, 
                'No users list retrieved. result.usersRecommendation=' + result.usersRecommendation
            );
        }
    }
}).addBatch({
    
    'User and brain profile deletion': { // ============================================================
        
        topic: function(){
            var clbk = this.callback;
            var result = {};

            // Timeout
            
            setTimeout(function(){
                clbk('Connection timeout', null);
            }, 10000);
            
            // Delete user

            socket.emit('users-count', 23).on('users-count-23', function(count1){
                socket.emit('delete-user', randomEmail).on('delete-user-' + randomEmail, function(err){
                    socket.emit('users-count', 31).on('users-count-31', function(count2){
                        result.deleted = [count1, count2];

                        // Delete brain profile

                        socket.emit('brains-count', 19).on('brains-count-19', function(bcount1){
                            socket.emit('delete-brain', randomEmail).on('delete-brain-' + randomEmail, function(err){
                                socket.emit('brains-count', 12).on('brains-count-12', function(bcount2){
                                    result.brains = [bcount1, bcount2];

                                    // Callback
                                    
                                    clbk(null, result);
                                    
                                });
                            });                                
                        });                                
                    });
                });                                
            });                                
                
        },
        'Delete user': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            assert.ok(
                !err && result.deleted[0] - 1 == result.deleted[1],
                'Users count before deleting: ' + result.deleted[0] + 
                    ', Users count after deleting: ' + result.deleted[1]
            );
        },
        'Delete brain profile': function(err, result){
            assert.ok(!err, 'Error: ' + err);
            assert.ok(
                !err && result.brains[0] - 1 == result.brains[1],
                'Users count before deleting: ' + result.brains[0] + 
                    ', Users count after deleting: ' + result.brains[1]
            );
        }
    }
    
}).exportTo(module);

