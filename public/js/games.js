// games.js

var openedGame = null;

var prmstr = window.location.search.substr(1);
var prmarr = prmstr.split ("&");
var params = {};

for (var i = 0; i < prmarr.length; i++) {
    var tmparr = prmarr[i].split("=");
    params[tmparr[0]] = tmparr[1];
}

$(function(){

    showLoading();
    loadJS(['http://code.createjs.com/easeljs-0.5.0.min.js',
            //'http://code.createjs.com/movieclip-0.5.0.min.js',
            //'http://code.createjs.com/tweenjs-0.3.0.min.js',
            //'http://code.createjs.com/soundjs-0.3.0.min.js',
            //'http://code.createjs.com/preloadjs-0.2.0.min.js',
            '/games/bbgame-core.js'], function(){

                var game_template = document.getElementById('games-list').innerHTML.replace(/(\n|\t)/g, '').match(/<!--{(.*)}-->/)[0].replace(/(<!--{|}-->)/g, '');

                var games = {};
                socket.emit('get-games').on('get-games', function(gs){
                    if(gs){
                        $('#games-list').empty();
                        gs.forEach(function(item){
                            games[item.name] = item;
                            $('#games-list').append(game_template.replace(/{{name}}/g, item.name)
                                                    .replace(/{{capacity}}/g, item.capacity)
													.replace(/{{hability}}/g, item.hability)
                                                    .replace(/{{img}}/g, item.client_logo));
                        });
						hideLoading();
                        $('.game').on('click', function(){
                            $('#game-loaded').slideUp();
                            var aux = games[$(this).attr('id')];
							openedGame = aux.name;
                            loadJS([aux.client_logic], function(){
                                window.game.name = aux.name;
                                window.bbgames.onTick(window.game.tick);
                                window.bbgames.onMouseDown(window.game.mousedown);
                                window.bbgames.onMouseUp(window.game.mouseup);
                                window.bbgames.onMouseMove(window.game.mousemove);
                                window.bbgames.onKeyDown(window.game.keydown);
                                window.bbgames.onKeyUp(window.game.keyup);
                                socket.on(aux.name, function(data) {
									if (window.game) {
										window.game.onMessage(data);
									}
                                });
                                window.game.start();
                            });

                            $('#game').css('background', 'url(' + aux.client_background + ')');
                            $('#game-loaded').slideDown();

                        });

						console.log('here');
						$('#' + params.open).click();
                    }
                });


                $('#game-close').on('click', function(){
					console.log(window.game);
					if (window.game.finished || confirm('Are you sure you want to close? You will lose this game')) {
						$('#game-loaded').slideUp();
						window.game.stop();
						window.bbgames.cleanStage();
						window.game = null;
					}
                });

            });

    socket.emit('get-online-users').on('get-online-users', function (users) {
		$('#connected-users-list').empty();

		for (var email in users) {

			var u = users[email];
			var li = $('<li data-email="' + email + '"><img class="avatar" src="' + u.avatar + '"/><span class="name">' + u.realname + '</span><span class="nick">' + u.nick + '</span><span class="country">' + u.country + '</span></li>');
			$('#connected-users-list').append(li);

			li.on('click', function () {
				var invited = $(this).data('email');
				if (invited == user.email) {
					alert('You cannot play against yourself');
					return;
				}
				socket.emit('game-invite', {
					game: openedGame,
					player: user.realname,
					invited: invited
				});
				alert('An invitation has been sent to ' + u.realname);
			});
		}

	});


});
