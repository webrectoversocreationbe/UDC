function InitCommande() {
	var d=new Date();
//	alert(d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear());
	$('#RemarqueVendeur').html('');
	$('#Societe').html('');
	$('#NumTva').html('');
	$('#Responsable').html('');
	$('#Prenom1').html('');
	$('#Nom1').html('');
	$('#Prenom2').html('');
	$('#Nom2').html('');
	$('#Adresse').html('');
	$('#CP').html('');
	$('#Ville').html('');
	$('#Email').html('');
	$('#Tel1').html('');
	$('#Tel2').html('');
	$('#Gsm1').html('');
	$('#Gsm2').html('');
	$('#Remarque1').html('');
}
var EcranActif=1;
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
