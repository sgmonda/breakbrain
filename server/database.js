// #############################################################################
// ## DATABASE #################################################################
// #############################################################################

var callback;
var util;
var db_user = 'piolin-rojo';
var db_pass = 'violonchelo_deColores';

module.exports = function(u, test, clbk){
    util = u;
    util.log('DATABASE', 'Connecting to MongoDB database...');                
    callback = clbk;
    

    var mongo = require('mongodb'),
        Server = mongo.Server,
        Db = mongo.Db,
        Collection = mongo.Collection;
    var BSON = mongo.BSONPure;

    test('mongodb module load', mongo != null, 'mongo = ' + mongo);
    test('database server creation', Server != null, 'Server = ' + Server);
    test('database object creation', Db != null, 'Db = ' + Db);
    test('database collection retrieval', Collection != null, 'Collection = ' + Collection);
    
    var mongoServer = new Server('ds035907.mongolab.com', 35907, {auto_reconnect: true});
    var db_aux = new Db('breakbrain', mongoServer);
    var db = null;
    var db_coll_users = null, db_coll_brains = null;

    test('connection to mongo server', mongoServer != null, 'mongoServer = ' + mongoServer);
    test('connection to mongo db', db_aux != null, 'db_aux = ' + db_aux);
    
    db_aux.open(function(err, db_aux) {
        test('database connection opening', !err, 'err = ' + err);
        if(!err) {
	    db_aux.authenticate(db_user, db_pass, function(err){
                test('database authentication', !err, 'err = ' + err);
                if(!err){
                    util.log('DATABASE', 'Connected and authenticated successfully');                
	            db = db_aux;
		    db_coll_users = new Collection(db, 'users');
                    db_coll_brains = new Collection(db, 'brains');
                    callback && callback({users: db_coll_users, brains: db_coll_brains}, BSON);
	        }else{
		    console.warn('ERROR while authenticating to database: ', err);
	        }
	    });	
        }else{
    	    console.warn('ERROR while opening database: ', err);
        }
    });
    
};

