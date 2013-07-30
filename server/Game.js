var util = require('../server/util.js');
module.exports = function(name, capacity, hability, clientURL){

    util.log('GAMES-MODULE', 'Loading game "' + name + '"... in ' + hability + ' (' + capacity + ')');

    this.name = name;
    this.client = clientURL;
    this.client_logic = clientURL + 'main.js';
    this.client_logo = clientURL + 'logo.png';
    this.client_background = clientURL + 'background.png';
    this.capacity = capacity;
    this.hability = hability;
    // this.setSocket = function(s){
    //     this.__socket = s;
    // };
    // this.on = function(key, handler){
    //     this.__socket && this.__socket.on(name + key, handler);
    // };
    this.emit = function(key, data){
        this.__socket && this.__socket.emit(name + key, data);
    };

    this.stop = function(){
        console.log('Esto mata al juego');
    };

    this.start = function(){
        console.log('Esto inicia el juego');
    };

    // Monitoring socket
    // setInterval((function(self){
    //     return function(){console.log('__socket = ' + self.__socket);};
    // })(this), 1000);
};