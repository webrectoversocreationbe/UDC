var cdeModele={}
var EcranActif;
function InitCommande() {
    cdeModele=new Modele();
	EcranActif=1;
	$('.EcranCde').removeClass('current2');
	$('#Ecran'+EcranActif).addClass('current2');
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
	$('#cdemoduc').html('');
	$('#cdecuiruc').html('');
	$('#cdecolouc').html('');
	$('#cdeopfr').html('');
	$('#Delai').val('');
	$('#cdetLesElems').empty();
	$('#cdeRemMod').html('');
	$('#cdePV').val('');
	$('#cdePT').val('');
	$('#cdeRem').val('');
	$('#cdeRachat').val('');
	$('#cdeFCLIB').val('');
	$('#cdeFC').val('');
	$('#cdePVTOT').val('');
	$('#MontantFin').val('');
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
		$('#pfactenssiege').css('display',$('#Societ').is(':checked')==true?'inline':'none');
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 2:
		if ($('#cdemoduc').html()=='') {
			showAlert('Il faut choisir un modèle','Attention','OK'); return false;
		}
		if ($('#cdemoduc').html()=='') {
			showAlert('Il faut choisir un revêtement','Attention','OK'); return false;
		}
		if ($('#Delai').val()=='') {
			showAlert('Il faut préciser le délai','Attention','OK'); return false;
		}
		if ($('#cdetLesElems tr').length==0) {
			showAlert('Il faut définir les élements','Attention','OK'); return false;
		}
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 4:
		if ($('#cdePV').val()=='') {
			showAlert('Il faut préciser le prix de vente','Attention','OK'); return false;
		}
		if ($('#cdePT').val()=='') {
			showAlert('Il faut préciser le prix total au tarif','Attention','OK'); return false;
		}
		if ($('#cdeFCLIB').val()!='' && $('#cdeFC').val()=='') {
			showAlert('Il faut préciser le montant des frais complémentaires','Attention','OK'); return false;
		}
		if ($('#chkfinoui').is(':checked')==true && $('#MontantFin').val()=='') {
			showAlert('Il faut préciser le montant du financement','Attention','OK'); return false;
		}
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 5:
		if ($('#cdePVTOTTVAC').val()=='') {
			showAlert('Il faut préciser le prix de vente','Attention','OK'); return false;
		}
		if ($('#cdesoldeacompte').val()!='' && $('#cdeacomptedate').val()=='') {
			showAlert('Il faut préciser la date du solde de l\'acompte','Attention','OK'); return false;
		}
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	}
}
function cdeInfoModele() {
	$('#cdemoduc').html('&nbsp;');
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
			$('#cdeRemMod').html('<p class="ML15"><u>Remarque</u> :<br/>'+remarque+'</p>');
		}
	});
}
function cdeCroquis() {
	$('#croquis').css('display','block');
}
function cdeCroquisFini() {
	$('#croquis').css('display','none');
}
function cdeCroquisEfface() {
	var api = $('#sigPadCroquis').signaturePad();
	api.clearCanvas();
}
function btnNouvMod() {
    cdeModele=new Modele();
	$('#Ecran'+EcranActif).removeClass('current2');
	EcranActif-=1;
	$('#Ecran'+EcranActif).addClass('current2');
}
function cdeEcranPrix() {
	$('#Ecran'+EcranActif).removeClass('current2');
	EcranActif=4;
	$('#Ecran'+EcranActif).addClass('current2');
}