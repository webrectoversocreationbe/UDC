var tableUserOk=false;
var tableSynchroOk=false;
var tableModeleOk=false;
var bDoLogin=false;
var madb;
/* 
	INIT GENERAL
*/
function Init() {
	log('Initialisation');
	madb=window.openDatabase("syncdb", "1.0", "SyncDB", 20000000);
	dbsync.initialize(function(){
		dbu.initialize(function(){
			dbmod.initialize(function(){
				if (tableUserOk==true && tableSynchroOk==true && tableModeleOk==true) {bDoLogin=true;}
				if (bDoLogin==true) {
					$('#Init').removeClass('current');
					$('#Connexion').addClass('current');
					$('#User').focus();
				}
			});
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
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Synchro'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table Synchro existe');
							tableSynchroOk=true;
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
        madb.transaction(
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
				tableSynchroOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de synchronisation créée<br/>');
			if (bConnected==false) {
				$('#InitResult').append('Il faut synchroniser avec le serveur<br/>Vous n\'êtes pas connecté<br/><a onclick="Init()" class="rouge">Réessayer</a>');
			} else {
				self.bDoSynchro=true;
			}
		}
		if (self.bDoSynchro==true) {self.synchro(callback);}
	},
	synchro: function(callback) {
        var self = this;
        $.ajax({
            url: self.syncURL,
	        crossDomain: true,
			async: false,
			type: "POST",
            data: {Genre: 'SYNCHRO'},
            success:function (data) {
				madb.transaction(
					function(tx) {
						var sql = "delete from Synchro";
						tx.executeSql(sql);
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				madb.transaction(
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
					}
				);
				self.Etat=true;
				self.syncOK=true;
				tableSynchroOk=true;
				log('La table Synchro à été synchronisée');
            },
            error: function(request, model, response) {
				log('Erreur durant la synchronisation');
                alert(request.responseText + " " +model + " " + response);
            }
        }).done(function() {
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL Sync '+tx.message);
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
        madb.transaction(
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
        madb.transaction(
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
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table d\'identification créée<br/>');
			if (bConnected==false) {
				$('#InitResult').append('Il faut synchroniser avec le serveur<br/>Vous n\'êtes pas connecté<br/><a onclick="Init()" class="rouge">Réessayer</a>');
			} else {
				self.bDoSynchro=true;
			}
		}
		if (self.bDoSynchro==true) {self.synchro(callback);}
	},
	synchro: function(callback) {
        var self = this;
        $.ajax({
			callback: callback,
            url: self.syncURL,
	        crossDomain: true,
			async: false,
			type: "POST",
            data: {Genre: 'USER'},
            success:function (data) {
				madb.transaction(
					function(tx) {
						var sql = "delete from Users";
						tx.executeSql(sql);
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				madb.transaction(
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
            },
            error: function(request, model, response) {
				log('Erreur durant la synchronisation');
                alert(request.responseText + " " +model + " " + response);
            }
        }).done(function(){
			callback();
		});
	},
	login: function() {
		var User=$('#User').val();
		var Psw=$('#Psw').val();
		log('Login '+User+' : '+Psw);
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT User,bAdmin,Version as UserVersion FROM Users WHERE User='"+User+"' AND Psw='"+Psw+"'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							User=results.rows.item(0).User;
							bAdmin=results.rows.item(0).bAdmin;
							UserVersion=results.rows.item(0).UserVersion;
							log('Login ok - '+User+' Admin '+bAdmin+' Version '+UserVersion);
							$('#lienconsulthist').css('display',UserVersion==2?'block':'none');
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
		log('Erreur SQL User '+tx.message);
    }
};
/*
	TABLE MODELES
*/
window.dbmod = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    syncURL: "http://192.168.0.248/UDC/ajaxSync.php",
    initialize: function(callback) {
        var self = this;
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Mods'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table Modèles existe');
							tableModeleOk=true;
			                callback();
                        } else {
                            log('La table Modèles n\'existe pas');
                            self.createTable(callback);
                        }
                    });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        madb.transaction(
            function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS Mods (" +
				"MODNR VARCHAR(6) PRIMARY KEY, " +
				"MOUC VARCHAR(100), " +
				"MOCOEF REAL, " +
				"MODELAI INTEGER, " +
				"FOUR VARCHAR(3), " +
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Modèles à été créé');
				tableModeleOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de modèles créée<br/>');
			if (bConnected==false) {
				$('#InitResult').append('Il faut synchroniser avec le serveur<br/>Vous n\'êtes pas connecté<br/><a onclick="Init()" class="rouge">Réessayer</a>');
			} else {
				self.bDoSynchro=true;
			}
		}
		if (self.bDoSynchro==true) {self.synchro(callback);}
	},
	synchro: function(callback) {
        var self = this;
        $.ajax({
            url: self.syncURL,
	        crossDomain: true,
			async: false,
			type: "POST",
            data: {Genre: 'MOD'},
            success:function (data) {
				madb.transaction(
					function(tx) {
						var sql = "delete from Mods";
						tx.executeSql(sql);
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				madb.transaction(
					function(tx) {
						var l = data.length;
						var sql = "INSERT OR REPLACE INTO Mods (MODNR,MOUC,MOCOEF,MODELAI,FOUR) VALUES (?, ?, ?, ?, ?)";
						var e;
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.MODNR, e.MOUC, e.MOCOEF, e.MODELAI, e.FOUR];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				self.Etat=true;
				self.syncOK=true;
				tableModeleOk=true;
				log('La table Modèles à été synchronisée');
            },
            error: function(request, model, response) {
				log('Erreur durant la synchronisation');
                alert(request.responseText + " " +model + " " + response);
            }
        }).done(function() {
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL Sync '+tx.message);
    }
};
