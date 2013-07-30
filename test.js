var assert = require('assert');
var util = require('./server/util.js');
module.exports = {
    total: 0,
    correct: 0,
    failed: 0,
    optest: true
};

module.exports.ok = function(name, expression, err_msg){
        module.exports.total++;
    if(module.exports.optest)
        try{
            assert.ok(expression, err_msg);
            module.exports.correct++;
            util.log('UNIT TEST ' + module.exports.total + ' CORRECT', '' + name);
        }catch(err){
            module.exports.failed++;
            util.error('UNIT TEST FAILS', err.message);
        }
};
