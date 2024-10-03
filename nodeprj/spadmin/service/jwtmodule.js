const jwt = require('jsonwebtoken');

// use 'utf8' to get string instead of byte array  (512 bit key)
//var privateKEY  = fs.readFileSync('../cmn/localcerts/private.key', 'utf8');
//var publicKEY  = fs.readFileSync('../cmn/localcerts/public.key', 'utf8');

module.exports = {
sign: ( payload, $Options ) => {

//#region cmt
/*
	sOptions = {
	issuer: "Authorizaxtion/Resource/This server",
	subject: "iam@user.me", 
	audience: "Client_Identity" // this should be provided by client
	}	
	// Token signing options
	var signOptions = {
		issuer:  $Options.issuer,
		subject:  $Options.subject,
		audience:  $Options.audience,
		expiresIn:  "1d",    // 1 day validity
		algorithm:  "RS256"    
	};
*/
	//jwt.sign(payload, privateKEY, signOptions, (err, jwt) => {
//#endregion

	jwt.sign( payload, privateKEY, (err, token) => {
		return token;
	});
},
verify: ( req, token, $Option ) => {
	try {
		return jwt.verify(token, publicKEY, verifyOptions);
	} catch( err ) {
		return false;
	}
	
//#region cmt	
//verify: (token, $Option) => {
	/*
	vOption = {
	issuer: "Authorization/Resource/This server",
	subject: "iam@user.me", 
	audience: "Client_Identity" // this should be provided by client
	}  
	
	var verifyOptions = {
		issuer:  $Option.issuer,
		subject:  $Option.subject,
		audience:  $Option.audience,
		expiresIn:  "30d",
		algorithm:  ["RS256"]
	};
	*/
//#endregion
},
verfiyUI: ( req, res, next ) => {
	token = req.body.htt;	// jwt token. no testing, if token messed up in any way, it will fail, which is okay

	jwt.verify(token, process.env.SECRET, (err, authdata) => {
		if( err ) {
			//req.login = false;
			req['login'] = false;
		} else {
			d = authdata;
			//req.login = true;
			req['login'] = true;
		}
	});
	next();
},
verfiyAPI: ( req, res, next ) => {
	let token = req.headers.authorization.split(" ")[1];	// jwt token. no testing, if token messed up in any way, it will fail, which is okay
	jwt.verify(token, process.env.SECRET, (err, authdata) => {
		if( err ) {
			//req.login = false;
			req['login'] = false;
		} else {
			d = authdata;
			//req.login = true;
			req['login'] = true;
		}
	});
	next();
},
decode: (token) => {
		return jwt.decode(token, {complete: true}); 		//returns null if token is invalid
	}
}