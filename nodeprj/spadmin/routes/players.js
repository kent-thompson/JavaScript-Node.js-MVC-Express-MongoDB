const express = require('express');
const router = express.Router();
const playerModel = require('../../cmn/models/players.js');
const entities = require('../../cmn/models/entities');
const jwt = require('../service/jwtmodule.js');
const validator = require('validator');

const cors = require('cors');
//import validator from 'validator';


// *** Player GUI Calls ***
router.post('/addplayer', jwt.verfiyUI, function(req, res, next) {
	if( req.login ) {
		let n = validator.isAscii(req.body.name);
		if( n ) {
			n = validator.trim(req.body.name);
		}
 		//let n = escape( req.body.name );
		 
 		let f = escape( req.body.fname );
 		let l = escape( req.body.lname );		 
		let e = escape( req.body.email );
		let b = escape( req.body.bdate );
		let p = escape( req.body.pwd );
		let pl = new entities.dbPlayer(null, n, f, l, e, 0, b, p);

		//let pl = new entities.dbPlayer(null, req.body.name, req.body.email, 0, req.body.bdate, req.body.pwd);
		playerModel.addPlayer( pl )
		.then( (data) => {
            res.render( 'playerlist', {page:'Players', menuId:'players', state:'add'} );
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		//res.redirect( 307, '/');
	}
});

router.post('/updateplayer', jwt.verfiyUI, function(req, res, next) {
	if( req.login ) {				
		let pl = new entities.dbPlayer(req.body.docid, req.body.name, req.body.fname, req.body.lname, req.body.email, 100, req.body.bdate);
		playerModel.updatePlayer(pl)
		.then( (data) => {
            res.render( 'playerlist', {page:'Players', menuId:'players', state:'add'} );
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 307, '/');
	}		
});

/*
router.post('/deleteplayerbyid', jwt.verfiyUI, function(req, res, next) {
	if( req.login ) {				
		let id = escape( req.body.docid );
		playerModel.deletePlayer( id )
		.then( (data) => {
			res.redirect( 307, '/plyr/playerlist' );
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 307, '/');
	}	
});
*/

/*
router.get('/playerlist', function(req, res, next) {
	//if( req.login ) {				
		res.render( 'playerlist', {page:'Players', menuId:'players', state:'add'} );
	//} else {
	//	res.redirect( 307, '/');
	//}
});
*/

router.post('/playerlist', jwt.verfiyUI, function(req, res, next) {
	if( req.login ) {				
		res.render( 'playerlist', {page:'Players', menuId:'players', state:'add'} );
	} else {
		res.redirect( 307, '/');
	}
});

router.get('/getplayerform', cors(process.env.CORS), function(req, res, next) {					// empty form on add
	let id = req.body.docid;
	res.render( 'playerform', {page:' New Player Account', menuId:'players', state:'add', docid:id} );

});

router.post('/getplayerform', jwt.verfiyUI, function(req, res, next) {	// filled in form for edit
	if( req.login ) {				
		let id = req.body.docid;
		res.render( 'playerform', {page:'Players', menuId:'players', state:'add', docid:id} );
	} else {
		res.redirect( 307, '/');
	}
});

module.exports = router;