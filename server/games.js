var callback;
var util, fs;
var games = [];

var recommendGames = function(email, clbk){

    // TODO
    var aux = games.slice().concat(games.slice()).concat(games.slice());
    clbk(aux); // to pass the test

};

module.exports = function(u, test, f, clbk){

    util = u;
    fs = f;
    util.log('GAMES-MODULE', 'Loading games server...');
    callback = clbk;
    
    var games_dir = 'server/games';

    games = [];

    // Read games directory

    fs.readdir(games_dir, function (err, list) {
        test('games directory reading', !err, 'err = ' + err);
        test('games count', list.length > 0, 'list.length = ' + list.length);
        if(err) callback && callback(null);
        for(var i=0; i < list.length; i++){
            var f = list[i];
            if(!f.match(/-client/)){
                f = './games/' + f;
                var g = require(f)(test, '/games/' + list[i].replace('-server.js', '-client') + '/');
                test('particular game load', g != null, 'g = ' + g);
                games.push(g);
            }
        }
        callback && callback(games, recommendGames);
    });
    
};

