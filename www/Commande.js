var cde={};
var cdeModele={};
var EcranActif;
function InitCommande() {
    cdeModele=new Modele();
	cde=new Commande();
	VideZones();
	EcranActif=1;
	$('.EcranCde').removeClass('current2');
	$('#Ecran'+EcranActif).addClass('current2');
	var d=new Date();
	cde.Vendeur=User;
	cde.DateC=d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
//	alert(d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear());
}
function VideZones() {
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
	
	VideEcranCdeMod();
	
	$('#cdePV').val('');
	$('#cdePT').val('');
	$('#cdeRem').val('');
	$('#cdeRachat').val('');
	$('#cdeFCLIB').val('');
	$('#cdeFC').val('');
	
	$('#cdePVTOT').val('');
	$('#MontantFin').val('');
}
function VideEcranCdeMod() {
	$('#cdemoduc').html('');
	$('#cdecuiruc').html('');
	$('#cdecolouc').html('');
	$('#cdeopfr').html('');
	$('#Delai').val('');
	$('#cdetLesElems').empty();
	$('#cdeRemMod').html('');
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
		// CHECK
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
		// OBJ CDE
		cde.Societe=$('#Societe').val();cde.NumTva=$('#NumTva').val();cde.RemarqueVendeur=$('#RemarqueVendeur').val();
		cde.Civil0=$('#Civil0Mr').is(':checked')==true?'Mr':'Mme';cde.Responsable=$('#Responsable').val();
		cde.Civil1=$('#Civil1Mr').is(':checked')==true?'Mr':'Mme';cde.Prenom1=$('#Prenom1').val();cde.Nom1=$('#Nom1').val();
		cde.Civil2=$('#Civil2Mr').is(':checked')==true?'Mr':'Mme';cde.Prenom2=$('#Prenom2').val();cde.Nom2=$('#Nom2').val();
		cde.Adresse=$('#Adresse').val();cde.CP=$('#CP').val();cde.Ville=$('#Ville').val();
		cde.Tel1=$('#Tel1').val();cde.Tel2=$('#Tel2').val();cde.Gsm1=$('#Gsm1').val();cde.Gsm2=$('#Gsm2').val();
		cde.Email=$('#Email').val();cde.Remarque=$('#Remarque1').val();
		cde.Fractionner=$('#fracoui').is(':checked')==true?1:0;cde.NbFraction=$('#NbFrac').val();
		// ECRAN SUIVANT
		$('#pfactenssiege').css('display',$('#Societ').is(':checked')==true?'inline':'none');
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 2:
		// CHECK
/*		if ($('#cdemoduc').html()=='') {
			showAlert('Il faut choisir un modèle','Attention','OK'); return false;
		}
		if ($('#cdecuiruc').html()=='') {
			showAlert('Il faut choisir un revêtement','Attention','OK'); return false;
		}
		if ($('#Delai').val()=='') {
			showAlert('Il faut préciser le délai','Attention','OK'); return false;
		}
		if ($('#cdetLesElems tr').length==0) {
			showAlert('Il faut définir les élements','Attention','OK'); return false;
		}*/
		// OBJ CDE
			// ajout du modèle au détail de commande
			cde.DetailCommande.push(cdeModele);
			// quantité des élements
			var cptmod=cde.DetailCommande.length-1;
			var nbelem=cde.DetailCommande[cptmod].Elements.length;
			$('#cdetLesElems tr').each(function(index) {
				var elcode=$(this).children().eq(0).html().split(' -',1)[0];
				var qte=$(this).children().eq(1).html();
				for(cpt=0;cpt<nbelem;cpt++) {
					var el=cde.DetailCommande[cptmod].Elements[cpt];
					if (el.ELCODE==elcode) {
						cde.DetailCommande[cptmod].Elements[cpt].Qte=qte;
					}
				}
			});
			// calculer le prix
			cde.CalculPrix();
			$('#cdePV').val(cde.TotalTarif);
			$('#cdePT').val(cde.TotalTarif);
			$('#cdePVTOT').val(cde.TotalTarif);
		// ECRAN SUIV
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 4:
/*		if ($('#cdePV').val()=='') {
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
		}*/
		cde.Financement=$('#chkfinoui').is(':checked')==true?1:0;
		cde.MontantFinancement=$('#MontantFin').val();
		cde.Frais=$('#cdeFC').val();
		cde.GenreFrais=$('#cdeFCLIB').val();
		cde.Exoneration=$('#chkexon').is(':checked')==true?1:0;
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 5:
/*		if ($('#cdePVTOTTVAC').val()=='') {
			showAlert('Il faut préciser le prix de vente','Attention','OK'); return false;
		}
		if ($('#cdesoldeacompte').val()!='' && $('#cdeacomptedate').val()=='') {
			showAlert('Il faut préciser la date du solde de l\'acompte','Attention','OK'); return false;
		}*/
		// RECAP
		log('ecran5');
		var acompte=0;
		acompte=acompte+$('#cdeacomptecarte').val();
		acompte=acompte+$('#cdeacompteespece').val();
		acompte=acompte+$('#cdeacomptecheque').val();
		acompte=acompte+$('#cdeacompteautre').val();
		cde.Acompte=acompte;
		cde.AcompteCarte=$('#cdeacomptecarte').val();
		cde.AcompteEspece=$('#cdeacompteespece').val();
		cde.AcompteCheque=$('#cdeacomptecheque').val();
		cde.AcompteAutre=$('#cdeacompteautre').val();
		cde.SoldeAcompte=$('#cdesoldeacompte').val();
		cde.DateA=$('#cdeacomptedate').val();
		log('recap');
		RecapCde();
		log('apres recap');
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
	VideEcranCdeMod();
	$('#Ecran'+EcranActif).removeClass('current2');
	EcranActif-=1;
	$('#Ecran'+EcranActif).addClass('current2');
}
function cdeEcranPrix() {
	$('#Ecran'+EcranActif).removeClass('current2');
	EcranActif=4;
	$('#Ecran'+EcranActif).addClass('current2');
}
function ActualisePrix() {
	var PT=parseFloat($('#cdePV').val().replace(',','.'));
	var Rem=parseFloat($('#cdeRem').val().replace(',','.'));
	var Rachat=parseFloat($('#cdeRachat').val().replace(',','.'));
	var FC=parseFloat($('#cdeFC').val().replace(',','.'));
	var pvtot=parseFloat(PT-Rem-Rachat+FC);
	var pvtvac=0;
	if (cde.Exoneration==0) {pvtvac=pvtot*1.21;} else {pvtvac=pvtot;}
	var ac20=pvtvac*0.20;
	$('#cdePVTOT').val(Nombre(pvtot))
	$('#cdePVTOTTVAC').val(Nombre(pvtvac));
	$('#acompte20').html(Nombre(ac20)+' €');
}
function NePasAfficherPrix() {
	cde.AfficherPrix=0;
}
function RecapCde() {
	var r='';
	r='<p>Date : '+cde.DateC+'</p>'
	+'<p>Commande : '+cde.Ref+'</p>'
	+'<p>Vendeur : '+cde.Vendeur+'</p>';
	if (cde.Societe!='') {
		r=r+'<p>Société : '+cde.Societe+'</p>'
		+'<p>Responsable : '+cde.Civil0+' '+cde.Responsable+'</p>'
	} else {
		r=r+'<p>';
		r=r+'Client : <br/>';
		r=r+cde.Civil1+' '+cde.Prenom1+' '+cde.Nom1
		if(cde.Prenom2!='') {
			r=r+'<br/>'+cde.Civil2+' '+cde.Prenom2+' '+cde.Nom2;
		}
		r=r+'</p>';
	}
	if(cde.Adresse!='') {r=r+'<p>Adresse : <br/>'+cde.Adresse+'</p>';}
	if(cde.CP!='') {r=r+'<p>'+cde.CP+' '+cde.Ville+'</p>';}
	if(cde.Tel1!='') {r=r+'<p>Téléphone : '+cde.Tel1+'</p>';}
	if(cde.Tel2!='') {r=r+'<p>Téléphone : '+cde.Tel2+'</p>';}
	if(cde.Gsm1!='') {r=r+'<p>Gsm : '+cde.Gsm1+'</p>';}
	if(cde.Gsm2!='') {r=r+'<p>Gsm : '+cde.Gsm2+'</p>';}
	if(cde.Email!='') {r=r+'<p>Email : '+cde.Email+'</p>';}
	if(cde.Remarque!='') {r=r+'<p>Remarque : <br/>'+cde.Remarque+'</p>';}
	var nbmod=cde.DetailCommande.length;
	for(cptm=0;cptm<nbmod;cptm++) {
		r=r+'<br/><p>Modèle : '+cde.DetailCommande[cptm].MOUC+'</p>';
		if (cde.DetailCommande[cptm].CUIRUC!='') {r=r+'<p>Revêtement : '+cde.DetailCommande[cptm].CUIRUC+'</p>';}
		if (cde.DetailCommande[cptm].COLOUC!='') {r=r+'<p>Couleur : '+cde.DetailCommande[cptm].COLOUC+'</p>';}
		if (cde.DetailCommande[cptm].OPFR!='') {r=r+'<p>Option : '+cde.DetailCommande[cptm].OPFR+'</p>';}
		var nbelem=cde.DetailCommande[cptm].Elements.length;
		for(cpte=0;cpte<nbelem;cpte++) {
			var descelem=cde.DetailCommande[cptm].Elements[cpte].ELFR;
			var Qte=cde.DetailCommande[cptm].Elements[cpte].Qte;
			var Px=cde.DetailCommande[cptm].Elements[cpte].Prix;
			if (Qte>0) {
				r=r+'<p class="ML15">- '+descelem+' : '+Qte;
				if (cde.AfficherPrix==1) {r=r+' = '+(Qte*Px)+' €';}
				r=r+'</p>';
			}
		}
	}
	r=r+'<br/><p><u>Total</u> : </p>';
	r=r+'<p>Prix de vente : '+cde.TotalNet+' €</p>';
	if(cde.Remise!='') {r=r+'<p>Remise : '+cde.Remise+' €</p>';}
	if(cde.Reprise!='') {r=r+'<p>Rachat : '+cde.Reprise+' €</p>';}
	if(cde.Frais!='') {r=r+'<p>Frais complémentaires : '+cde.Frais+' €</p>';}
	r=r+'<p>Prix TVAC : '+cde.TotalTVAC+' €</p>';
	r=r+'<br/><p><u>Acompte payé ce jour</u> : '+cde.Acompte+' €</p>';
	if(cde.AcompteCarte!='') {r=r+'<p>Carte : '+cde.AcompteCarte+' €</p>';}
	if(cde.AcompteEspece!='') {r=r+'<p>Espèce : '+cde.AcompteEspece+' €</p>';}
	if(cde.AcompteCheque!='') {r=r+'<p>Chèque : '+cde.AcompteCheque+' €</p>';}
	if(cde.AcompteAutre!='') {r=r+'<p>Autre : '+cde.AcompteAutre+' €</p>';}
	if(cde.SoldeAcompte!='') {r=r+'<p>Solde acompte : '+cde.SoldeAcompte+' €</p>';}
	if(cde.DateA!='') {r=r+'<p>A payer pour le : '+cde.DateA+'</p>';}
	if(cde.MontantFinancement!='') {r=r+'<br/><p>Financement : '+cde.MontantFinancement+' €</p>';}
	
	$('#RecapCde').html(r);
}