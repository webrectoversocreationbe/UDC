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