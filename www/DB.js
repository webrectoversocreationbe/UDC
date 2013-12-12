var tableUserOk=false;
var tableSynchroOk=false;
var bDoLogin=false;
/* 
	INIT GENERAL
*/
function Init() {
	log('Initialisation');
	dbsync.initialize(function() {
		dbu.initialize(function() {
			if (tableUserOk==true && tableSynchroOk==true) {bDoLogin=true;}
			if (bDoLogin==true) {
				$('#Init').removeClass('current');
				$('#Connexion').addClass('current');
				$('#User').focus();
			}
		});
	});
}
function SynchroAll() {
	if (bConnected==false) {
		alert('Impossible de synchroniser sans connexion WiFi');
	} else {
		dbu.synchro();
	}
}
/*
	TABLE SYNCHRO
*/
window.dbsync = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    syncURL: "http://192.168.0.248/UDC/ajaxSync.php",
    initialize: function(callback) {
        var self = this;
        db.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Synchro'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table Synchro existe');
							tableUserOk=true;
			                callback();
                        } else {
                            log('La table Synchro n\'existe pas');
                            self.createTable(callback);
                        }
                    });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        db.transaction(
            function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS Synchro (" +
				"Genre VARCHAR(50) PRIMARY KEY, " +
				"DateS VARCHAR(20), " +
				"Nb INTEGER)"
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Synchro à été créé');
				tableUserOk=true;
				self.initOk();
                callback();
            }
        );
    },
	initOk: function() {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de synchronisation créée<br/>');
			if (bConnected==false) {
				$('#InitResult').append('Il faut synchroniser avec le serveur<br/>Vous n\'êtes pas connecté<br/><a onclick="Init()" class="rouge">Réessayer</a>');
			} else {
				self.bDoSynchro=true;
			}
		}
		if (self.bDoSynchro==true) {self.synchro();}
	},
	synchro: function(callback) {
        var self = this;
        $.ajax({
			callback: callback,
            url: self.syncURL,
	        crossDomain: true,
			type: "POST",
            data: {Genre: 'SYNCHRO'},
            success:function (data) {
				db.transaction(
					function(tx) {
						var sql = "delete from Synchro";
						tx.executeSql(sql);
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				db.transaction(
					function(tx) {
						var l = data.length;
						var sql = "INSERT OR REPLACE INTO Synchro (Genre,DateS,Nb) VALUES (?, ?, ?)";
						var e;
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.Genre, e.DateS, e.Nb];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {
						callback();
					}
				);
				log('La table Synchro à été synchronisée');
				self.Etat=true;
				self.syncOK=true;
				tableUserOk=true;
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
/*
	TABLE USERS
*/
window.dbu = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    syncURL: "http://192.168.0.248/UDC/ajaxSync.php",
    initialize: function(callback) {
        var self = this;
        db.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Users'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table User existe');
							tableUserOk=true;
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
        db.transaction(
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
				tableUserOk=true;
				self.initOk();
                callback();
            }
        );
    },
	initOk: function() {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table d\'identification créée<br/>');
			if (bConnected==false) {
				$('#InitResult').append('Il faut synchroniser avec le serveur<br/>Vous n\'êtes pas connecté<br/><a onclick="Init()" class="rouge">Réessayer</a>');
			} else {
				self.bDoSynchro=true;
			}
		}
		if (self.bDoSynchro==true) {self.synchro();}
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
				db.transaction(
					function(tx) {
						var sql = "delete from Users";
						tx.executeSql(sql);
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				db.transaction(
					function(tx) {
						var l = data.length;
						var sql = "INSERT OR REPLACE INTO Users (Num, bAdmin, User, Psw, Version) VALUES (?, ?, ?, ?, ?)";
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
				tableUserOk=true;
				callback();
            },
            error: function(request, model, response) {
				log('Erreur durant la synchronisation');
                alert(request.responseText + " " +model + " " + response);
            }
        });
	},
	login: function() {
		var User=$('#User').val();
		var Psw=$('#Psw').val();
		log('Login '+User+' : '+Psw);
        db.transaction(
            function(tx) {
                tx.executeSql("SELECT User,bAdmin,Version FROM Users WHERE User='"+User+"' AND Psw='"+Psw+"'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							User=results.rows.item(0).User;
							bAdmin=results.rows.item(0).bAdmin;
							Version=results.rows.item(0).Version;
							log('Login ok');
							$('#lienconsulthist').css('display',Version==1?'none':'block');
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
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL '+tx.message);
    }
};
