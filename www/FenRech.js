/* 
	FENETRES DE RECHERCHE
*/
function InitRech(Quoi) {
	$('#ChampRech').val('');
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
			//trfInfoModele();
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
				trfModele.COULNR='';
				trfModele.COLOUC='';
				$('#infocouleur').html('');
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
			trfModele.COULNR=$('#ValRech').val();
			trfModele.COLOUC=$('#DescRech').val();
			$('#infocouleur').html('Couleur : '+trfModele.COULNR+' - '+trfModele.COLOUC);
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
	switch (Quoi) {
	case 'trfModeles':
	case 'cdeModeles':
		$('#lesli').empty();
		$('#txtrech').html('Rechercher un modèle');
		madb.transaction(
			function(tx) {
				var sql = "SELECT MODNR, MOUC FROM Mods";
				if (Rech!='') {sql=sql+" where MOUC like '%"+Rech+"%' or MODNR like '%"+Rech+"%'";}
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
	}
}
