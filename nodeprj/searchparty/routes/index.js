var express = require('express');
//const dbs = require('../dbs');
const qa = require('../../cmn/models/QA.js');
const playerModel = require('../../cmn/models/players');
const entities = require('../../cmn/models/entities');
const jwt = require('../../cmn/service/jwtmodule.js');
var router = express.Router();

// *** Page Router ***

router.get('/', function(req, res, next) {
    loadIndex( res );
});

router.get('/index', function(req, res, next) {
    loadIndex( res );
});

router.post('/index', jwt.verfiyUI, function(req, res) {    // should only be used when redirected by server
    if( req.root ) {    // if player logged in
        let uname = req.username;
        let rname = res.username;
        let nname = req.body.uname;
        loadIndex( res, req.body.uname, req.body.htt, status_ = 1 );
    } else {
        res.redirect('/');
    }
});

// PLAYERS

router.get('/playerform', function(req, res, next) {
    res.render('playerform', {page:'Player Account', menuId:'playerform'});
});

router.get('/login', function(req, res, next) {
    res.render('../../cmn/cmnviews/login', {page:'Player Account', menuId:'login'});
});

router.get('/new-account', function(req, res, next) {
    res.render('../../cmn/cmnviews/new-account', {page:'Create New Player Account', menuId:'new-account'});
});

router.get('/contact', function(req, res, next) {
    res.render('contact', {page:'Contact Us', menuId:'contact', unametag:""});
});

// PLAYER - POSTS

router.post('/account', jwt.verfiyUI, function(req, res, next) {
    if( req.root ) {    // if player logged in
        let userId = req.user_id;
        let player = new entities.dbPlayer();

        playerModel.findById( userId )
        .then( (doc) => {
             res.render('../../cmn/cmnviews/account', {
                page:'Update Player Account', menuId:'account', htt: req.body.htt, username: doc.uname,
                fname: doc.fname, lname: doc.lname, email: doc.email, bdate: doc.bdate, pwd: ""
              });
        })
        .catch( (err) => {
            console.log( err );
            throw err;
        });    
    }
});

router.post('/auth', function(req, res, next) {
    let uname = req.body.uname;
    let pwd = req.body.pwd;

    playerModel.findByUsername( uname )
    .then( (doc) => {
        //console.log( 'Player Found in findByUsername' );
        let id = doc._id.toString();	// player id
        let hash = doc.pwd;
        return playerModel.authenticate( id, uname, pwd, hash );
    })    
    .then( (token) => {
        loadIndex( res, uname, token, true );
    })
    .catch( (err) => {
        throw 'Player Not Found';
    });
});

// /player/update
router.post('/player/update', jwt.verfiyUI, function(req, res, next) {
    if( req.root ) {    // if player logged in
        //let userId = req.user_id;
        //let player = new entities.dbPlayer( req.user_id, req.body.uname, req.body.fname, req.body.lname, req.body.email, req.body.bdate.toString() );

        let player = new entities.dbPlayer();
        player._id = req.user_id,
        player.uname = req.body.uname,
        player.fname = req.body.fname,
        player.lname = req.body.lname,
        player.email = req.body.email,			
        player.bdate = req.body.bdate.toString();
        //player.hscore = hscore,	// high score			
        //player.pwd = pwd

        playerModel.updatePlayer( player )
        .then( (rslt) => {
            //console.log( rslt );
            res.username = req.body.uname;
            req.username = req.body.uname;
            res.auth = true;
            res.redirect(307, '/index' );
        })
        .catch( (err) => {
            console.log( err );
        });
    }
});

module.exports = router;

function loadIndex( res, uname, token, status_ = 0 ) {
	let qtimer = null;
    let wtimer = null;
    let mstatus;

    if( status_ == 0) {
        mstatus = 'Play';
    } else {
        mstatus = 'Member Play';
    }

	qa.getQATimers().then( (doc) => {
		qtimer = doc.question_timer;
		wtimer = doc.wait_timer;
    });
    
    // TODO: what?
    qa.getFirstQ().then( (doc) => {
        res.render( 'index', {
            page:mstatus, menuId:'play', question_timer: qtimer, 
            wait_timer: wtimer, unametag: uname, token: token 
        } );
    });
}
