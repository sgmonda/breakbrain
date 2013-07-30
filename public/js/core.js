// #############################################################################
// ## GLOBAL OBJECTS ###########################################################
// #############################################################################

var socket = null;
var user = objFromSession('user');
var page = document.getElementsByTagName('breakbrain-ref')[0].innerHTML;

if(page != 'login' && page != 'index' && page != 'password') showLoading();

// #############################################################################
// ## ACCESS CONTROL ###########################################################
// #############################################################################

user.email = user.email || window.localStorage.email;
user.password = user.password || window.localStorage.password;

loadJS(['/socket.io/socket.io.js'], function(){

    if(page != 'index' && page != 'login' && page != 'password' &&  (!user.email || !user.password)){
        window.location = 'login.html';
    }else if(page == 'login' && user.email && user.password){
        window.location = 'home.html';
    }

    // #############################################################################
    // ## JS LIBRARIES #############################################################
    // #############################################################################

    if(page == 'login' || page == 'password') loadJS(['/js/sha1.js']);

    loadJS([
        '/js/justgage/justgage.1.0.1.min.js',
        '/js/justgage/raphael.2.1.0.min.js',
        '/js/knob/jquery.knob.js',
        '//ajax.googleapis.com/ajax/libs/jqueryui/1.8.23/jquery-ui.min.js'
    ], function(){

        // Specific script
        loadJS(['/js/' + page + '.js']);

        // ## SOCKET.IO ################################################################

        //var breakbrain_websockets_server = 'http://breakbrain.nodester.com:80';
        var breakbrain_websockets_server = 'http://localhost:20661';
        socket = io.connect(breakbrain_websockets_server);

        // #############################################################################
        // ## LOAD COMPONENTS DINAMICALLY ##############################################
        // #############################################################################

        var havingUser = function(){ // Called when we have the whole user object

            $(function(){ // When page is loaded

                // Header

                $('#header').load('/header.html', function(){
                    $('.goto-' + page).css('opacity', 1);
                    loadJS(['/js/header.js'], function(){
                        setTimeout(function(){
                            hideLoading();
                        }, 0);
                    });

                });

            });

        };

        // #############################################################################
        // ## AUTHENTICATION AND SESSION ###############################################
        // #############################################################################


        if(page != 'login'&& page != 'index '){
            if(user.realname){ // we come from login
                havingUser();
            }else{
                showLoading();
                socket.emit('login', {
                    username: user.username,
                    password: user.password
                });
                socket.on('login', function(user){
                    objToSession(user, 'user');
                    havingUser();
                });
            }
        }

    });

});