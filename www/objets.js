/*
	LES OBJETS
*/
var Modele = function() {
	this.Existe=false;
	this.MODNR='';
	this.MOUC='';
	this.MOCOEF=0;
	this.MOCOEF2=0;
	this.MODELAI=0;
	this.FOUR='';
	this.CUIRNR='';
	this.CUIRUC='';
	this.COLORNR='';
	this.COLOUC='';
	this.OPCODE='';
	this.OPFR='';
	this.Elements=[];
	this.CatCuir=[];
	this.Couleurs=[];
	this.Opti=[];
};
Modele.prototype = {
	init: function(Id,callback) {
		var bOk=false; var self=this;
		log('init mod');
		// FICHE MODS
		madb.transaction(
			function(tx) {
				var sql = "SELECT * FROM Mods where MODNR='"+Id+"'";
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length == 1) {
							self.MODNR=results.rows.item(0).MODNR;
							self.MOUC=results.rows.item(0).MOUC;
							self.MOCOEF=results.rows.item(0).MOCOEF;
							self.MODELAI=results.rows.item(0).MODELAI;
							self.FOUR=results.rows.item(0).FOUR;
							self.Existe=true;
						}
					},
					function(tx) {log('Erreur '+tx.message);}
				);
			}, function(err) {
				log('Erreur '+err.code+' '+err.message);
			}, function() {
				// COEF 2
				madb.transaction(
					function(tx) {
						var sql = "SELECT * FROM ModCoef where MODNR='"+Id+"'";
						tx.executeSql(sql,[], 
							function(tx, results) {
								if (results.rows.length == 1) {
									self.MOCOEF2=results.rows.item(0).MOCOEF2;
								}
							},
							function(tx) {log('Erreur '+tx.message);}
						);
					}, function(err) {
						log('Erreur '+err.code+' '+err.message);
					}, function() {
						// LES ELEMENTS
						self.Elements=[];
						madb.transaction(
							function(tx) {
								var sql = "SELECT Element.ELCODE,Element.ELFR FROM Element inner join EleMod on Element.ELCODE=EleMod.ELCODE where EleMod.MODNR='"+Id+"' order by Element.ELCODE";
								tx.executeSql(sql,[], 
									function(tx, results) {
										if (results.rows.length > 0) {
											for (cpt=0;cpt<results.rows.length;cpt++) {
												self.Elements[cpt]=results.rows.item(cpt);
											}
										}
									},
									function(tx) {log('Erreur elem'+tx.message);}
								);
							}, function(err) {
								log('Erreur '+err.code+' '+err.message);
							}, function() {
								// LES CATCUIR
								self.CatCuir=[];
								madb.transaction(
									function(tx) {
										var sql = "select CuirMod.CUCAT, CuirMod.CUIRNR, LiasCuir.CUIRUC from CuirMod inner join LiasCuir on CuirMod.CUIRNR=LiasCuir.CUIRNR "+
											"where CuirMod.MODNR='"+Id+"' and LiasCuir.FOURN='"+self.FOUR+"'";
										tx.executeSql(sql,[], 
											function(tx, results) {
												if (results.rows.length > 0) {
													for (cpt=0;cpt<results.rows.length;cpt++) {
														self.CatCuir[cpt]=results.rows.item(cpt);
													}
												}
											},
											function(tx) {log('Erreur catcuir'+tx.message);}
										);
									}, function(err) {
										log('Erreur '+err.code+' '+err.message);
									}, function() {
										// LES OPTIONS
										madb.transaction(
											function(tx) {
												var sql = "SELECT Num,OPCODE,Opti.OPFR FROM Opti where Opti.FOUR='"+self.FOUR+"' and Opti.MODNR='"+Id+"'";
													log(sql);
												tx.executeSql(sql,[], 
													function(tx, results) {
														if (results.rows.length > 0) {
															for (cpt=0;cpt<results.rows.length;cpt++) {
																self.Opti[cpt]=results.rows.item(cpt);
															}
														}
													},
													function(tx) {log('Erreur options '+tx.message);}
												);
											}, function(err) {
												log('Erreur '+err.code+' '+err.message);
											}, function() {
												callback();
											}
										);
									}
								);
							}
						);
					}
				);
			}
		);
	},
	setcuir: function(CUIRNR,callback) {
		var self=this;
		if (self.CUIRNR!=CUIRNR) {self.COLORNR='';}
		self.CUIRNR=CUIRNR;
		// CHERCHER LA CATEGORIE DU TYPECUIR
		madb.transaction(
			function(tx) {
				var sql = "SELECT CUCAT FROM CuirMod where MODNR='"+self.MODNR+"' and CUIRNR='"+CUIRNR+"'";
					log(sql);
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length > 0) {
							self.CUCAT=results.rows.item(0).CUCAT;
						}
					},
					function(tx) {log('Erreur options '+tx.message);}
				);
			}, function(err) {
				log('Erreur cucat '+err.code+' '+err.message);
			}, function() {
				//Chercher le prix de chaque element
				for (var cpt=0;cpt<self.Elements.length;cpt++) {
					var elcode=self.Elements[cpt].ELCODE;
					(function test(value,elcode,maxv) {
						madb.transaction(
							function(tx) {
								var sql = "SELECT PRIX FROM Prix where MODNR='"+self.MODNR+"' and PXCATEG='"+self.CUCAT+"' and PXELEM='"+elcode+"' order by PXDATE desc";
									log(sql+' '+value);
								tx.executeSql(sql,[], 
									function(tx, results) {
										if (results.rows.length > 0) {
											self.Elements[value].Prix=results.rows.item(0).PRIX;
										}
									},
									function(tx) {log('Erreur rech prix '+this.message);}
								);
							}, function(err) {
								log('Erreur sel prix '+err.code+' '+err.message);
							}, function() {
								if (value==maxv) {
									callback();
								}
							}
						);
					})(cpt,elcode,self.Elements.length-1);
				}
			}
		);
	}
}
/*
	COMMANDE
*/
var Commande = function() {
	this.Existe=false;
	this.Vendeur='';
	this.Actif=0;
	this.Ref='';this.DateC='';this.Genre='';this.Societe='';this.NumTva='';
	this.Civil1='';this.Prenom1='';this.Nom1='';this.Civil2='';this.Prenom2='';this.Nom2='';
	this.Adresse='';this.CP='';this.Ville='';this.Tel1='';this.Tel2='';this.Gsm1='';this.Gsm2='';this.Email='';this.Remarque='';
	this.Fractionner=0;this.NbFraction=0;
	this.TotalTarif=0;
	this.PrixVente=0;
	this.Remise=0;
	this.Reprise=0;
	this.Frais=0;
	this.GenreFrais='';
	this.TotalNet=0;
	this.Financement=0;
	this.MontantFinancement=0;
	this.Exoneration=0;
	this.Acompte=0;
	this.AcompteCarte=0;
	this.AcompteEspece=0;
	this.AcompteCheque=0;
	this.AcompteAutre=0;
	this.SoldeAcompte=0;
	this.DateA='';
	this.Signature1='';
	this.Signature2='';
	this.DetailCommande=[];
};
Commande.prototype = {
	init: function(Id,callback) {
	}
}
/* 
	FENETRE RECHERCHE
*/
function PopulateRech(Quoi,Rech,callback) {
	if (Quoi=='') {Quoi=$('#QuelleRech').val();}
	$('#ValRech').val('');
	switch (Quoi) {
	case 'Modeles':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un modèle');
		madb.transaction(
			function(tx) {
				var sql = "SELECT MODNR, MOUC FROM Mods";
				if (Rech!='') {sql=sql+" where MOUC like '%"+Rech+"%' or MODNR like '%"+Rech+"%'";}
				log(sql);
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length > 0) {
							for (cpt=0;cpt<results.rows.length;cpt++) {
								var modnr=results.rows.item(cpt).MODNR;
								var mouc=results.rows.item(cpt).MOUC;
							    $('#lesli').append('<li><a class="leschoix" id="VR'+modnr+'" onclick="Choix($(this))">'+modnr+' - '+mouc+'</a></li>');
							}
						}
					},
					function(tx) {log('Erreur recherche '+this.message);}
				);
			}, function(err) {
				log('Erreur '+err.code+' '+err.message);
			}, function() {
				callback();
			}
		);
		break;
	case 'TypeCuir':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un type de cuir');
		var modnr=unModele.MODNR;
		log('rech typecuir '+modnr);
		madb.transaction(
			function(tx) {
				var sql = "select cuirmod.CUIRNR,liascuir.CUIRUC from Mods inner join cuirmod on Mods.MODNR=cuirmod.MODNR inner join liascuir on Mods.FOUR=liascuir.FOURN and cuirmod.CUIRNR=liascuir.CUIRNR"+
				" where Mods.MODNR='"+modnr+"'";
				if (Rech!='') {sql=sql+" and (cuirmod.CUIRNR like '%"+Rech+"%' or liascuir.CUIRUC like '%"+Rech+"%')";}
				log(sql);
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length > 0) {
							for (cpt=0;cpt<results.rows.length;cpt++) {
								var cuirnr=results.rows.item(cpt).CUIRNR;
								var cuiruc=results.rows.item(cpt).CUIRUC;
							    $('#lesli').append('<li><a class="leschoix" id="VR'+cuirnr+'|'+cuiruc+'" onclick="Choix($(this))">'+cuirnr+' - '+cuiruc+'</a></li>');
							}
						}
					},
					function(tx) {log('Erreur recherche '+this.message);}
				);
			}, function(err) {
				log('Erreur '+err.code+' '+err.message);
			}, function() {
				callback();
			}
		);
		break;
	case 'Couleur':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher une couleur');
		var four=unModele.FOUR;
		var cuirnr=unModele.CUIRNR;
		log('rech couleur '+four+' '+cuirnr);
		madb.transaction(
			function(tx) {
				var sql = "select COLORNR,COLOUC from LiasColo"+
				" where FOURN='"+four+"' and CUIRNR='"+cuirnr+"'";
				if (Rech!='') {sql=sql+" and (COLORNR like '%"+Rech+"%' or COLOUC like '%"+Rech+"%')";}
				log(sql);
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length > 0) {
							for (cpt=0;cpt<results.rows.length;cpt++) {
								var colornr=results.rows.item(cpt).COLORNR;
								var colouc=results.rows.item(cpt).COLOUC;
							    $('#lesli').append('<li><a class="leschoix" id="VR'+colornr+'|'+colouc+'" onclick="Choix($(this))">'+colornr+' - '+colouc+'</a></li>');
							}
						}
					},
					function(tx) {log('Erreur recherche '+this.message);}
				);
			}, function(err) {
				log('Erreur '+err.code+' '+err.message);
			}, function() {
				callback();
			}
		);
		break;
	case 'Option':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher une option');
		var modnr=unModele.MODNR;
		var four=unModele.FOUR;
		log('rech option '+modnr);
		madb.transaction(
			function(tx) {
				var sql = "select OPCODE,OPFR from Opti"+
				" where MODNR='"+modnr+"' and FOUR='"+four+"'";
				if (Rech!='') {sql=sql+" and (OPCODE like '%"+Rech+"%' or OPFR like '%"+Rech+"%')";}
				log(sql);
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length > 0) {
							for (cpt=0;cpt<results.rows.length;cpt++) {
								var opcode=results.rows.item(cpt).OPCODE;
								var opfr=results.rows.item(cpt).OPFR;
							    $('#lesli').append('<li><a class="leschoix" id="VR'+opcode+'|'+opfr+'" onclick="Choix($(this))">'+opcode+' - '+opfr+'</a></li>');
							}
						}
					},
					function(tx) {log('Erreur recherche '+this.message);}
				);
			}, function(err) {
				log('Erreur '+err.code+' '+err.message);
			}, function() {
				callback();
			}
		);
		break;
	}
}