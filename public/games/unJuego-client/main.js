window.game = (function(){

    var message = new Text('', "20px Arial", "black");
    message.textAlign = "center";
    message.x = 300;
    message.y = 220;
    message.maxWidth=500;
    stage.addChild(message);

    var name1 = new Text('Fulanito', "20px Arial", "black");
    name1.textAlign = "center";
    name1.x = 150;
    name1.y = 10;
    name1.maxWidth=250;
    stage.addChild(name1);
    var punt1 = new Text('0', "20px Arial", "black");
    punt1.textAlign = "center";
    punt1.x = 150;
    punt1.y = 40;
    punt1.maxWidth=250;
    stage.addChild(punt1);
    var ball1 = new Shape();
    ball1.y = 0;
    ball1.r = 50;
    ball1.graphics.beginFill("#FFFFFF");
    ball1.graphics.drawCircle(150, ball1.y, ball1.r);
    ball1.graphics.endFill();
    stage.addChild(ball1);
    var ball1op = new Text('op', "20px Arial", "black");
    ball1op.textAlign = "center";
    ball1op.x = 150;
    ball1op.y = -10;
    ball1op.maxWidth=90;
    stage.addChild(ball1op);

    var name2 = new Text('Mengano', "20px Arial", "black");
    name2.textAlign = "center";
    name2.x = 450;
    name2.y = 10;
    name2.maxWidth=250;
    stage.addChild(name2);
    var punt2 = new Text('0', "20px Arial", "black");
    punt2.textAlign = "center";
    punt2.x = 450;
    punt2.y = 40;
    punt2.maxWidth=250;
    stage.addChild(punt2);
    var ball2 = new Shape();
    ball2.graphics.beginFill("rgba(255, 255, 255, 0.5)");
    ball2.graphics.drawCircle(450,0,50);
    ball2.graphics.endFill();
    stage.addChild(ball2);
    var ball2op = new Text('op', "20px Arial", "black");
    ball2op.textAlign = "center";
    ball2op.x = 450;
    ball2op.y = -10;
    ball2op.maxWidth=90;
    stage.addChild(ball2op);

    var inputBuffer = new Text('Teclee el resultado y pulse INTRO', "20px Arial", "black");
    inputBuffer.textAlign = "center";
    inputBuffer.x = 300;
    inputBuffer.y = 450;
    inputBuffer.maxWidth=500;
    stage.addChild(inputBuffer);

    var input = '';
    var myball = null;

    return {
        start: function(){                       // Init and start game
            sendMessage({key: 'start', name: user.realname});
        },
        tick: function(){                        // Every update (variable FPS)
        },
        keydown: function(key){                  // KeyDown event
        },
        keyup: function(key){                    // KeyUp event
            var num = key.match(/\d/);
            if(key == 'Backspace'){
                input = input.slice(0, input.length - 1);
            }else if(key == 'Enter'){
                console.log('myball.sol = ' + myball.sol + ', input = ' + input);
                if(myball.sol == input|0){
                    message.text = 'correcto!';
                    sendMessage({key: 'solve', result: true});
                }else{
                    message.text = 'incorrecto!';
                }
                setTimeout(function(){
                    message.text = '';
                }, 1000);
                input = '';
            }else if(num){
                input += num;
            }
            inputBuffer.text = input;
            //sendMessage({key: 'solve', correct: true});
        },
        mousedown: function(x, y){
            // Mouse down
        },
        mouseup: function(x, y){
            // Mouse released
        },
        mousemove: function(x, y){
            // Mouse is moving
        },
        stop: function(){
            sendMessage({key: 'finish'});
        },
        onMessage: function(msg){
            switch(msg.key){
            case 'waiting':
                message.text = 'Esperando al rival';
                break;
            case 'update':
                if(message.text.match(/esperando/i)) message.text = '';
                if(msg.ball1.player == user.realname) myball = msg.ball1;
                else myball = msg.ball2;

                ball1.y = msg.ball1.pos;
                ball1op.y = msg.ball1.pos - 10;
                ball1op.text = msg.ball1.op;
                name1.text = msg.ball1.player;
                punt1.text = 'level ' + msg.ball1.level;

                ball2.y = msg.ball2.pos;
                ball2op.y = msg.ball2.pos - 10;
                ball2op.text = msg.ball2.op;
                name2.text = msg.ball2.player;
                punt2.text = 'level ' + msg.ball2.level;

                break;
            case 'winner':
                if(msg.winner == user.email){
                    message.text = 'You are the winner!';
                }else{
                    message.text = 'You lost!';
                }
            }
        }
    };
})();