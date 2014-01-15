var cdeModele={}
var EcranActif;
function InitCommande() {
    cdeModele=new Modele();
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
	$('#cdemoduc').html('');
	$('#cdecuiruc').html('');
	$('#cdecolouc').html('');
	$('#cdeopfr').html('');
	$('#cdetLesElems').empty();
    cdeModele.init($('#ValRech').val(), function() {
        if (cdeModele.Existe==true) {
            $('#cdemoduc').html(cdeModele.MODNR+' - '+cdeModele.MOUC);
			$('#Delai').val(cdeModele.MODELAI);
        } else {
            $('#cdemoduc').html('<p>Modèle innexistant</p>');
			$('#Delai').val('');
        }
    });
}
function cdeAjRem() {
	showPrompt('Entrez la remarque :','Remarque du modèle','',function(results) {
		if (results.buttonIndex==1) {
			var remarque=results.input1
			$('#cdeRemMod').html('<p><u>Remarque</u> :<br/>'+remarque+'</p>');
		}
	});
}
function cdeCroquis() {
	$('#croquis').css('display','block');
}
function cdeCroquisFini() {
	$('#croquis').css('display','none');
}
