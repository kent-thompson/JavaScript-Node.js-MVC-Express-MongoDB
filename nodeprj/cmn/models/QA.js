const dbs = require('../../cmn/dbs');

module.exports = {
    getFirstQ: function() {
        let p = new Promise( function(resolve, reject) {
			const db = dbs.getDB();
            db.collection('QA').findOne({}, function(err, doc) {
                if (err) {
                    reject( err );
                } else {    
                    resolve( doc );
                }
            });
        });
        return p;
    },
    findById: function( did ) {
        let p = new Promise( function(resolve, reject) {
            var db = dbs.getDB();
            var objectId = dbs.getObjectId();
            db.collection('QA').findOne( {_id: new objectId( did )}, function(err, doc) {
                if (err) {
                    reject( err );
                } else {    
                    resolve( doc );
                }
            });
        });
        return p;
    },
    getNextQuestion: function( did ) {        
        let p = new Promise( function(resolve, reject) {
            let db = dbs.getDB();
            let objectId = dbs.getObjectId();
            var cur = db.collection('QA').find({_id: {$gt: new objectId( did ) }}).limit(1);
            cur.next()
            .then( (rec) => {
                resolve( rec );
            }) 
            .catch( (err) => { 
                reject( err );
            });
        });
        return p;
	},
	insertQuestion: function( doc ) {        // TODO: check for sql injection
        let p = new Promise( function(resolve, reject) {
           	const db = dbs.getDB();
           	db.collection('QA').insertOne( doc )
            .then( (rec) => {
                resolve( rec );
            }) 
            .catch( (err) => { 
                reject( err );
            });
        });
        return p;
	},
	updateQuestion: function( doc ) {      
        let p = new Promise( function(resolve, reject) {
			const db = dbs.getDB();
			let objectId = dbs.getObjectId();
			db.collection('QA').updateOne( {_id: objectId( doc._id ) },
				{ $set: {
					'question': doc.question,
					'answer': doc.answer,
					'ans':[ doc.ans[0], doc.ans[1], doc.ans[2], doc.ans[3] ]					   					   					   
					},
				}
			)
		})
		.then( (rslt) => {
			resolve( rslt );
		}) 
		.catch( (err) => { 
			reject( err );
		});
        return p;
	},
	deleteQuestion: function( id ) {
		const db = dbs.getDB();
		let objectId = dbs.getObjectId();
		try {
			db.collection('QA').deleteOne( {_id: objectId(id) } );
		} catch( e ) {
			console.log( 'DELETE ERROR:' + e )
		}	
		/* TODO
        let p = new Promise( function(resolve, reject) {
			const db = dbs.getDB();
			let objectId = dbs.getObjectId();
			db.collection('QA').deleteOne( {_id: objectId(doc._id) } )
			.then( (rslt) => {
				resolve( rslt );
			}) 
			.catch( (err) => { 
				reject( err );
			});
			return p;
		})
		*/
	},
	pageQuestions: function( perPage, page ) {	// pagination
		let p = new Promise( function(resolve, reject) {
			const db = dbs.getDB();
			db.collection('QA').countDocuments()
			.then( (count) => {
 				if( page === -2 ) { 					// want last page
					page = Math.ceil(count / perPage)
				}
				let maxpage = Math.ceil(count / perPage)// current page overrun
				if( page > maxpage ) {
					page = maxpage;
				}
				db.collection('QA').find({})
				.skip( (perPage * page) - perPage )
				.limit( perPage )
				.toArray()
				.then( (qlist) => {
					resolve( [count, page, qlist] );
				}) 
			})
			.catch( (err) => { 
				reject( err );
				//res.send( err );
			})		
		});
		return p;
	},
	getImportedQA: function() {
        var p = new Promise( function(resolve, reject) {
            const db = dbs.getDB();
            db.collection('imported_qa').find( {} ).toArray()
            .then( (docs) => {
                resolve( docs );
            })
            .catch( (err) => { 
                reject( err );
            });            
        });
        return p;
	},
	getQATimers: function() {
        var p = new Promise( function(resolve, reject) {
            const db = dbs.getDB();
            db.collection('s_system').findOne({})
            .then( (docs) => {
                resolve( docs );
            })
            .catch( (err) => { 
                reject( err );
            });            
        });
        return p;
	},
	updateQATimers: function( doc ) {      
        let p = new Promise( function(resolve, reject) {
			const db = dbs.getDB();
			let objectId = dbs.getObjectId();
			db.collection('s_system').updateOne( {_id: objectId( doc.docid ) },
				{ $set: {
					'question_timer': doc.qtimer,
					'wait_timer': doc.wtimer,
					},
			})
		})
		.then( (rslt) => {
			resolve( rslt );
		}) 
		.catch( (err) => { 
			reject( err );
		});
        return p;
	},
};//module