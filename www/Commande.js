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
	EffacerSign();
	cde.Vendeur=User;
	var d=new Date();
	cde.DateC=d.getDate()+" "+NomMois((d.getMonth()+1))+" "+d.getFullYear();
	var mm=d.getMonth()+1;
	var dd=d.getDate();
	if (dd.length==3) {dd=dd[1]+dd[2];}
	cde.DateCYYYYMMDD=d.getFullYear()+'-'+(mm[1]?mm:'0'+mm)+'-'+(dd[1]?dd:'0'+dd);
	dbcommande.newNum(function(Ref) {
		cde.Ref=Ref;
		$('.DateC').html(cde.DateC);
		$('.NumCde').html('Commande : <strong>'+Ref+'</strong>');
		$('.User').html(User);
	});
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
	$('#cdeacomptecarte').val('');
	$('#cdeacompteespece').val('');
	$('#cdeacomptecheque').val('');
	$('#cdeacompteautre').val('');
	$('#cdesoldeacompte').val('');
	$('#cdeacomptedate').val('');
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
	cdeCroquisEfface();
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
	case 1: // Infos clients
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
		cde.Fractionner=$('#fracoui').is(':checked')==true?1:0;cde.NbFraction=parseInt($('#NbFrac').val()) || 0;
		// ECRAN SUIVANT
		$('#pfactenssiege').css('display',$('#Societ').is(':checked')==true?'inline':'none');
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 2: // Ecran modèle > commande
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
			// CROQUIS
			var api = $('#sigPadCroquis').signaturePad();
			cdeModele.Remarque=$('#cdeRemModCtn').html();
			cdeModele.CROQUIS=api.getSignatureString();
			// ajout du modèle au détail de commande
			cde.DetailCommande.push(cdeModele);
			// quantité des élements
			var cptmod=cde.DetailCommande.length-1;
			var nbelem=cde.DetailCommande[cptmod].Elements.length;
			cde.DetailCommande[cptmod].Delai=$('#Delai').val();
			if ($('#GenreASAP').is(':checked')==true) {cde.DetailCommande[cptmod].GenreDelai='ASAP';} else {cde.DetailCommande[cptmod].GenreDelai='Respecter';}
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
			$('#cdePV').val(FormatNombre(cde.TotalTarif,2,''));
			$('#cdePT').val(FormatNombre(cde.TotalTarif,2,''));
			$('#cdePVTOT').val(FormatNombre(cde.TotalTarif,2,''));
			cde.PrixVente=parseFloat($('#cdePV').val().replace(',','.')) || 0;
			if (cde.AfficherPrix==0) {
				cde.PrixVente=parseFloat($('#cdePT').val().replace(',','.')) || 0;
			}
		// ECRAN SUIV
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 3: // Ecran ajouter un modèle ?
		break;
	case 4: // Prix de vente + Remise + Rachat
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
		cde.MontantFinancement=parseFloat($('#MontantFin').val().replace(',','.')) || 0;
		cde.Remise=parseFloat($('#cdeRem').val().replace(',','.')) || 0;
		cde.Reprise=parseFloat($('#cdeRachat').val().replace(',','.')) || 0;
		cde.Frais=parseFloat($('#cdeFC').val().replace(',','.')) || 0;
		cde.GenreFrais=$('#cdeFCLIB').val();
		if($('#chkexon').is(':checked')==true) {cde.Exoneration=1;} else {cde.Exoneration=0;}
		ActualisePrix();
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 5: // Prix TVAC + Acompte
/*		if ($('#cdePVTOTTVAC').val()=='') {
			showAlert('Il faut préciser le prix de vente','Attention','OK'); return false;
		}
		if ($('#cdesoldeacompte').val()!='' && $('#cdeacomptedate').val()=='') {
			showAlert('Il faut préciser la date du solde de l\'acompte','Attention','OK'); return false;
		}*/
		// PREPARE RECAP
		var acompte=0;
		if ($('#cdeacomptecarte').val()!='') {acompte=acompte+parseFloat($('#cdeacomptecarte').val().replace(',','.')) || 0;}
		if ($('#cdeacompteespece').val()!='') {acompte=acompte+parseFloat($('#cdeacompteespece').val().replace(',','.')) || 0;}
		if ($('#cdeacomptecheque').val()!='') {acompte=acompte+parseFloat($('#cdeacomptecheque').val().replace(',','.')) || 0;}
		if ($('#cdeacompteautre').val()!='') {acompte=acompte+parseFloat($('#cdeacompteautre').val().replace(',','.')) || 0;}
		cde.Acompte=parseFloat(acompte) || 0;
		cde.AcompteCarte=parseFloat($('#cdeacomptecarte').val().replace(',','.')) || 0;
		cde.AcompteEspece=parseFloat($('#cdeacompteespece').val().replace(',','.')) || 0;
		cde.AcompteCheque=parseFloat($('#cdeacomptecheque').val().replace(',','.')) || 0;
		cde.AcompteAutre=parseFloat($('#cdeacompteautre').val().replace(',','.')) || 0;
		cde.SoldeAcompte=parseFloat($('#cdesoldeacompte').val().replace(',','.')) || 0;
		cde.DateA=$('#cdeacomptedate').val();
		cde.TotalNet=parseFloat($('#cdePVTOT').val().replace(',','.')) || 0;
		cde.TotalTVAC=parseFloat($('#cdePVTOTTVAC').val().replace(',','.')) || 0;
		RecapCde();
		var prenomnom='';
		if ($('#Societ').is(':checked')==true && $('#Societe').val()=='') {
			prenomnom=cde.Civil0+' '+cde.Responsable;
		} else {
			prenomnom=cde.Civil1+' '+cde.Prenom1+' '+cde.Nom1;
		}
		$('#nomsign').html(prenomnom);
		
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 6: // RECAP
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		var resp=$('#Civil0Mr').is(':checked')==true?'Mr':'Mme';
		resp=resp+' '+$('#Responsable').val();
		var mr=$('#Civil1Mr').is(':checked')==true?'Mr':'Mme';
		mr=mr+' '+$('#Prenom1').val()+' '+$('#Nom1').val();
		var mme=$('#Civil2Mr').is(':checked')==true?'Mr':'Mme';
		mme=mme+' '+$('#Prenom2').val()+' '+$('#Nom2').val();
		if ($('#Partic').is(':checked')==true) {
			$('#QuiSigneApres').val(1);
			$('#nomsign').html(mr);
		} else {
			$('#QuiSigneApres').val(3);
			$('#nomsign').html(resp);
		}
		break;
	case 7: // SIGNATURES
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
            $('#cdemoduc').html(cdeModele.MODNR+' - '+cdeModele.MODUC);
			$('#Delai').val(cdeModele.MODELAI);
        } else {
            $('#cdemoduc').html('<p>Modèle innexistant</p>');
			$('#Delai').val('');
        }
    });
}
function DefMod(Quoi) {
	switch(Quoi) {
		case 'cdeModeles':
		case 'cdeTypeCuir':
		case 'cdeCouleur':
		case 'cdeOption':
			InitRech(Quoi);
			break;
	}
}
function EffacerSign() {
	var api = $('#sigPadSign1').signaturePad();
	api.clearCanvas();
}
function OkSign() {
	var genrecivil=0;
	// 1 Mr  ---- 2 Mr Mme ---- 3 Resp
	if ($('#Responsable').val()!='') {genrecivil=3;}
	else if ($('#Prenom2').val()!='') {genrecivil=2;}
	else {genrecivil=1;}
	var resp=$('#Civil0Mr').is(':checked')==true?'Mr':'Mme';
	resp=resp+' '+$('#Responsable').val();
	var mr=$('#Civil1Mr').is(':checked')==true?'Mr':'Mme';
	mr=mr+' '+$('#Prenom1').val()+$('#Nom1').val();
	var mme=$('#Civil2Mr').is(':checked')==true?'Mr':'Mme';
	mme=mme+' '+$('#Prenom2').val()+$('#Nom2').val();
	var qsa=$('#QuiSigneApres').val();
	var api = $('#sigPadSign1').signaturePad();
	var prenomnom='';
	if(genrecivil==3) {
		cde.Signature1=api.getSignatureString();
		cde.Signature2='';
		chkEcran();
	}
	if ($('#Prenom2').val()=='') {
		chkEcran();
	}
	if (qsa==1) {
		cde.Signature1=api.getSignatureString();
		$('#QuiSigneApres').val(2);
		$('#nomsign').html(mme);
		EffacerSign();
		return true;
	}
	if ($('#QuiSigneApres').val()==2) {
		cde.Signature2=api.getSignatureString();
		chkEcran();
	}
}
function cdeAjRem() {
	showPrompt('Entrez la remarque :','Remarque du modèle','',function(results) {
		if (results.buttonIndex==1) {
			var remarque=results.input1
			$('#cdeRemMod').html('<p class="ML15"><u>Remarque</u> :<br/><span id="cdeRemModCtn">'+remarque+'</span></p>');
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
	var PT=cde.AfficherPrix==1?$('#cdePV').val():$('#cdePT').val();
	var Rem=$('#cdeRem').val();
	var Rachat=$('#cdeRachat').val();
	var FC=$('#cdeFC').val();
	var pvtot=parseFloat(PT.replace(' ','').replace(',','.')) || 0;
	if (Rem!='') {pvtot=pvtot-Rem;}
	if (Rachat!='') {pvtot=pvtot-Rachat;}
	if (FC!='') {pvtot=pvtot+parseFloat(FC);}
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
		r=r+'<br/><p><u>Modèle</u> : <br/>'+cde.DetailCommande[cptm].MODNR+' - '+cde.DetailCommande[cptm].MODUC+'</p>';
		if (cde.DetailCommande[cptm].CUIRUC!='') {r=r+'<p>Revêtement : '+cde.DetailCommande[cptm].CUIRUC+'</p>';}
		if (cde.DetailCommande[cptm].COLOUC!='') {r=r+'<p>Couleur : '+cde.DetailCommande[cptm].COLOUC+'</p>';}
		if (cde.DetailCommande[cptm].OPFR!='') {r=r+'<p>Option : '+cde.DetailCommande[cptm].OPFR+'</p>';}
		if (cde.DetailCommande[cptm].Delai!='') {r=r+'<p>Délai : '+cde.DetailCommande[cptm].Delai+' - '+cde.DetailCommande[cptm].GenreDelai+'</p>';}
		var nbelem=cde.DetailCommande[cptm].Elements.length;
		for(cpte=0;cpte<nbelem;cpte++) {
			var descelem=cde.DetailCommande[cptm].Elements[cpte].ELFR;
			var Qte=cde.DetailCommande[cptm].Elements[cpte].Qte;
			var Px=cde.DetailCommande[cptm].Elements[cpte].Prix;
			if (Qte>0) {
				r=r+'<p class="ML15">- '+descelem+' : '+Qte;
				if (cde.AfficherPrix==1) {r=r+' = '+Nombre(Qte*Px)+' €';}
				r=r+'</p>';
			}
		}
	}
	r=r+'<br/><p><u>Total</u> : </p>';
	if (cde.AfficherPrix==0) {
		r=r+'<p>Prix de vente : '+Nombre(cde.PrixTarif)+' €</p>';
	} else {
		r=r+'<p>Prix de vente : '+Nombre(cde.PrixVente)+' €</p>';
	}
	if(cde.Remise>0) {r=r+'<p>Remise : '+Nombre(cde.Remise)+' €</p>';}
	if(cde.Reprise>0) {r=r+'<p>Rachat : '+Nombre(cde.Reprise)+' €</p>';}
	if(cde.Frais>0) {r=r+'<p>Frais complémentaires : '+Nombre(cde.Frais)+' €</p>';}
	r=r+'<p>Prix TVAC : '+Nombre(cde.TotalTVAC)+' €</p>';
	r=r+'<br/><p><u>Acompte payé ce jour</u> : '+Nombre(cde.Acompte)+' €</p>';
	if(cde.AcompteCarte>0) {r=r+'<p>Carte : '+Nombre(cde.AcompteCarte)+' €</p>';}
	if(cde.AcompteEspece>0) {r=r+'<p>Espèce : '+Nombre(cde.AcompteEspece)+' €</p>';}
	if(cde.AcompteCheque>0) {r=r+'<p>Chèque : '+Nombre(cde.AcompteCheque)+' €</p>';}
	if(cde.AcompteAutre>0) {r=r+'<p>Autre : '+Nombre(cde.AcompteAutre)+' €</p>';}
	if(cde.SoldeAcompte>0) {r=r+'<p>Solde acompte : '+Nombre(cde.SoldeAcompte)+' €</p>';}
	if(cde.DateA!='') {r=r+'<p>A payer pour le : '+cde.DateA+'</p>';}
	if(cde.MontantFinancement>0) {r=r+'<br/><p>Financement : '+cde.MontantFinancement+' €</p>';}
	
	$('.RecapCde').html(r);
}
function ConfirmCde() {
	//dump(cde,'log');
	$('.loader').toggle();
	$('#btnconfirmcde').prop('disabled',true);
	dbcommande.insertCde(cde,function() {
        $.ajax({
            url: "http://"+adresseServeur+"/UDC/ajaxAddCde.php",
	        crossDomain: true,
			async: false,
			dataType: 'json',
			type: "POST",
            data: {Cde: JSON.stringify(cde)},
            success:function (data) {
				madb.transaction(
					function(tx) {
						var sql = "update Commande set Etat='Synchro' where Ref='"+cde.Ref+"'";
						tx.executeSql(sql,[],function(tx,results){},function(tx,err){log('err ins mod '+err.code+' '+err.message);});
					},
					self.txErrorHandler,
					function(tx) {
					}
				);
				log('La commande à été synchronisée');
            },
            error: function(request, model, response) {
				log(request.responseText + " " +model + " " + response);
            }
        }).done(function(){
			$('.loader').toggle();
			$('#btnconfirmcde').prop('disabled',false);
			Go('Main');
		});
	});
}
function ViderCommandes() {
	var sql="delete from Commande";
	var Req1=new Requete();
	var Req2=new Requete();
	var Req3=new Requete();
	Req1.exec(sql, function() {
		sql="delete from DetCde";
		Req2.exec(sql, function() {
			sql="delete from elDetCde";
			Req3.exec(sql, function() {
				showAlert('Tables vidées');
			});
		});
	});
}
function HistoCmd() {
	InitRech('LesBonsDeCommande');
}
function DetailBon(refcde) {
	alert(refcde);
	RecapCde();
}