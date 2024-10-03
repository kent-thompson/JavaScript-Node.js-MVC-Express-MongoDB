const userService = require('../service/userService.js');
var express = require('express');
var router = express.Router();	// ===>>> all calls here are /users <<<===
const userModel = require('../../cmn/models/users.js');
const entities = require('../../cmn/models/entities');
const jwt = require('../service/jwtmodule.js');

// API calls  
/*
router.get('/', jwt.verfiyAPI, function(req, res, next) {	// get users list = /users
	if( req.login ) {
		userModel.getUsers()
		.then( (data) => {
			let perPage = 25;
			let page = req.params.page || 1;	// TODO: needs work
			res.send(data);
			res.end();
		})
		.catch( (err) => { 
			res.send( err );
		});
	 } else {
		res.redirect( 307, '/');
	}		
});

router.post('/getuserbyid', jwt.verfiyAPI, function(req, res, next) {
	if( req.login ) {	
		let id = req.body.docid;
		userModel.findById(id)
		.then( (data) => {
			res.setHeader('Content-Type', 'application/json');
			res.send(data);
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 307, '/');
	}
});
*/

//*** Form / GUI calls ***

router.get('/createuser_ui', function(req, res) {
		res.render('new-account');
});

router.post('/createuser', jwt.verfiyUI, function(req, res ) {
	if( req.login ) {
		let usr = new entities.dbUser( null, req.body.uname, req.body.email, null, req.body.bdate, req.body.psw );
		let rslt = userService.createuser( usr );
		if( rslt == true ) {
			res.redirect( 307, '/users/userlist');
		} else {
			res.render( '/error' );
		}
	} else {
		res.redirect( 307, '/');
	}	
});

router.post('/updateuser', jwt.verfiyUI, async function(req, res ) {
	if( req.login ) {
		let usr = new entities.dbUser(req.body.docid, req.body.uname, req.body.email, req.body.comment, req.body.bdate);
		await userModel.updateUser(usr);
		res.redirect( 307, '/users/userlist');
	} else {
		res.redirect( 307, '/');
	}
});

router.post('/deleteuserbyid', jwt.verfiyUI, function(req, res, next) {
	if( req.login ) {
		let id = req.body.docid;
		userModel.deleteById(id)
		.then( (data) => {
			res.redirect( 307, '/users/userlist');
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {

	}
});

router.post('/getuserform', jwt.verfiyUI, function(req, res, next) {
	if( req.login ) {
		let docid = req.body.dss;	// TODO: needs work
		res.render('userform', {
			page:'User Info',
			menuId:'admin',
			docid: docid
		})
	} else {
		res.redirect( 307, '/');
	}	
});

router.post('/userlist', jwt.verfiyUI, function(req, res, next) {
	let perPage = 25;
	if( req.login ) {
		let page = req.params.page || 1;	// TODO: needs work
		res.render('userlist', {
			page:'User List',
			menuId:'admin',
			current: page,
			//pages: Math.ceil(count / perPage)
		})
	} else {
		res.redirect( 307, '/');
	}
});
module.exports = router;