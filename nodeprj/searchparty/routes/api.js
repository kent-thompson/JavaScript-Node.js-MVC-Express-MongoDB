const express = require('express');
const router = express.Router();
const model = require('../../cmn/models/users');
const qa = require('../../cmn/models/QA');
const playerModel = require('../../cmn/models/players');
const entities = require('../../cmn/models/entities');
const jwt = require('../../cmn/service/jwtmodule.js');

var is = require( 'validator.js' ).Assert;
var validator = require( 'validator.js' ).validator();
const moment = require('moment');

// *** API Router ***

router.get('/users', function(req, res, next) {
    model.getUsers().then( (docs) => {
        res.send( docs );
    });
});

router.get('/topplayers', function(req, res, next) {
    playerModel.getPlayers().then( (docs) => {
        res.send( docs );
    });
});

router.post('/fquestion', function(req, res, next) {
    const a = Number( req.body.answer );
    let did = req.body.docid;

    if( did == null || did == undefined || did == "" ) {
        var q = qa.getFirstQ();
        q.then( (doc) => {
			let a = { "_id": doc._id, "question": doc.question };
			res.send( a );
            //res.send( doc );
        });
        return;
	}
});

router.post('/getanswers', function(req, res, next) {
    let did = req.body.docid;
    qa.findById( did ).then( (doc) => {
		res.send( doc.ans );
    });
});

router.post('/answer', jwt.verfiyUI, function(req, res, next) {
    const ansIndex = Number( req.body.answer );
    const did = req.body.docid; // answer ID
    let rslt;
            /* TODO still needed?
            if( did == null || did == undefined || did == "" ) {
                var q = qa.getFirstQ();
                q.then( (doc) => {
                    let a = { "_id": doc._id, "question": doc.question };
                    res.send( a );
                    //res.send( doc );
                });
                return;
            }
            */
    qa.findById( did ).then( (doc) => {
        // KDT: update a Current Game w/l stat. send that back to client and update localStorage. test for tampering
        // look into storing it in the webtoken as well
        if( doc.answer == ansIndex ) {
            rslt = 'W';
        } else {
            rslt = 'L';
        }
        if( req.root ) {    // if player logged in - record result
            let userId = req.user_id;
            // TODO
            // get player record and update win\loss
        }
        
        res.send( rslt );
    });

});

router.post('/nextquestion', function(req, res, next) {
    let did = req.body.docid;
    qa.getNextQuestion( did ).then( (doc) => {
		let a = { "_id": doc._id, "question": doc.question };
		res.send( a );
        //res.json( doc );        
    })
    .catch( (err) => { 
        let q = qa.getFirstQ();
        q.then( (doc) => {
			let a = { "_id": doc._id, "question": doc.question };
			res.send( a );
            //res.send( doc );
			console.log( 'DB Wrap Around' );
		});
    });
});
/* router.post('/nexta', function(req, res, next) {
    let did = req.body.docid;
    qa.getNextQuestion( did ).then( (doc) => {
        res.json( doc );        
    })
    .catch( (err) => { 
        console.log( err );
    });
});
 */
router.get('/gettimers', function(req, res, next) {
    qa.getQATimers().then( (docs) => {
        res.send( docs );
    });
});

/** PLAYERS */

// new player sign up
router.post('/player/create', function(req, res, next) {
    let constraint = {
        uname:[ is.notBlank(), is.ofLength( { min: 3, max: 26 } ) ],
        fname: [ is.notBlank(), is.ofLength( { min: 3, max: 26 } ) ],
        lname: [ is.notBlank(), is.ofLength( { min: 3, max: 26 } ) ],
        email: is.email(),
        pwd: [ is.notBlank(), is.ofLength( { min: 8, max: 26 } ) ]
    }

    var ddate = moment( req.body.bdate ).isValid();
    var result = validator.validate( req.body, constraint );
    let errstr = [];
    errstr.push( 'Field Name: Bad Value' );
    if( result != true || ddate != true ) {  // ERROR send back errors TODO: whne data is only error result is a bool :(
        if( ddate == false ) {
            result['bdate'] = ["Bad Date"];
        }
        for (const key of Object.keys(result)) {
            if( key == 'bdate') {
                console.log(key, result[key][0]);
            }
            console.log(key, result[key][0].value);
            errstr.push( key + ': ' + result[key][0].value );
        }
        errstr.push( 'Click BACK Button' );
        errstr.push( 'ERRORS: Use Site Page' );
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ errstr }));
        //errstr.join(""); make it a big string
        return;
    }

    let pl = new entities.dbPlayer(null, req.body.uname, req.body.fname, req.body.lname, req.body.email, 0, req.body.bdate, req.body.pwd);
    playerModel.createplayer( pl )
    .then( (data) => {
        res.redirect( '/' );
    })
    .catch( (err) => { 
        res.send( err );
    });
});

// player/update is in index.js


module.exports = router;

/*
var cid = '5bb7b50294e3ac05c7d63ae7'
qa.findById( cid ).then( (doc) => {
    res.send( doc );
})
.catch( (err) => { 
    console.log( err );
});
*/

/*    var p = model.getUsers();
    p.then( function(docs) {
        console.log(docs);
        res.send( docs );
    });
*/    

// _id: "5bb7b50294e3ac05c7d63ae7"
//{projection: { info: true }}
/*
    db.collection('QA').findOne( {_id: new objectId( did )}, function(err, doc) {
        if( err ) { throw err; }
        var r;
       if( doc.answer == a ) {
           r = "{'answer':'Correct'}";

           // get next question
           var cur = db.collection('QA').find({_id: {$gt: new objectId( did ) }}).limit(1);
           cur.next()
           .then( (rec) => {
               console.log("document found:");
               console.log(rec);
               console.log( rec.question );
               //res.send( docs );
               //console.log( 'db success' );
           })    
           .catch( (err) => { 
               if( err ) { throw err; }
           });

       } else {
           r = "{'answer':'Wrong'}";
       }
       //var j = JSON.stringify( {"answer": doc.answer} );
       res.json( r );

    const db = dbs.getDB();
    db.collection('users').find( {} ).toArray()
    .then( (docs) => {
        res.send( docs );
    })    
    .catch( (err) => { 
        if( err ) { throw err; }
    });

db.products.find({_id: {$gt: ObjectId("4fdbaf608b446b0477000142") }}).limit(1)

var findDocuments = function(db, callback) {
    const collection = db.collection('users');
    collection.find( {} ).toArray( function( err, docs ) {
        // assert.equal(err, null);
        if( err ) { throw err; }
        console.log("documents found:");
        console.log(docs);
        callback(docs); // boom
    });
}

// GET api
router.get('/', function(req, res, next) {
    const db = dbs.getDB();
    findDocuments( db, function( json_docs ) {
        res.send( json_docs );
        console.log( 'db success' );
    });
});
*/