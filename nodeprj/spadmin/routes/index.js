const express = require('express');
const router = express.Router();
const qa = require('../../cmn/models/QA.js');
const userService = require('../service/userService.js');
const jwt = require('../service/jwtmodule.js');

//const http = require('http');
//const request = require('request')
//const crypto = require('crypto');
//let rb = crypto.randomBytes(32).toString('hex');
//console.log(rb);

const LDIR = "res.redirect( 307, '/');"

// *** Login Routes / Controller ***
router.get('/', (req, res) => {					// get login page
	res.render( 'login' );
});
router.post('/', (req, res) => {				// post login page for REDIRECT
	res.render( 'login' );
});

router.get('/auth', (req, res, next ) => {		// NO token yet
	let u = req.body.uname;
	let p = req.body.psw;
	userService.authenticate(res, u, p, next);	// returns token AND result in service layer
});

router.post('/auth', (req, res, next ) => {		// NO token yet
	let u = req.body.uname;
	let p = req.body.psw;
	userService.authenticate(res, u, p, next);	// returns token AND result in service layer
});

router.post('/index', jwt.verfiyUI, (req, res, next) => {	// home page - Dashboard
	if( req.login ) {
		res.render( 'index', {page:'Dashboard Coming Soon', menuId:'admin'} );
	} else {
		res.redirect( 307, '/');
	}
});

// *** Questions ***

/* router.get('/question', function(req, res, next) {
	res.render( 'question', {page:'Admin', menuId:'admin', state:'add', id:'0'} );
}); */

router.post('/question', jwt.verfiyUI, (req, res, next) => {		// empty add from
	if( req.login ) {
		res.render( 'question', {page:'Admin', menuId:'admin', state:'add', docid: '0'} );
	} else {
		res.redirect( 307, '/');
	}
});

router.post('/insertQuestion', (req, res, next) => {
	let b = req.body;
	qa.insertQuestion( b );
	res.render( 'question', {page:'Admin', menuId:'admin', state:'add'} );
});

router.post('/updatequestion', jwt.verfiyUI, (req, res, next) => {
	if( req.login ) {
		let b = req.body;
		qa.updateQuestion( b );
		res.redirect( 307, '/listq' );
	} else {
		res.redirect( 307, '/');
	}
});

router.post('/deletequestion', jwt.verfiyUI, (req, res, next) => {
	if( req.login ) {
		let id = req.body.docid;
		qa.deleteQuestion( id )
		res.redirect( 307, '/listq' );
	} else {
		res.redirect( 307, '/');
	}	
});

router.post('/getquestion', jwt.verfiyUI, (req, res, next) => {			// gets populated question
	if( req.login ) {
		let id = req.body.docid;
		qa.findById( id )
		.then( (data) => {
			let t = data._id.toString();
			res.render( 'question', {
				page:'Admin', menuId:'admin', state:'edit',
				docid:t, ques:data.question, answer:Number(data.answer) + 1,	// NOTE: adjusting answer for zero based
				ans0:data.ans[0], ans1:data.ans[1],
				ans2:data.ans[2], ans3:data.ans[3]
			});
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 307, '/');
	}	
});

// RENDERED SERVER SIDE
router.post('/listq', jwt.verfiyUI, (req, res, next) => {	// paginated list
	if( req.login ) {
		let perPage = Number(req.body.perPage) || 10;
		console.log(perPage);
		//let perPage = 15; // req.body.perPage;
		let page = Number(req.body.page) || 1;
		console.log(page);
		qa.pageQuestions( perPage, page )
		.then( (data) => {
			let count = data[0];
			let curpage = data[1];
			let qlist = data[2];
			res.render('queslist', {
				page:'QLIST',
				menuId:'admin',
				qlist: qlist,
				current: curpage,
				perpage: perPage,
				pages: Math.ceil(count / perPage)
			})
		})	
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 307, '/');
	}
});	

// QA TIMERS pages
router.post('/getQATimers', jwt.verfiyUI, (req, res, next) => {
	if( req.login ) {
		qa.getQATimers()
		.then( (data) => {
			res.render( 'systempage', {
				page:'Admin', menuId:'admin', state:'edit',
				docid: data._id, qtimer: data.question_timer, wtimer: data.wait_timer
			});
		})
		.catch( (err) => { 
			res.send( err );
		});
	} else {
		res.redirect( 307, '/');
	}
});

router.post('/updateQATimers', jwt.verfiyUI, (req, res, next) => {
	if( req.login ) {	
		let b = req.body;
		qa.updateQATimers( b );
		res.redirect( 307, '/index' );
	} else {
		res.redirect( 307, '/');
	}
});

module.exports = router;
