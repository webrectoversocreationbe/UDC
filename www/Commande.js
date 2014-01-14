var cdeModele={}
var EcranActif;
function InitCommande() {
	EcranActif=1;
	var d=new Date();
//	alert(d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear());
	$('#RemarqueVendeur').val('');
	$('#Societe').val('');
	$('#NumTva').val('');
	$('#Responsable').val('');
	$('#Prenom1').val('');
	$('#Nom1').val('');
	$('#Prenom2').val('');
	$('#Nom2').val('');
	$('#Adresse').val('');
	$('#CP').val('');
	$('#Ville').val('');
	$('#Email').val('');
	$('#Tel1').val('');
	$('#Tel2').val('');
	$('#Gsm1').val('');
	$('#Gsm2').val('');
	$('#Remarque1').val('');
}
function chkFrac() {
	$('#rubrfrac').css('display',$('#fracnon').is(':checked')==true?'none':'inline');
}
function chkPartSoc() {
	if ($('#Partic').is(':checked')==true) {
		$('#rubrsoc').css('display','none');
		$('#rubrpart').css('display','block');
	} else {
		$('#rubrsoc').css('display','block');
		$('#rubrpart').css('display','none');
	}
}
function prevEcran() {
	$('#Ecran'+EcranActif).removeClass('current2');
	EcranActif-=1;
	$('#Ecran'+EcranActif).addClass('current2');
}
function chkEcran() {
	switch (EcranActif) {
	case 1:
/*			if ($('#fracoui').is(':checked')==true && $('#NbFrac').val()=='') {
			alert('Vous devez entrer le nombre de fractionnement'); return false;
		}
		if ($('#Societ').is(':checked')==true && $('#Societe').val()=='') {
			alert('Le nom de la société est obligatoire'); return false;
		}
		if ($('#Nom1').val()=='' || $('#Prenom1').val()=='') {
			alert('Le prénom et le nom est obligatoire'); return false;
		}
		if ($('#CP').val()=='') {
			alert('Le code postal est obligatoire'); return false;
		}
		if ($('#Ville').val()=='') {
			alert('L\'adresse est obligatoire'); return false;
		}
		if ($('#Tel1').val()=='') {
			alert('Le téléphone est obligatoire'); return false;
		}*/
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	}
}
function cdeInfoModele() {
    cdeModele=new Modele();
    cdeModele.init($('#ValRech').val(), function() {
		log('modele init');
        if (cdeModele.Existe==true) {
			log('modele existe');
            $('#cdemoduc').html(cdeModele.MODNR+' - '+cdeModele.MOUC);
			$('#Delai').val(cdeModele.MODELAI);
			log('modele les elems');
            var l=cdeModele.Elements.length;
            $('#cdetLesElems').html('');
            for(cpt=0;cpt<l;cpt++) {
                var el='<tr><td>'+cdeModele.Elements[cpt].ELCODE+' - '+cdeModele.Elements[cpt].ELFR+'</td><td align="right" id="cdeelqte'+cdeModele.Elements[cpt].ELCODE+'"></td></tr>';
                $('#cdetLesElems').append(el);
            }
        } else {
            $('#cdemoduc').html('<p>Modèle innexistant</p>');
			$('#Delai').val('');
        }
    });
}
