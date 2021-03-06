/*
	LES OBJETS (Classes)
*/
var Modele = function() {
	this.Existe=false;
	this.Perso=false;
	this.MODNR='';
	this.MODUC='';
	this.MOCOEF=1;
	this.MOCOEF2=1;
	this.MODELAI=0;
	this.DelaiMax=0;
	this.FOUR='';
	this.CUIRNR='';
	this.CUIRUC='';
	this.COLORNR='';
	this.COLOUC='';
	this.OPCODE='';
	this.OPFR='';
	this.CROQUIS='';
	this.Remarque='';
	this.Elements=[];
	this.CatCuir=[];
	this.Couleurs=[];
	this.bCouleur=0;
	this.Opti=[];
	this.bOptions=0;
};
Modele.prototype = {
	init: function(Id,callback) {
		var bOk=false; var self=this;
		// FICHE MODS
		madb.transaction(
			function(tx) {
				var sql = "SELECT * FROM Mods where MODNR='"+Id+"'";
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length == 1) {
							self.MODNR=results.rows.item(0).MODNR;
							self.MODUC=results.rows.item(0).MODUC;
							self.MOCOEF=results.rows.item(0).MOCOEF;
							self.MODELAI=results.rows.item(0).MODELAI;
							self.DelaiMax=results.rows.item(0).MODELAI+2;
							self.FOUR=results.rows.item(0).FOUR;
							self.Existe=true;
							self.Perso=false;
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
									self.MOCOEF=results.rows.item(0).MOCOEF;
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
												tx.executeSql(sql,[], 
													function(tx, results) {
														if (results.rows.length > 0) {
															self.bOptions=1;
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
				// LES COULEURS
				madb.transaction(
					function(tx) {
						var sql = "SELECT * FROM LiasColo where FOURN='"+self.FOUR+"' and CUIRNR='"+CUIRNR+"'";
						tx.executeSql(sql,[], 
							function(tx, results) {
								if (results.rows.length > 0) {
									self.bCouleur=1;
									for (var cpt=0;cpt<results.rows.length;cpt++) {
										self.Couleurs[cpt]=results.rows.item(cpt);
									}
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
										tx.executeSql(sql,[], 
											function(tx, results) {
												if (results.rows.length > 0) {
													self.Elements[value].PX=results.rows.item(0).PRIX;
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
		);
	}
}
/*
	COMMANDE
*/
var Commande = function() {
	this.Existe=false;
	this.bAnnule=0;
	this.RaisonAnnulation='';
	this.Vendeur='';
	this.Actif=0;
	this.Ref='';this.DateC='';this.DateCYYYYMMDD='';this.Etat='';
	this.Societe='';this.NumTva='';this.RemarqueVendeur='';
	this.Civil0='';this.Responsable='';this.Civil1='';this.Prenom1='';this.Nom1='';this.Civil2='';this.Prenom2='';this.Nom2='';
	this.Adresse='';this.CP='';this.Ville='';this.Tel1='';this.Tel2='';this.Gsm1='';this.Gsm2='';this.Email='';this.Remarque='';
	this.Fractionner=0;this.NbFraction=0;
	this.FactEnsSiege=0;
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
	this.TotalTVAC=0;
	this.Acompte=0;
	this.AcompteCarte=0;
	this.AcompteEspece=0;
	this.AcompteCheque=0;
	this.AcompteAutre=0;
	this.SoldeAcompte=0;
	this.DateA='';
	this.FCRepr=0;
	this.FCEtage1=0;
	this.FCEtage3=0;
	this.FCEtage8=0;
	this.FCTSpecial1='';
	this.FCTSpecial2='';
	this.FCSpecial1=0;
	this.FCSpecial2=0;
	this.Signature1='';
	this.Signature2='';
	this.AfficherPrix=1;
	this.Recap='';
	this.DetailCommande=[];
};
Commande.prototype = {
	init: function(Id,callback) {
	},
	CalculPrix: function() {
//		log('calcul prix');
		var Prix=0;
		var nbmod=this.DetailCommande.length;
		for(cptm=0;cptm<nbmod;cptm++) {
			var coef=this.DetailCommande[cptm].MOCOEF;
			var coef2=this.DetailCommande[cptm].MOCOEF2;
			var nbelem=this.DetailCommande[cptm].Elements.length;
			for(cpte=0;cpte<nbelem;cpte++) {
				var Qte=this.DetailCommande[cptm].Elements[cpte].Qte;
				if (Qte>0) {
					var Px=this.DetailCommande[cptm].Elements[cpte].PX;
					if (UserVersion==1) {Px=Px*coef;} else {Px=Px*coef2;}
					Px=Math.ceil(Px/10)*10;
					this.DetailCommande[cptm].Elements[cpte].Prix=Px;
					Prix=Prix+(Qte*Px);
				}
			}
		}
		this.TotalTarif=Prix;
	}
}
