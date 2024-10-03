const dbs = require('../../cmn/dbs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    findByUsername: function(uname, pwd) {
		const db = dbs.getDB();
		return db.collection('players').findOne( {$or: [ {'uname': uname} ]} );
	},
    getPlayers: function() {
        var p = new Promise( function(resolve, reject) {
            const db = dbs.getDB();
            db.collection('players').find( {} ).toArray()
            .then( (docs) => {
                resolve( docs );
            })
            .catch( (err) => { 
                reject( err );
            });            
        });
        return p;
	},
	findById: function( did ) {
		const db = dbs.getDB();
		const objectId = dbs.getObjectId();
		return db.collection('players').findOne( {_id: new objectId( did )} );
    },
/*
	findById: function( did ) {
        let p = new Promise( function(resolve, reject) {
            var db = dbs.getDB();
            var objectId = dbs.getObjectId();
			db.collection('players').findOne( {_id: new objectId( did )}, 
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
	*/
	addPlayer: function( doc ) {        // TODO: check for sql injection
        let p = new Promise( function(resolve, reject) {
           	const db = dbs.getDB();
           	db.collection('players').insertOne( doc )
            .then( (rec) => {
                resolve( rec );
            }) 
            .catch( (err) => { 
                reject( err );
            });
        });
        return p;
	},
	updatePlayer: function(pl) {
		let p = new Promise( function(resolve, reject) {
		const db = dbs.getDB();
		let objectId = dbs.getObjectId();
		db.collection('players').updateOne( {"_id": objectId( pl._id ) },
				{ $set: { 
					'uname' : pl.uname,
					'fname' : pl.fname,
					'lname' : pl.lname,
					"email" : pl.email, 
					"bdate" : pl.bdate 
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
	deletePlayer: function( id ) {
        let p = new Promise( function(resolve, reject) {
			const db = dbs.getDB();
			let objectId = dbs.getObjectId();
			db.collection('players').deleteOne( {_id: objectId(id) } )
			.then( (rslt) => {
				resolve( rslt );
			}) 
			.catch( (err) => { 
				reject( err );
			});
		});
		return p;
	},
	createplayer: function( player ) {
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(player.pwd, salt);	// hash the password with the salt
		player.pwd = hash;

		let rslt = this.addPlayer( player );
		return rslt;
	},
	authenticate: function( id, uname, pwd, hash ) {	
		return new Promise( function(resolve, reject) {
			bcrypt.compare( pwd, hash, function(err, rslt ) {
				if( rslt == true ) {
					//console.log('good pwd');
					var payload = {
						id: id,
						name: uname
					}
					let token = jwt.sign( payload, process.env.SECRET, {expiresIn:'4h'} );
					//console.log('got token');
					resolve( token );
				} else {
					console.error(err);
					reject( 'No Token' );
				}
			});// bcrypt
		});//promise
	}

};//module