var util = require('../../server/util.js');

module.exports = function(test, clientURL) {

	var Game = require('../Game.js');
	var g = new Game(
		'Pompitas', // Name
		'PRO', // Capacity
		'PRO-ARI', // Hability
		clientURL // URL to the game client folder
	);

	var ball1, ball2, balls, players, winner, started;

	function init() {
		ball1 = {op: '1+1', sol: 2, pos: 0, level: 1};
		ball2 = {op: '1+1', sol: 2, pos: 0, level: 1};
		balls = [ball1, ball2], winner = null;
		started = false;
		players = [];
	}
	init();

	function genOp(level){
		level += 1;
		var op1 = (Math.random() * level)|0;
		var op2 = (Math.random() * level)|0;
		var op = '*';
		var r = Math.random();
		if(r < 0.25){
			op2 = (Math.random() * level)|0 + 1;
			op1 = op2 * ((Math.random() * (level+1))|0);
			op = '/';
		}else if(r < 0.5){
			op = '+';
		}else if(r < 0.75){
			if(op2 > op1){
				var aux = op2;
				op2 = op1;
				op1 = aux;
			}
			op = '-';
		}
		return op1 + ' ' + op + ' ' + op2;
	}

	setInterval(function(){
		if(!winner){
			if (balls.length === 0) {
				ball1.pos += ball1.level;
				ball2.pos += ball2.level;
				if(ball1.pos > 470){
					ball1.pos = 0;
					ball1.op = genOp(ball1.level);
					ball1.sol = eval(ball1.op);
				}
				if(ball2.pos > 470){
					ball2.pos = 0;
					ball2.op = genOp(ball2.level);
					ball2.sol = eval(ball2.op);
				}
				g.emit({
					key: started ? 'update' : 'init',
					ball1: ball1,
					ball2: ball2
				});
				started = true;
			}else{
				g.emit({key: 'waiting'});
			}
		}else{
			g.emit({key: 'winner', winner: winner});
		}
	}, 100);

	g.on = function(msg){
		switch(msg.key){
		case 'start':
			if(balls.length){
				balls[msg.from] = balls.shift();
				balls[msg.from].player = msg.name;
				players.push(msg.from);
			}
			break;
		case 'solve':
			if(msg.result){
				balls[msg.from].level++;
			}
			if(balls[msg.from].level == 15){
				winner = msg.from;
			}
			balls[msg.from].pos = Infinity;
			break;
		case 'finish':
			if (!winner) {
				if (players[0] == msg.from) {
					winner = players[1];
				} else {
					winner = players[0];
				}
			}
			delete balls[msg.from];
			if (Object.keys(balls).length === 0) {
				util.log('GAME_POMPITAS', 'Game reset');
				init();
			}
			break;
		}

	};

	//	test('este test es de un juego en concreto', true, 'falla el test particular');

	return g;
};
