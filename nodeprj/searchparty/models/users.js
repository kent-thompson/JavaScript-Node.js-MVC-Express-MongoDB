const dbs = require('../../cmn/dbs');
// DEPRECATED moved to cmn = delete
module.exports = {
    getUsers: function() {
        var p = new Promise( function(resolve, reject) {
            const db = dbs.getDB();
            db.collection('users').find( {} ).toArray()
            .then( (docs) => {
                //console.log( docs );
                resolve( docs );
            })
            .catch( (err) => { 
                reject( err );
                //if( err ) { throw err; }
            });            
        });
        return p;
    }

};//module