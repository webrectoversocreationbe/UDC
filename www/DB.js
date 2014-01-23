var madb;
var syncURL="http://192.168.0.248/UDC/ajaxSync.php";
var tableUserOk=false;
var tableSynchroOk=false;
var tableModeleOk=false;
var tableCoefOk=false;
var tableCuirModOk=false;
var tableLiasCuirOk=false;
var tableLiasColoOk=false;
var tableOptiOk=false;
var tableEleModOk=false;
var tableElementOk=false;
var tablePrixOk=false;
var tableCommandeOk=false;
var tableDetCdeOk=false;
var bDoLogin=false;
/* 
	INIT GENERAL
*/
function InitDB(callback) {
	log('Initialisation base de données');
	if (debug==true) {
		$('#Init').removeClass('current');
		$('#Main').addClass('current');
		return false
	}
	$('.loader').toggle();
	madb=window.openDatabase("syncdb", "1.0", "SyncDB", 20000000);
	dbsync.initialize(function(){
	 dbu.initialize(function(){
	  dbmod.initialize(function(){
	   dbmodcoef.initialize(function(){
	    dbcuirmod.initialize(function(){
		 dbliascuir.initialize(function(){
		  dbliascolo.initialize(function(){
		   dbopti.initialize(function(){
			dbelemod.initialize(function(){
			 dbelement.initialize(function(){
			  dbprix.initialize(function(){
			   dbcommande.initialize(function(){
			    dbdetcde.initialize(function(){
					if (tableUserOk==true && tableSynchroOk==true && tableModeleOk==true && tableCoefOk==true && tableCuirModOk==true && tableLiasCuirOk==true 
						 && tableLiasColoOk==true && tableOptiOk==true && tableEleModOk==true && tableElementOk==true && tablePrixOk==true && tableCommandeOk==true && tableDetCdeOk==true
						) {bDoLogin=true;}
					if (bDoLogin==true) {
						$('#Init').removeClass('current');
//						$('#Connexion').addClass('current');
						$('#Main').addClass('current');
					}
					$('.loader').toggle();
					callback();
				});	});	});	});	});	});	}); });	}); }); });	});
	});
}
function SynchroAll() {
	if (bConnected==false) {
		alert('Impossible de synchroniser sans connexion WiFi');
	} else {
		log('Synchronisation');
		$('.loader').toggle();
		dbu.synchro(function() {
		 dbmod.synchro(function(){
		  dbmodcoef.synchro(function(){
		   dbcuirmod.synchro(function(){
		    dbliascuir.synchro(function(){
			 dbliascolo.synchro(function(){
			  dbopti.synchro(function(){
			   dbelemod.synchro(function(){
				dbelement.synchro(function(){
				 dbprix.synchro(function(){
						$('.loader').toggle();
						alert('Synchro terminée');
				 }); }); }); }); }); }); }); }); });
		});
	}
}
/*
	SQL DEBUG
*/
function ExecSQL() {
	var sql=$('#sqlReq').val();
	$('#sqlResult').html('');
	var uneReq=new Requete();
	uneReq.exec(sql, function() {
		var ret='<h2>Résultat</h2><p>'+uneReq.Nb+' enregistrements</p>';
		dump(uneReq.Resu,'sqlResult');
		$('#sqlResult').prepend(ret);
	});
}
/*
	TABLE SYNCHRO
*/
window.dbsync = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
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
            url: syncURL,
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
						var sql = "INSERT INTO Synchro (Genre,DateS,Nb) VALUES (?, ?, ?)";
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
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
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
            url: syncURL,
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
						var sql = "INSERT INTO Users (Num, bAdmin, User, Psw, Version) VALUES (?, ?, ?, ?, ?)";
						var e;
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.Num, e.bAdmin, e.Nom, e.Psw, e.Version];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				log('La table User à été synchronisée');
				self.Etat=true;
				self.syncOK=true;
				tableUserOk=true;
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function(){
			callback();
		});
	},
	login: function() {
		var U=$('#User').val();
		var Psw=$('#Psw').val();
		log('Login '+U+' : '+Psw);
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT User,bAdmin,Version as UserVersion FROM Users WHERE User='"+U+"' AND Psw='"+Psw+"'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							User=results.rows.item(0).User;
							bAdmin=results.rows.item(0).bAdmin;
							UserVersion=results.rows.item(0).UserVersion;
							log('Login ok - '+User+' Admin '+bAdmin+' Version '+UserVersion);
							$('.lienconsulthist').css('display',UserVersion==2?'block':'none');
							$('.uniquementadmin').css('display',bAdmin==1?'block':'none');
							$('#Connexion').removeClass('current');
							$('#Main').addClass('current');
                        } else {
                            log('Utilisateur ou mot de passe inconnu');
							alert('Utilisateur ou mot de passe inconnu');
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
				"FOUR VARCHAR(3))";
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
            url: syncURL,
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
						var sql = "INSERT INTO Mods (MODNR,MOUC,MOCOEF,MODELAI,FOUR) VALUES (?, ?, ?, ?, ?)";
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
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function() {
			callback();
		});
	},
	rechmod: function() {
		var rech=$('#trfRech').val();
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT * FROM Mods WHERE MODNR like '%"+rech+"%' or MOUC like '%"+rech+"%'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length > 0) {
							var ret='';
							for (var i = 0; i < results.rows.length; i++) {
								ret=ret+'<p>'+results.rows.item(i).MODNR+' - '+results.rows.item(i).MOUC.replace("''","'")+'</p>';
	                        }
							$('#trfResult').html(ret);
                        }
                    });
            }
        )
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL mod '+tx.message);
    }
};
/*
	TABLE MODCOEF
*/
window.dbmodcoef = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='ModCoef'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table Coef existe');
							tableCoefOk=true;
			                callback();
                        } else {
                            log('La table Coef n\'existe pas');
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
				"CREATE TABLE IF NOT EXISTS ModCoef (" +
				"MODNR VARCHAR(6) PRIMARY KEY, " +
				"MOCOEF2 REAL)";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Coef à été créé');
				tableCoefOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de coefficients créée<br/>');
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
            url: syncURL,
	        crossDomain: true,
			async: false,
			type: "POST",
            data: {Genre: 'COEF'},
            success:function (data) {
				madb.transaction(
					function(tx) {
						var sql = "delete from ModCoef";
						tx.executeSql(sql);
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				madb.transaction(
					function(tx) {
						var l = data.length;
						var sql = "INSERT INTO ModCoef (MODNR,MOCOEF2) VALUES (?, ?)";
						var e;
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.MODNR, e.MOCOEF2];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				self.Etat=true;
				self.syncOK=true;
				tableCoefOk=true;
				log('La table Coef à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
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
	TABLE CUIRMOD
*/
window.dbcuirmod = {
	Etat: false, bDoSynchro: false,	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
             tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='CuirMod'", this.txErrorHandler, function(tx, results) {
				if (results.rows.length == 1) {
					self.Etat=true;	log('La table CuirMod existe');	tableCuirModOk=true;
					callback();
				} else {
					log('La table CuirMod n\'existe pas'); self.createTable(callback);
				}
             });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS CuirMod (" +
				"MODNR VARCHAR(6), " +
				"CUIRNR VARCHAR(4), " +
				"CUCAT VARCHAR(2))";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table CuirMod à été créé');
				tableCuirModOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de Cuir créée<br/>');
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
            url: syncURL, crossDomain: true, async: false, type: "POST", data: {Genre: 'CUIRMOD'},
            success:function (data) {
				madb.transaction(function(tx) {var sql = "delete from CuirMod";	tx.executeSql(sql);},self.txErrorHandler,function(tx) {});
				madb.transaction(
					function(tx) {
						var l = data.length; var e;
						var sql = "INSERT INTO CuirMod (MODNR,CUIRNR,CUCAT) VALUES (?, ?, ?)";
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.MODNR, e.CUIRNR, e.CUCAT];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {}
				);
				self.Etat=true;	self.syncOK=true;
				tableCuirModOk=true;
				log('La table CuirMod à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function() {
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL CuirMod '+tx.message);
    }
};
/*
	TABLE LIASCUIR
*/
window.dbliascuir = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='LiasCuir'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table LiasCuir existe');
							tableLiasCuirOk=true;
			                callback();
                        } else {
                            log('La table LiasCuir n\'existe pas');
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
				"CREATE TABLE IF NOT EXISTS LiasCuir (" +
				"FOURN VARCHAR(3), " +
				"CUIRNR VARCHAR(4), " +
				"CUIRUC VARCHAR(30))"
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table LiasCuir à été créé');
				tableLiasCuirOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de description cuir créée<br/>');
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
            url: syncURL, crossDomain: true, async: false, type: "POST", data: {Genre: 'LIASCUIR'},
            success:function (data) {
				madb.transaction(function(tx) {var sql = "delete from LiasCuir";	tx.executeSql(sql);}, self.txErrorHandler, function(tx) {});
				madb.transaction(
					function(tx) {
						var l = data.length; var e;
						var sql = "INSERT INTO LiasCuir (FOURN,CUIRNR,CUIRUC) VALUES (?, ?, ?)";
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.FOURN, e.CUIRNR, e.CUIRUC];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler, function(tx) {}
				);
				self.Etat=true; self.syncOK=true;
				tableLiasCuirOk=true;
				log('La table LiasCuir à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
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
	TABLE LIASCOLO
*/
window.dbliascolo = {
	Etat: false, bDoSynchro: false,	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
             tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='LiasColo'", this.txErrorHandler, function(tx, results) {
				if (results.rows.length == 1) {
					self.Etat=true;	log('La table LiasColo existe');	tableLiasColoOk=true;
					callback();
				} else {
					log('La table LiasColo n\'existe pas'); self.createTable(callback);
				}
             });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS LiasColo (" +
				"FOURN VARCHAR(3), " +
				"CUIRNR VARCHAR(6), " +
				"COLORNR VARCHAR(4), " +
				"COLOUC VARCHAR(30))";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table LiasColo à été créé');
				tableLiasColoOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de Couleurs créée<br/>');
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
            url: syncURL, crossDomain: true, async: false, type: "POST", data: {Genre: 'LIASCOLO'},
            success:function (data) {
				madb.transaction(function(tx) {var sql = "delete from LiasColo"; tx.executeSql(sql);},self.txErrorHandler,function(tx) {});
				madb.transaction(
					function(tx) {
						var l = data.length; var e;
						var sql = "INSERT INTO LiasColo (FOURN,CUIRNR,COLORNR,COLOUC) VALUES (?, ?, ?, ?)";
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.FOURN, e.CUIRNR, e.COLORNR, e.COLOUC];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {}
				);
				self.Etat=true;	self.syncOK=true;
				tableLiasColoOk=true;
				log('La table LiasColo à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function() {
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL LiasColo '+tx.message);
    }
};
/*
	TABLE OPTI
*/
window.dbopti = {
	Etat: false, bDoSynchro: false,	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
             tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Opti'", this.txErrorHandler, function(tx, results) {
				if (results.rows.length == 1) {
					self.Etat=true;	log('La table Opti existe');	tableOptiOk=true;
					callback();
				} else {
					log('La table Opti n\'existe pas'); self.createTable(callback);
				}
             });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS Opti (" +
				"Num INTEGER PRIMARY KEY, " +
				"MODNR VARCHAR(6), " +
				"FOUR VARCHAR(3), " +
				"OPCODE VARCHAR(3), " +
				"OPFR VARCHAR(30)) ";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Opti à été créé');
				tableOptiOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table options de modèles créée<br/>');
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
            url: syncURL, crossDomain: true, async: false, type: "POST", data: {Genre: 'OPTI'},
            success:function (data) {
				madb.transaction(function(tx) {var sql = "delete from Opti"; tx.executeSql(sql);},self.txErrorHandler,function(tx) {});
				madb.transaction(
					function(tx) {
						var l = data.length; var e;
						var sql = "INSERT INTO Opti (Num,MODNR,FOUR,OPCODE,OPFR) VALUES (?, ?, ?, ?, ?)";
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.Num, e.MODNR, e.FOUR, e.OPCODE, e.OPFR];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {}
				);
				self.Etat=true;	self.syncOK=true;
				tableOptiOk=true;
				log('La table Opti à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function() {
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL Opti '+tx.message);
    }
};
/*
	TABLE ELEMOD
*/
window.dbelemod = {
	Etat: false, bDoSynchro: false,	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
             tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='EleMod'", this.txErrorHandler, function(tx, results) {
				if (results.rows.length == 1) {
					self.Etat=true;	log('La table EleMod existe');	tableEleModOk=true;
					callback();
				} else {
					log('La table EleMod n\'existe pas'); self.createTable(callback);
				}
             });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS EleMod (" +
				"MODNR VARCHAR(6), " +
				"ELCODE VARCHAR(7))";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table EleMod à été créé');
				tableEleModOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table éléments de modèles créée<br/>');
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
            url: syncURL, crossDomain: true, async: false, type: "POST", data: {Genre: 'ELEMOD'},
            success:function (data) {
				madb.transaction(function(tx) {var sql = "delete from EleMod"; tx.executeSql(sql);},self.txErrorHandler,function(tx) {});
				madb.transaction(
					function(tx) {
						var l = data.length; var e;
						var sql = "INSERT INTO EleMod (MODNR,ELCODE) VALUES (?, ?)";
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.MODNR, e.ELCODE];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {}
				);
				self.Etat=true;	self.syncOK=true;
				tableEleModOk=true;
				log('La table EleMod à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function() {
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL EleMod '+tx.message);
    }
};
/*
	TABLE ELEMENT
*/
window.dbelement = {
	Etat: false, bDoSynchro: false,	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
             tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Element'", this.txErrorHandler, function(tx, results) {
				if (results.rows.length == 1) {
					self.Etat=true;	log('La table Element existe');	tableElementOk=true;
					callback();
				} else {
					log('La table Element n\'existe pas'); self.createTable(callback);
				}
             });
            }
        )
    },
    createTable: function(callback) {
        var self = this;
        madb.transaction(function(tx) {
				var sql = 
				"CREATE TABLE IF NOT EXISTS Element (" +
				"ELCODE VARCHAR(7), " +
				"ELFR VARCHAR(40))";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Element à été créé');
				tableElementOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de description d\'élément créée<br/>');
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
            url: syncURL, crossDomain: true, async: false, type: "POST", data: {Genre: 'ELEMENT'},
            success:function (data) {
				madb.transaction(function(tx) {var sql = "delete from Element"; tx.executeSql(sql);},self.txErrorHandler,function(tx) {});
				madb.transaction(
					function(tx) {
						var l = data.length; var e;
						var sql = "INSERT INTO Element (ELCODE,ELFR) VALUES (?, ?)";
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.ELCODE, e.ELFR];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {}
				);
				self.Etat=true;	self.syncOK=true;
				tableElementOk=true;
				log('La table Element à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function() {
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL Element '+tx.message);
    }
};
/*
	TABLE PRIX
*/
window.dbprix = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Prix'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table Prix existe');
							tablePrixOk=true;
			                callback();
                        } else {
                            log('La table Prix n\'existe pas');
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
				"CREATE TABLE IF NOT EXISTS Prix (" +
				"Num INTEGER PRIMARY KEY AUTOINCREMENT, " +
				"MODNR VARCHAR(6), " +
				"PXCATEG VARCHAR(2), " +
				"PXELEM varchar(7), " +
				"PRIX REAL, " +
				"PXDATE VARCHAR(10))";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Prix à été créé');
				tablePrixOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table des prix créée<br/>');
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
            url: syncURL,
	        crossDomain: true,
			async: false,
			type: "POST",
            data: {Genre: 'PRIX'},
            success:function (data) {
				madb.transaction(
					function(tx) {
						var sql = "delete from Prix";
						tx.executeSql(sql);
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				madb.transaction(
					function(tx) {
						var l = data.length;
						var sql = "INSERT INTO Prix (Num, MODNR, PXCATEG, PXELEM, PRIX, PXDATE) VALUES (?, ?, ?, ?, ?, ?)";
						var e;
						for (var i = 0; i < l; i++) {
							e = data[i];
							var params = [e.Num, e.MODNR, e.PXCATEG, e.PXELEM, e.PRIX, e.PXDATE];
							tx.executeSql(sql, params);
						}
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				log('La table Prix à été synchronisée');
				self.Etat=true;
				self.syncOK=true;
				tablePrixOk=true;
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
                alert('Erreur durant la synchronisation');
            }
        }).done(function(){
			callback();
		});
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL Prix '+tx.message);
    }
};
/*
	TABLE COMMANDES
*/
window.dbcommande = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    initialize: function(callback) {
		log('init cde');
        var self = this;
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='Commande'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table Commande existe');
							tableCommandeOk=true;
			                callback();
                        } else {
                            log('La table Commande n\'existe pas');
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
				"CREATE TABLE IF NOT EXISTS Commande (" +
				"Ref VARCHAR(8) PRIMARY KEY, " +
				"Vendeur VARCHAR(50)," +
				"Societe VARCHAR(50)," +
				"NumTva VARCHAR(20)," +
				"RemVen VARCHAR(150)," +
				"Civil0 VARCHAR(5)," +
				"Responsable VARCHAR(50)," +
				"Civil1 VARCHAR(5)," +
				"Prenom1 VARCHAR(100)," +
				"Nom1 VARCHAR(100)," +
				"Civil2 VARCHAR(5)," +
				"Prenom2 VARCHAR(100)," +
				"Nom2 VARCHAR(100)," +
				"Adresse VARCHAR(150)," +
				"CP VARCHAR(20)," +
				"Ville VARCHAR(150)," +
				"Tel1 VARCHAR(20)," +
				"Tel2 VARCHAR(20)," +
				"Gsm1 VARCHAR(20)," +
				"Gsm2 VARCHAR(20)," +
				"Email VARCHAR(150)," +
				"Remarque VARCHAR(250)," +
				"Fractionner INTEGER," +
				"NbFraction INTEGER," +
				"FactEnsSiege INTEGER," +
				"TotalTarif REAL," +
				"PrixVente REAL," +
				"Remise REAL," +
				"Reprise REAL," +
				"Frais REAL," +
				"GenreFrais VARCHAR(50)," +
				"TotalNet REAL," +
				"Financement INTEGER," +
				"MontantFin REAL," +
				"Exoneration INTEGER," +
				"TotalTVAC REAL," +
				"Acompte REAL," +
				"AcompteCarte REAL," +
				"AcompteEspece REAL," +
				"AcompteCheque REAL," +
				"AcompteAutre REAL," +
				"SoldeAcompte REAL," +
				"DateA VARCHAR(15)," +
				"Signature1 VARCHAR(515)," +
				"Signature2 VARCHAR(515)" +
				")";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Commande à été créé');
				tableCommandeOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de Commandes créée<br/>');
			if (bConnected==false) {
				$('#InitResult').append('Il faut synchroniser avec le serveur<br/>Vous n\'êtes pas connecté<br/><a onclick="Init()" class="rouge">Réessayer</a>');
			}
		}
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL Sync '+tx.message);
    }
};
/*
	TABLE DETAIL CDE
*/
window.dbdetcde = {
	Etat: false,
	bDoSynchro: false,
	syncOK: false,
    initialize: function(callback) {
        var self = this;
        madb.transaction(
            function(tx) {
                tx.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='DetCde'", this.txErrorHandler,
                    function(tx, results) {
                        if (results.rows.length == 1) {
							self.Etat=true;
                            log('La table Détail de commande existe');
							tableDetCdeOk=true;
			                callback();
                        } else {
                            log('La table Détail de commande n\'existe pas');
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
				"CREATE TABLE IF NOT EXISTS DetCde (" +
				"Num INTEGER PRIMARY KEY, " +
				"Ref VARCHAR(8), " +
				"MODNR VARCHAR(6)," +
				"MODUC VARCHAR(50)," +
				"CUIRNR VARCHAR(8)," +
				"CUIRUC VARCHAR(50)," +
				"COULNR VARCHAR(5)," +
				"COLOUC VARCHAR(50)," +
				"OPCODE VARCHAR(8)," +
				"OPFR VARCHAR(50)," +
				"CROQUIS VARCHAR(500)," +
				"Delai INTEGER," +
				"GenreDelai VARCHAR(10)" +
				")";
                tx.executeSql(sql);
            },
            this.txErrorHandler,
            function() {
                log('La table Détail de commande à été créé');
				tableDetCdeOk=true;
				self.initOk(callback);
            }
        );
    },
	initOk: function(callback) {
        var self = this;
		if (self.Etat==false) {
			$('#InitResult').append('Table de Detail de commande créée<br/>');
			if (bConnected==false) {
				$('#InitResult').append('Il faut synchroniser avec le serveur<br/>Vous n\'êtes pas connecté<br/><a onclick="Init()" class="rouge">Réessayer</a>');
			}
		}
	},
    txErrorHandler: function(tx) {
        alert(tx.message);
		log('Erreur SQL Sync '+tx.message);
    }
};
/*
	SQL
*/
var Requete = function() {
	this.Nb=0;
	this.Resu=[];
}
Requete.prototype = {
	exec: function(sql,callback) {
		var bOk=false; var self=this;
		madb.transaction(
			function(tx) {
				tx.executeSql(sql,[], 
					function(tx, results) {
						self.Resu.push(results.rows);
						self.Nb=results.rows.length;
						if (results.rows.length > 0) {
							dump(results.rows.item(0),'log');
						}
					},
					function(tx) {log('Erreur '+tx.message);}
				);
			}, function(err) {
				log('Erreur '+err.code+' '+err.message);
			}, function() {
				callback();
			}
		);
	}
}