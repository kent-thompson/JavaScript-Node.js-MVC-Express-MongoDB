const jwt = require('jsonwebtoken');

module.exports = {

/* sign: ( payload, $Options) => {	// NOT currently used.
	jwt.sign(payload, privateKEY, (err, token) => {
		return token;
	});
}, 
verify: ( req, token, $Option) => {
	try{
		return jwt.verify(token, publicKEY, verifyOptions);
	}catch (err){
		return false;
	}
},
*/

verfiyUI: (req, res, next ) => {
	token = req.body.htt;	// jwt token. no testing, if token messed up in any way, it will fail, which is okay

	jwt.verify(token, process.env.SECRET, (err, authdata) => {
		if( err ) {
			req.root = false;
		} else {
			req.user_id = authdata.id;
			//console.log(authdata);
			req.root = true;
		}
	});
	next();
},
verfiyAPI: (req, res, next ) => {
	let token = req.headers.authorization.split(" ")[1];	// jwt token. no testing, if token messed up in any way, it will fail, which is okay
	jwt.verify(token, process.env.SECRET, (err, authdata) => {
		if( err ) {
			req.root = false;
		} else {
			//d = authdata;
			req.root = true;
		}
	});
	next();
},
decode: (token) => {
		return jwt.decode(token, {complete: true}); 		//returns null if token is invalid
	}
}