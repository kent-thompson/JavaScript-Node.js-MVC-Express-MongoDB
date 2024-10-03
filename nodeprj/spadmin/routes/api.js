const express = require('express');
const router = express.Router();
const request = require('request')
const cors = require('cors');
const userService = require('../service/userService.js');
const playerModel = require('../../cmn/models/players.js');
const userModel = require('../../cmn/models/users.js');
const entities = require('../../cmn/models/entities');
const jwt = require('../service/jwtmodule.js');


router.get('/cats', function(req, res) {
    let url = 'https://catfact.ninja/fact'
    request(url, (error, response, body) => {
     
        // Printing the error if occurred
        if(error) console.log(error)
        
        // Printing status code
        console.log(response.statusCode);
          
        // Printing body
        //let b = JSON.parse( body );
        //let b = body.fact;
        console.log( body );
        res.send( body );
    });
});    

// *** Players ***
//----------------
router.get('/players', jwt.verfiyAPI, (req, res, next) =>  {
	if( req.login ) {		
		playerModel.getPlayers()
		.then( (data) => {
			res.send(data);
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 303, '/');
	}	
});

router.post('/getplayerbyid', jwt.verfiyAPI, (req, res, next) => {
    //res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	if( req.login ) {				
		let id = req.body.docid;
		playerModel.findById(id)
		.then( (data) => {
			res.json(data);
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 303, '/');
	}	
});

router.post('/addplayer', jwt.verfiyAPI, function(req, res, next) {
	if( req.login ) {
		//let n = validator.isAscii(req.body.name);
		//if( n ) {
		//	n = validator.trim(req.body.name);
		//}
 		let n = escape( req.body.name );
 		let f = escape( req.body.fname );
 		let l = escape( req.body.lname );		 
		let e = escape( req.body.email );
		let b = escape( req.body.bdate );
		let p = escape( req.body.pwd );
		let pl = new entities.dbPlayer(null, n, f, l, e, 0, b, p);

		//let pl = new entities.dbPlayer(null, req.body.name, req.body.email, 0, req.body.bdate, req.body.pwd);
		playerModel.addPlayer( pl )
		.then( (data) => {
            res.json( {status: 'added'} );
            //return;
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		//res.redirect( 307, '/');
	}
});

router.post('/updateplayer', jwt.verfiyAPI, function(req, res, next) {
	if( req.login ) {				
		let pl = new entities.dbPlayer(req.body.docid, req.body.name, req.body.fname, req.body.lname, req.body.email, 100, req.body.bdate);
		playerModel.updatePlayer(pl)
		.then( (data) => {
            res.json( { status: 'updated'} );
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 307, '/');
	}		
});

router.post('/deleteplayerbyid', jwt.verfiyAPI, cors(process.env.CORS), function(req, res, next) {
	if( req.login ) {				
		let id = escape( req.body.docid );
		playerModel.deletePlayer( id )
		.then( (data) => {
            res.json( {status: 'deleted'} );
            //res.writeHead(301, { Location: 'https://localhost:8080/plyr/playerlist'});
            //res.end()
            //res.redirect( 303, '/plyr/playerlist');
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 303, '/');
	}	
});


// *** Users ***
//--------------
router.get('/users', jwt.verfiyAPI, (req, res, next) => {
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
		res.redirect( 303, '/');
	}		
});

router.post('/getuserbyid', jwt.verfiyAPI, (req, res, next) => {
	if( req.login ) {	
		let id = req.body.docid;
		userModel.findById(id)
		.then( (data) => {
			res.json(data);
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 303, '/');
	}
});

router.post('/adduser', jwt.verfiyAPI, function(req, res ) {
	if( req.login ) {
		let usr = new entities.dbUser( null, req.body.uname, req.body.email, req.body.comment, req.body.bdate, req.body.psw );
		let rslt = userService.createuser( usr );
		if( rslt == true ) {
            res.json( {status: 'added'} );
		} else {
			res.json( {status: 'error'} );
		}
	} else {
		res.redirect( 307, '/');
	}	
});

router.post('/updateuser', jwt.verfiyAPI, async function(req, res ) {
	if( req.login ) {
		let usr = new entities.dbUser(req.body.docid, req.body.uname, req.body.email, req.body.comment, req.body.bdate);
		let rslt = await userModel.updateUser(usr);
        if( rslt.result.ok == 1 ) {
            res.json( {status: 'updated'} )
        }
	} else {
		res.redirect( 307, '/');
	}
});

router.post('/deleteuserbyid', jwt.verfiyAPI, function(req, res, next) {
	if( req.login ) {
		let id = req.body.docid;
		userModel.deleteById(id)
		.then( (data) => {
            res.json( {status: 'deleted'} )
			//res.redirect( 307, '/users/userlist');
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {

	}
});


// ** Questions


module.exports = router;