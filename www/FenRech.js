/* 
	FENETRES DE RECHERCHE
*/
function InitRech(Quoi,callback) {
	$('#ChampRech').val('');
	$('#DescRech').val('');
	$('#QuelleRech').val(Quoi);
	var valrech=$('#ValRech').val();
	if (Quoi=='trfModeles') {
		PopulateRech('trfModeles','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			trfInfoModele();
		});
	} else if (Quoi=='cdeModeles') {
		PopulateRech('cdeModeles','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			cdeInfoModele();
		});
	} else if (Quoi=='trfTypeCuir') {
		PopulateRech('trfTypeCuir','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			trfModele.setcuir($('#ValRech').val(),function(){
				trfModele.CUIRUC=$('#DescRech').val();
				$('#infotypcuir').html('Revêtement : '+trfModele.CUIRNR+' - '+trfModele.CUIRUC);
				var l=trfModele.Elements.length;
				for(cpt=0;cpt<l;cpt++) {
					var elcode=trfModele.Elements[cpt].ELCODE;
					var quelcoef=UserVersion==2?trfModele.MOCOEF2:trfModele.MOCOEF;
					var px=Nombre(trfModele.Elements[cpt].Prix*quelcoef);
					$('#trfpx'+elcode).html(px+' €');
				}
				trfModele.COLORNR='';
				trfModele.COLOUC='';
				$('#infocouleur').html('');
			});
		});
	} else if (Quoi=='cdeTypeCuir') {
		PopulateRech('cdeTypeCuir','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			cdeModele.setcuir($('#ValRech').val(),function(){
				cdeModele.CUIRUC=$('#DescRech').val();
				$('#cdecuiruc').html(cdeModele.CUIRNR+' - '+cdeModele.CUIRUC);
				var l=cdeModele.Elements.length;
				for(cpt=0;cpt<l;cpt++) {
					var elcode=cdeModele.Elements[cpt].ELCODE;
					var quelcoef=UserVersion==2?cdeModele.MOCOEF2:cdeModele.MOCOEF;
					var px=Nombre(cdeModele.Elements[cpt].Prix*quelcoef);
//					$('#trfpx'+elcode).html(px+' €');
				}
				cdeModele.COLORNR='';
				cdeModele.COLOUC='';
				$('#cdecolouc').html('');
			});
		});
	} else if (Quoi=='trfCouleur') {
		PopulateRech('trfCouleur','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			trfModele.COLORNR=$('#ValRech').val();
			trfModele.COLOUC=$('#DescRech').val();
			$('#infocouleur').html('Couleur : '+trfModele.COLORNR+' - '+trfModele.COLOUC);
		});
	} else if (Quoi=='cdeCouleur') {
		PopulateRech('cdeCouleur','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			cdeModele.COLORNR=$('#ValRech').val();
			cdeModele.COLOUC=$('#DescRech').val();
			$('#cdecolouc').html(cdeModele.COLORNR+' - '+cdeModele.COLOUC);
		});
	} else if (Quoi=='trfOption') {
		PopulateRech('trfOption','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			trfModele.OPCODE=$('#ValRech').val();
			trfModele.OPFR=$('#DescRech').val();
			$('#infooption').html('Option : '+trfModele.OPCODE+' - '+trfModele.OPFR);
		});
	} else if (Quoi=='cdeOption') {
		PopulateRech('cdeOption','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			cdeModele.OPCODE=$('#ValRech').val();
			cdeModele.OPFR=$('#DescRech').val();
			$('#cdeopfr').html(cdeModele.OPCODE+' - '+cdeModele.OPFR);
		});
	} else if (Quoi=='cdeAjElem') {
		if (cdeModele.MODNR=='') {
			Vibre(1000);
			showAlert('Choisissez un modèle','Impossible',['Ok']);
		} else {
			PopulateRech('cdeAjElem','',function() {
				$('.PanneauRech').show();
			});
			$('#btnAnnulerPanRech').click(function() {
				$('.PanneauRech').hide();
			});
			$( "#btnOKPanRech").unbind( "click" );
			$('#btnOKPanRech').click(function() {
				$('.PanneauRech').hide();
				var elcode=$('#ValRech').val();
				var elfr=$('#DescRech').val();
				var qte=1;
				showPrompt('Entrez la quantité :',elfr,qte,function(results) {
					if (results.buttonIndex==1) {
						qte=results.input1
						var ret='<tr id="cdeelem'+elcode+'"><td>'+elcode+' - '+elfr+'</td><td align="right">'+qte+'</td></tr>';
						$('#cdetLesElems').append(ret);
					}
				});
			});
		}
	} else if (Quoi=='cdeSupprElem') {
		if (cdeModele.MODNR=='') {
			Vibre(1000);
			showAlert('Choisissez un modèle','Impossible',['Ok']);
		} else {
			var nbelem=$('#cdetLesElems tr').length;
			if (nbelem==0) {
				showAlert('Rien à supprimer','Impossible',['Ok']);
			} else {
				PopulateRech('cdeSupprElem','',function() {
					$('.PanneauRech').show();
				});
				$('#btnAnnulerPanRech').click(function() {
					$('.PanneauRech').hide();
				});
				$( "#btnOKPanRech").unbind( "click" );
				$('#btnOKPanRech').click(function() {
					$('.PanneauRech').hide();
					var elcode=$('#ValRech').val();
					var elfr=$('#DescRech').val();
					$('#cdeelem'+elcode).remove();
				});
			}
		}
	} else if (Quoi=='LesBonsDeCommande') {
		PopulateRech('LesBonsDeCommande','',function() {
			$('.PanneauRech').show();
		});
		$('#btnAnnulerPanRech').click(function() {
			$('.PanneauRech').hide();
		});
		$( "#btnOKPanRech").unbind( "click" );
		$('#btnOKPanRech').click(function() {
			$('.PanneauRech').hide();
			// DETAIL CDE
			var ref=$('#ValRech').val();
			DetailBon(ref);
			log('fin fen rech');
		});
	}
}
function Choix(obj) {
	$('#ChampRech').val(obj.text());
	var t=obj.prop('id').substr(2).split('|');
	$('#ValRech').val(t[0]);
	$('#DescRech').val(t[1]);
}
function PopulateRech(Quoi,Rech,callback) {
	if (Quoi=='') {Quoi=$('#QuelleRech').val();}
	$('#ValRech').val('');
//	$('#btnOKPanRech').propr("disabled",false);
	switch (Quoi) {
	case 'trfModeles':
	case 'cdeModeles':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un modèle');
		madb.transaction(
			function(tx) {
				var sql = "SELECT MODNR, MODUC FROM Mods";
				if (Rech!='') {sql=sql+" where MODUC like '%"+Rech+"%' or MODNR like '%"+Rech+"%'";}
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length > 0) {
							for (cpt=0;cpt<results.rows.length;cpt++) {
								var modnr=results.rows.item(cpt).MODNR;
								var mouc=results.rows.item(cpt).MODUC;
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
	case 'trfTypeCuir':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un type de cuir');
		var modnr=trfModele.MODNR;
		madb.transaction(
			function(tx) {
				var sql = "select cuirmod.CUIRNR,liascuir.CUIRUC from Mods inner join cuirmod on Mods.MODNR=cuirmod.MODNR inner join liascuir on Mods.FOUR=liascuir.FOURN and cuirmod.CUIRNR=liascuir.CUIRNR"+
				" where Mods.MODNR='"+modnr+"'";
				if (Rech!='') {sql=sql+" and (cuirmod.CUIRNR like '%"+Rech+"%' or liascuir.CUIRUC like '%"+Rech+"%')";}
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
	case 'cdeTypeCuir':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un type de cuir');
		var modnr=cdeModele.MODNR;
		madb.transaction(
			function(tx) {
				var sql = "select cuirmod.CUIRNR,liascuir.CUIRUC from Mods inner join cuirmod on Mods.MODNR=cuirmod.MODNR inner join liascuir on Mods.FOUR=liascuir.FOURN and cuirmod.CUIRNR=liascuir.CUIRNR"+
				" where Mods.MODNR='"+modnr+"'";
				if (Rech!='') {sql=sql+" and (cuirmod.CUIRNR like '%"+Rech+"%' or liascuir.CUIRUC like '%"+Rech+"%')";}
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
	case 'trfCouleur':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher une couleur');
		var four=trfModele.FOUR;
		var cuirnr=trfModele.CUIRNR;
		madb.transaction(
			function(tx) {
				var sql = "select COLORNR,COLOUC from LiasColo"+
				" where FOURN='"+four+"' and CUIRNR='"+cuirnr+"'";
				if (Rech!='') {sql=sql+" and (COLORNR like '%"+Rech+"%' or COLOUC like '%"+Rech+"%')";}
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
	case 'cdeCouleur':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher une couleur');
		var four=cdeModele.FOUR;
		var cuirnr=cdeModele.CUIRNR;
		madb.transaction(
			function(tx) {
				var sql = "select COLORNR,COLOUC from LiasColo"+
				" where FOURN='"+four+"' and CUIRNR='"+cuirnr+"'";
				if (Rech!='') {sql=sql+" and (COLORNR like '%"+Rech+"%' or COLOUC like '%"+Rech+"%')";}
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
	case 'trfOption':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher une option');
		var modnr=trfModele.MODNR;
		var four=trfModele.FOUR;
		madb.transaction(
			function(tx) {
				var sql = "select OPCODE,OPFR from Opti"+
				" where MODNR='"+modnr+"' and FOUR='"+four+"'";
				if (Rech!='') {sql=sql+" and (OPCODE like '%"+Rech+"%' or OPFR like '%"+Rech+"%')";}
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
	case 'cdeOption':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher une option');
		var modnr=cdeModele.MODNR;
		var four=cdeModele.FOUR;
		madb.transaction(
			function(tx) {
				var sql = "select OPCODE,OPFR from Opti"+
				" where MODNR='"+modnr+"' and FOUR='"+four+"'";
				if (Rech!='') {sql=sql+" and (OPCODE like '%"+Rech+"%' or OPFR like '%"+Rech+"%')";}
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
	case 'cdeAjElem':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un élément');
		for (var cpt=0;cpt<cdeModele.Elements.length;cpt++) {
			var elcode=cdeModele.Elements[cpt].ELCODE;
			var elfr=cdeModele.Elements[cpt].ELFR;
			$('#lesli').append('<li><a class="leschoix" id="VR'+elcode+'|'+elfr+'" onclick="Choix($(this))">'+elcode+' - '+elfr+'</a></li>');
		}
		callback();
		break;
	case 'cdeSupprElem':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un élément');
		var nbelem=$('#cdetLesElems tr').length;
		for (var cpt=0;cpt<nbelem;cpt++) {
			var elcode=$('#cdetLesElems tr:eq('+cpt+')').attr('id').substr(7);
			var elem=$('#cdetLesElems tr:eq('+cpt+') td').html();
			log(elcode+':'+elem);
			$('#lesli').append('<li><a class="leschoix" id="VR'+elcode+'|" onclick="Choix($(this))">'+elem+'</a></li>');
		}
		callback();
		break;
	case 'LesBonsDeCommande':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un bon de commande');
		madb.transaction(
			function(tx) {
				var sql = "select * from Commande";
				tx.executeSql(sql,[], 
					function(tx, results) {
						if (results.rows.length > 0) {
							for (cpt=0;cpt<results.rows.length;cpt++) {
								var ref=results.rows.item(cpt).Ref;
								var datec=results.rows.item(cpt).DateC;
								var totaltvac=results.rows.item(cpt).TotalTVAC;
								var nomcli='';
								if (results.rows.item(cpt).Prenom1!='') {nomcli=results.rows.item(cpt).Civil1+' '+results.rows.item(cpt).Prenom1+' '+results.rows.item(cpt).Nom1;}
								if (results.rows.item(cpt).Societe!='') {nomcli=results.rows.item(cpt).Societe+' '+results.rows.item(cpt).Civil0+' '+results.rows.item(cpt).Responsable;}
							    $('#lesli').append('<li><a class="leschoix" id="VR'+ref+'|'+datec+'" onclick="Choix($(this))">'+ref+' - '+FormatDateI(datec)+' - '+nomcli+' : '+totaltvac+' €</a></li>');
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
