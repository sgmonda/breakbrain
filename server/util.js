// #############################################################################
// ## UTIL #####################################################################
// #############################################################################

var color = {
    'reset': '\033[0m',
    'bold': '\033[1m',
    'italic': '\033[3m',
    'underline': '\033[4m',
    'blink': '\033[5m',
    'black': '\033[30m',
    'red': '\033[31m',
    'green': '\033[32m',
    'yellow': '\033[33m',
    'blue': '\033[34m',
    'magenta': '\033[35m',
    'cyan': '\033[36m',
    'white': '\033[37m',
    'reset' : '\u001b[0m'
};

var time = function(){
    return new Date().toGMTString().substr(0, 25) + ' (GMT)';
};

var log = function(who, text){
    console.log(color.white + color.bold + time() + color.yellow + ' :: ' + color.green + who + ': ' + color.reset + text);
};

var error = function(who, text){
    console.log(color.white + color.bold + time() + color.yellow + ' :: ' + color.red + who + ': ' + color.reset + text);
};

var warning = function(who, text){
    console.log(color.white + color.bold + time() + color.yellow + ' :: ' + color.yellow + who + ': ' + color.reset + text);
};

var hash = function(str){
    return new Buffer(str).toString('base64').replace(/=/g, '').replace(/\+/g, '');
};

var clone = function(obj){
    if(obj == null || typeof(obj) != 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj)
        temp[key] = clone(obj[key]);
    return temp;
};

// Exports

exports.time = time;
exports.log = log;
exports.warning = warning;
exports.error = error;
exports.hash = hash;
exports.clone = clone;