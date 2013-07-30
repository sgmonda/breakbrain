module.exports = function(test, clientURL){

    var Game = require('../Game.js');
    var g = new Game(
        'Un juego',         // Name
        'Memory',           // Capacity
        'Working memory',    // Hability
        clientURL          // URL to the game client folder
    );

    var ball1 = {op: '1+1', sol: 2, pos: 0, level: 1},
        ball2 = {op: '1+1', sol: 2, pos: 0, level: 1};
    var balls = [ball1, ball2], winner = null;


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
        return op1 + op + op2;
    }

    // var genOp = function(level){
    //     level = (level || 1) * 10;
    //     var num = function(){
    //         return (Math.random() * level | 0) + 1;
    //     };
    //     var op = function(){
    //         var aux = Math.random();
    //         if(aux < 0.25) return '+';
    //         else if(aux < 0.50) return '-';
    //         else if(aux < 0.75) return '*';
    //         else return '/';
    //     };
    //     var operation = num() + op() + num();
    //     return operation;
    // };

    setInterval(function(){
        if(!winner){
            if(balls.length == 0){
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
                    key: 'update',
                    ball1: ball1,
                    ball2: ball2
                });
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
            }
            break;
        case 'solve':
            if(msg.result) balls[msg.from].level++;
            if(balls[msg.from].level == 15){
                winner = msg.from;
            }
            balls[msg.from].pos = Infinity;
            break;
        case 'finish':
            balls[msg.from] = {op: '1+1', sol: 2, pos: 0, level: 1};
            balls.push(balls[msg.from]);
            if(balls.length == 2) winner = null;
            break;
        }

    };

    //    test('este test es de un juego en concreto', true, 'falla el test particular');

    return g;
};
