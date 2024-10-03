module.exports = {
	dbQA:
		class db_qa {
		constructor(id, question, submitter, answer, ans) {	
			this._id = id,
			this.question = question,
			this.submitter = submitter,
			this.answer = answer,	// index number
			this.ans = ans
		}
	},

	dbUser: 
		class db_user {
		constructor(id, name, email, comment, bdate, pwd) {
			this._id = id;
			this.name = name;
			this.email = email;
			this.comment = comment;
			this.bdate = bdate;
			this.pwd = pwd;
		}
	},

	dbPlayer:
		class db_player {
		constructor(id, name, fname, lname, email, hscore, bdate, pwd) {	
			this._id = id,
			this.uname = name,
			this.fname = fname,
			this.lname = lname,
			this.email = email,			
			this.bdate = bdate,
			this.hscore = hscore,	// high score			
			this.pwd = pwd
		}
	},

	dbGames:
		class db_games {
		constructor(id, player_id, wins, losses, begindate, enddate) {	
			this._id = id,
			this.player_id = player_id,
			this.wins = wins,
			this.losses = losses,
			this.begindate = begindate,			
			this.enddate = enddate
		}
	},	
};