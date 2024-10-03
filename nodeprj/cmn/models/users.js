const dbs = require('../../cmn/dbs');

module.exports = {
    getUsers: function() {
        var p = new Promise( function(resolve, reject) {
            const db = dbs.getDB();
            db.collection('users').find( {} ).toArray()
            .then( (docs) => {
                resolve( docs );
            })
            .catch( (err) => { 
                reject( err );
            });            
        });
        return p;
	},	
    getUser: function(usr, pwd) {
		var db = dbs.getDB();
		return  db.collection('users').findOne( {$or: [ {'name': usr} ]} )
	},
    findById: function( did ) {
        let p = new Promise( function(resolve, reject) {
            var db = dbs.getDB();
            var objectId = dbs.getObjectId();
			db.collection('users').findOne( {_id: new objectId( did )}, 
			function(err, doc) {
                if (err) {
                    reject( err );
                } else {    
                    resolve( doc );
                }
            });
        });
        return p;
	},
	saveUser: function(usr) {
		const db = dbs.getDB();
		var rec = null;
		try {
			rec = db.collection('users').insertOne( usr );
		} catch( e ) {
			print( e );
		} 
		if( rec.acknowledged = true ) {
			console.log( 'user record saved' );
			return true;
		} else {
			console.log( 'user record NOT saved' );
			return false;
		}
	},
	updateUser: function(usr) {
		let p = new Promise( function(resolve, reject) {
		const db = dbs.getDB();
		let objectId = dbs.getObjectId();
		db.collection('users').updateOne( {_id: objectId( usr._id ) },
				{ $set: { "name" : usr.name, 
					"email" : usr.email, 
					"comment" : usr.comment, 
					"bdate" : usr.bdate 
				},
			})
			.then( (rslt) => {
				resolve( rslt );
			}) 
			.catch( (err) => { 
				reject( err );
			});
		});
		return p;
	},
	deleteById: function( id ) {
        let p = new Promise( function(resolve, reject) {
			const db = dbs.getDB();
			let objectId = dbs.getObjectId();
			db.collection('users').deleteOne( {_id: objectId(id) } )
			.then( (rslt) => {
				resolve( rslt );
			}) 
			.catch( (err) => { 
				reject( err );
			});
		});
		return p;
	},		
};//module


/*         let p = new Promise( function(resolve, reject) {
            var db = dbs.getDB();
            var objectId = dbs.getObjectId();
			db.collection('users').findOne( {$or: [ {'name': usr} ]}, 
			function(err, doc) {
                if (err) {
                    reject( err );
                } else {    
                    resolve( doc );
                }
            });
        });
		return p;
 */		
