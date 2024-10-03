// dbs module
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
var clientDB = null;

module.exports = {
    initDB: function() {
		//const url = 'mongodb://74.208.242.240:27017'; // connection URL
		const url = 'mongodb://127.0.0.1:27017';        // connection URL
        const dbName = 'sa_db';                         // database name
		
        MongoClient.connect(url, { useNewUrlParser: true, poolSize: 10, useUnifiedTopology: true }, function(err, client) {
            if( err ) {
                console.log('Error: NOT Connected to MongoDB. Run mon.sh.');
                return;
            }
            //assert.equal(null, err);
            console.log('Connected to Mongo successfully');
            clientDB = client.db(dbName);
        });
    },
    getDB: function() {
        if( clientDB != null || clientDB != undefined ) {
            return clientDB;
        } else {
            //console.log("getDB() failed");
            throw Error( "getDB() failed" );
        }
    },
    getObjectId: function() {
		return require('mongodb').ObjectID;
    }
};