window.dbu = {
	Etat: false,
    syncURL: "192.168.0.248/UDC/sync.php",
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
			                callback();
                        } else {
                            log('La table User n\'existe pas');
                            self.createTable(callback);
                        }
                    });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        this.db.transaction(
            function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS Users (" +
				"Num INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"bAdmin INTEGER, " +
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
		log('Login '+User+' : '+Psw);
        this.db.transaction(
            function(tx) {
                tx.executeSql("SELECT User FROM Users WHERE User='"+User+"' AND Psw='"+Psw+"'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							log('Login ok');
							$('#Connexion').removeClass('current');
							$('#Main').addClass('current');
                        } else {
                            log('Utilisateur ou mot de passe inconnu');
							$('#Psw').val('');
							$('#User').val('');
							$('#User').focus();
                        }
                    });
            }
        )
	},
	synchro: function(callback) {
        var self = this;
        showAlert('Synchro avec le serveur','Synchronisation','OK');
	},
    txErrorHandler: function(tx) {
        showAlert(tx.message,'Erreur SQL','OK');
    }
};