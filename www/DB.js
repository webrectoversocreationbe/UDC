window.dbu = {
	Etat: false,
    syncURL: "http://www.devba.be/android/sync.php",
    initialize: function(callback) {
        var self = this;
        this.db = window.openDatabase("syncdb", "1.0", "SyncDB", 20000000);
        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table User existe');
                        } else {
                            log('La table User n\'existe pas');
                            self.createTable(callback);
                        }
                    });
            }
        )
    },
    createTable: function(callback) {
        this.db.transaction(
            function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS Users (" +
				"Num INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"User VARCHAR(50), " +
				"Psw varchar(50))"
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
				self.Etat=true;
                log('La table User à été créé');
                callback();
            }
        );
    },
	login: function() {
		var User=$('#User').val();
		var Psw=$('#Psw').val();
		log('login '+User+' : '+Psw);
		$('#Connexion').removeClass('current');
		$('#Main').addClass('current');
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
    }
};