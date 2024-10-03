const dbs = require('../../cmn/dbs');
const userModel = require('../../cmn/models/users.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const app = require('../app');

module.exports = {
    createuser: async function( usr ) {
        if( usr.pwd != '' ) {
            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(usr.pwd, salt);	// hash the password with the salt
            usr.pwd = hash;
        }
        let rslt = await userModel.saveUser( usr );
		return rslt;
	},
	authenticate: function( res, usr, pwd, next ) {
	try {		
		userModel.getUser( usr, null )
		.then( (doc) => {
			let id = doc._id.toString();
			let uname = doc.name;
			let hash = doc.pwd;
	
			bcrypt.compare(pwd, hash, function(err, rslt) {
				if( rslt == true ) {
					console.log('good pwd');
					var payload = {
						id: id,
						name: uname
						// role - todo
					}
					jwt.sign(payload, process.env.SECRET, { expiresIn: '4h' }, function(err, token) {
						if( err ) {
							console.log( "Token Sign Failed" );
						} else {
							//console.log( token );
                            // *** headers below for https ***
                            res.header("Access-Control-Allow-Origin", "*");
                            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                            // ***
							let tokstr = 'Bearer ' + token;
							res.setHeader('Authorization', tokstr);
							res.status(200).json({
							    state: true,
							    htt: token		
							});					
						}
					});
					/*
					let tokstr = 'Bearer ' + token;
					res.setHeader('Authorization', tokstr);
					res.status(200).json({
						state: true,
						htt: token							
					});
					*/
				} else {
					res.redirect( '/' );	// no match, send to login screen. TODO: return valid err msg
				}
			})
		})
		.catch((err)=> {
			return console.error(err);
		});	
	} catch( err) {
		console.error( err );
	}

	}
}; //module