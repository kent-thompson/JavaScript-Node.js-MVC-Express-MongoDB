const userService = require('../service/userService.js');
var express = require('express');
var router = express.Router();
const qa = require('../../cmn/models/QA.js');

router.get('/etl', function(req, res, next) {
	//let b = req.body;
	qa.getImportedQA()
	.then( (data) => {
		processQA( data );
		res.send(data)
	})
	.catch( (err) => { 
		res.send( err );
	});
});

function processQA( data ) {
	//console.log('length:'+ data.length);
	data.forEach(function(item, index) {
		//console.log(index + ':' + item);
		var question = item.Question;
		var submission = item.SubmittedBy;
		var correctNdx;

		var qarray = [];
		qarray[0] = item.Correct;
		qarray[1] = item.IncorrectA;
		qarray[2] = item.IncorrectB;
		qarray[3] = item.IncorrectC;

		var randArray = [];
		randArray[0] = 0;
		randArray[1] = 1;
		randArray[2] = 2;
		randArray[3] = 3;
		shuffleArray(randArray);

		var finalOrder = [];
		randArray.forEach(function(item, index) {
			if( item == 0 ) {
				correctNdx = index;	// answer in DB
			}
			finalOrder[0] = qarray[randArray[0]];
			finalOrder[1] = qarray[randArray[1]];
			finalOrder[2] = qarray[randArray[2]];
			finalOrder[3] = qarray[randArray[3]];
		})

		var dbquestion = {
			question: question,
			submitter: submission,
			answer: correctNdx,
			ans: finalOrder
		}
		//console.log(dbquestion);
		qa.insertQuestion( dbquestion );
	});
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm. */
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

module.exports = router;