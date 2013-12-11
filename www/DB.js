window.dbu = {
	Etat: false,
	syncOK: false,
    syncURL: "http://192.168.0.248/UDC/ajaxSync.php",
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
				"Psw varchar(50), " +
				"Version INTEGER)"
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
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
                tx.executeSql("SELECT User,bAdmin,Version FROM Users WHERE User='"+User+"' AND Psw='"+Psw+"'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							User=results.rows.item(0).User;
							bAdmin=results.rows.item(0).bAdmin;
							Version=results.rows.item(0).Version;
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
	logout: function() {
		log('Logout');
		$('.Panneau').removeClass('current');
		$('#Connexion').addClass('current');
		$('#Psw').val('');
		$('#User').val('');
		$('#User').focus();
	},
	synchro: function(callback) {
        var self = this;
        $.ajax({
			callback: callback,
            url: self.syncURL,
	        crossDomain: true,
			type: "POST",
            data: {Genre: 'USER'},
            success:function (data) {
				self.db.transaction(
					function(tx) {
						var l = data.length;
						var sql =
							"INSERT OR REPLACE INTO Users (Num, bAdmin, User, Psw, Version) " +
							"VALUES (?, ?, ?, ?, ?)";
						var e;
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.Num, e.bAdmin, e.Nom, e.Psw, e.Version];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {
						callback();
					}
				);
				log('La table User à été synchronisée');
				self.Etat=true;
				self.syncOK=true;
				callback();
            },
            error: function(request, model, response) {
				log('Erreur durant la synchronisation');
                alert(request.responseText + " " +model + " " + response);
            }
        });
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL '+tx.message);
    }
};
function SynchroAll() {
	dbu.synchro();
}