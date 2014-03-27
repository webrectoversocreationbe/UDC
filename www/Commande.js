var cde={};
var cdeModele={};
var r=''; // contient le récap
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
	
	$('#tfspecial1').val('');
	$('#tfspecial2').val('');
	$('#fspecial1').val('');
	$('#fspecial2').val('');
	$('#chkRepr').attr('checked',false);
	$('#chkEtage1').attr('checked',false);
	$('#chkEtage3').attr('checked',false);
	$('#chkEtage8').attr('checked',false);
}
function VideEcranCdeMod() {
	$('#cdemoduc').html('');
	$('#cdecuiruc').html('');
	$('#cdecolouc').html('');
	$('#cdeopfr').html('');
	$('#Delai').val('');
	$('#DelaiMax').val('');
	$('#cdetLesElems').empty();
	$('#cdeRemMod').html('<span id="cdeRemModCtn"></span>');
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
/*		if ($('#fracoui').is(':checked')==true && $('#NbFrac').val()=='') {
			showAlert('Vous devez entrer le nombre de fractionnement','Attention','OK'); return false;
		}
		if ($('#Societ').is(':checked')==true && $('#Societe').val()=='') {
			showAlert('Le nom de la société est obligatoire','Attention','OK'); return false;
		}
		if ($('#Nom1').val()=='' || $('#Prenom1').val()=='') {
			showAlert('Le prénom et le nom est obligatoire','Attention','OK'); return false;
		}
		if ($('#CP').val()=='') {
			showAlert('Le code postal est obligatoire','Attention','OK'); return false;
		}
		if ($('#Ville').val()=='') {
			showAlert('L\'adresse est obligatoire','Attention','OK'); return false;
		}
		if ($('#Tel1').val()=='') {
			showAlert('Le téléphone est obligatoire'); return false;
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
		if ($('#cdemoduc').html()=='') {
			showAlert('Il faut choisir un modèle','Attention','OK'); return false;
		}
		if ($('#cdecuiruc').html()=='') {
			showAlert('Il faut choisir un revêtement','Attention','OK'); return false;
		}
		if ($('#Delai').val()=='') {
			showAlert('Il faut préciser le délai','Attention','OK'); return false;
		}
		if ($('#DelaiMax').val()=='') {
			showAlert('Il faut préciser le délai 2','Attention','OK'); return false;
		}
		if ($('#cdetLesElems tr').length==0) {
			showAlert('Il faut définir les élements','Attention','OK'); return false;
		}
		if (cdeModele.bCouleur==1 && $('#cdecolouc').html()=='') {
			showAlert('Il faut choisir une couleur','Attention','OK'); return false;
		}
		if (cdeModele.bOptions==1 && $('#cdeopfr').html()=='') {
			showAlert('Il faut choisir une option','Attention','OK'); return false;
		}
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
			cde.DetailCommande[cptmod].MODELAI=$('#Delai').val();
			cde.DetailCommande[cptmod].DelaiMax=$('#DelaiMax').val();
			if ($('#GenreASAP').is(':checked')==true) {cde.DetailCommande[cptmod].GenreDelai='ASAP';} else {cde.DetailCommande[cptmod].GenreDelai='Normal';}
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
			$('#cdePT').val(FormatNombre(cde.TotalTarif,2,''));
			$('#cdePVTOT').val(FormatNombre(cde.TotalTarif,2,''));
//			cde.PrixVente=parseFloat($('#cdePV').val().replace(',','.')) || 0;
//			if (cde.AfficherPrix==0) {
				cde.PrixVente=parseFloat($('#cdePT').val().replace(',','.')) || 0;
//			}
		// ECRAN SUIV
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 3: // Ecran ajouter un modèle ?
		break;
	case 4: // Prix de vente + Remise + Rachat
		if ($('#cdePT').val()=='') {
			showAlert('Il faut préciser le prix total au tarif','Attention','OK'); return false;
		}
		if ($('#cdeFCLIB').val()!='' && $('#cdeFC').val()=='') {
			showAlert('Il faut préciser le montant des frais complémentaires','Attention','OK'); return false;
		}
		if ($('#chkfinoui').is(':checked')==true && $('#MontantFin').val()=='') {
			showAlert('Il faut préciser le montant du financement','Attention','OK'); return false;
		}
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
		if ($('#cdesoldeacompte').val()!='' && $('#cdeacomptedate').val()=='') {
			showAlert('Il faut préciser la date du solde de l\'acompte','Attention','OK'); return false;
		}
		// si cde pas fractionnée et tvac>3000 => acompte max 10%
		var pvtvac=parseFloat($('#cdePVTOT').val().replace(',','.')) || 0;
		if (cde.Fractionner==0 && pvtvac>3000) {
			var acesp=parseFloat($('#cdeacompteespece').val().replace(',','.')) || 0;
			if (acesp>(pvtvac/10)) {
				var maxespece=Nombre(Math.floor(pvtvac/10));
				showAlert('L\'acompte en espèce ne peut dépasser '+maxespece+' €','Attention','OK'); return false;
			}
		}
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
		cde.TotalTVAC=parseFloat($('#cdePVTOT').val().replace(',','.')) || 0;
		
		$('#Ecran'+EcranActif).removeClass('current2');
		EcranActif+=1;
		$('#Ecran'+EcranActif).addClass('current2');
		break;
	case 6: // frais complémentaires sous traitant
		if ($('#fspecial1').val()!='' && $('#tfspecial1').val()=='') {
			showAlert('Il faut préciser le type de frais','Attention','OK'); return false;
		}
		if ($('#fspecial2').val()!='' && $('#tfspecial2').val()=='') {
			showAlert('Il faut préciser le type de frais','Attention','OK'); return false;
		}
		cde.FCRepr=$('#chkRepr').is(':checked')==true?75:0;
		cde.FCEtage1=$('#chkEtage1').is(':checked')==true?90:0;
		cde.FCEtage3=$('#chkEtage3').is(':checked')==true?120:0;
		cde.FCEtage8=$('#chkEtage8').is(':checked')==true?200:0;
		cde.FCSpecial1=parseFloat($('#fspecial1').val().replace(',','.')) || 0;
		cde.FCSpecial2=parseFloat($('#fspecial2').val().replace(',','.')) || 0;
		cde.FCTSpecial1=$('#tfspecial1').val();
		cde.FCTSpecial2=$('#tfspecial2').val();
		r='';
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
		break
	case 7: // RECAP
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
	case 8: // SIGNATURES
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
			$('#DelaiMax').val(cdeModele.MODELAI+2);
        } else {
            $('#cdemoduc').html('<p>Modèle innexistant</p>');
			$('#Delai').val('');
			$('#DelaiMax').val('');
        }
    });
}
function DefMod(Quoi) {
	switch(Quoi) {
		case 'cdeModeles':
		case 'cdeCouleur':
		case 'cdeOption':
			InitRech(Quoi);
			break;
		case 'cdeTypeCuir':
			$('#cdeRechCouleur').attr('disabled',true);
			$('#cdeRechOptions').attr('disabled',true);
			$('#ajelem').attr('disabled',true);
			$('#supprelem').attr('disabled',true);
			InitRech(Quoi);
			break;
		case 'ModelePerso':
			if (InputModPerso()==true) {
			} else {
				$('#cdemoduc,#cdecuiruc,#cdecolouc,#cdeopfr').html('');
				$('#Delai,#DelaiMax').val('');
			}
			break;
	}
}
function InputModPerso() {
	var MODNR='',MODUC='',CUIRNR='',CUIRUC='',COLORNR='',COLOUC='',OPCODE='',OPFR='',MODELAI=0,DelaiMax=0;
	var titre='Modèle personnalisé';
	showPrompt('Code du modèle',titre,'888888',function(results) {
		if (results.buttonIndex==1) {
			MODNR=results.input1
			showPrompt('Nom du modèle',titre,'',function(results) {
				if (results.buttonIndex==1) {
					MODUC=results.input1!=''?results.input1:'Sans nom';
					$('#cdemoduc').html(MODNR+' - '+MODUC);
					showPrompt('Code du revêtement',titre,'888888',function(results) {
						if (results.buttonIndex==1) {
							CUIRNR=results.input1
							showPrompt('Nom du revêtement',titre,'',function(results) {
								if (results.buttonIndex==1) {
									CUIRUC=results.input1!=''?results.input1:'Sans nom';
									$('#cdecuiruc').html(CUIRNR+' - '+CUIRUC);
									showPrompt('Code de la couleur',titre,'888888',function(results) {
										if (results.buttonIndex==1) {
											COLORNR=results.input1
											showPrompt('Nom de la couleur',titre,'',function(results) {
												if (results.buttonIndex==1) {
													COLOUC=results.input1!=''?results.input1:'Sans nom';
													$('#cdecolouc').html(COLORNR+' - '+COLOUC);
													showPrompt('Code de l\'option',titre,'888888',function(results) {
														if (results.buttonIndex==1) {
															OPCODE=results.input1
															showPrompt('Nom de l\'option',titre,'',function(results) {
																if (results.buttonIndex==1) {
																	OPFR=results.input1!=''?results.input1:'Sans nom';
																	$('#cdeopfr').html(OPCODE+' - '+OPFR);
																	showPrompt('Délai minimum',titre,'',function(results) {
																		if (results.buttonIndex==1) {
																			MODELAI=results.input1!=''?results.input1:10;
																			$('#Delai').val(MODELAI);
																			showPrompt('Délai maximum',titre,'',function(results) {
																				if (results.buttonIndex==1) {
																					DelaiMax=results.input1!=''?results.input1:12;
																					$('#DelaiMax').val(DelaiMax);
																					cdeModele.Existe=false;
																					cdeModele.Perso=true;
																					cdeModele.MODNR=MODNR;
																					cdeModele.MODUC=MODUC;
																					cdeModele.CUIRNR=CUIRNR;
																					cdeModele.CUIRUC=CUIRUC;
																					cdeModele.COULNR=COULNR;
																					cdeModele.COLOUC=COLOUC;
																					cdeModele.OPCODE=OPCODE;
																					cdeModele.OPFR=OPFR;
																					cdeModele.MODELAI=MODELAI;
																					cdeModele.DelaiMax=DelaiMax;
																					cdeModele.MOCOEF=1;
																					cdeModele.MOCOEF2=1;
																					return true;
																				} else {
																					return false;
																				}
																			});
																		} else {
																			return false;
																		}
																	});
																} else {
																	return false;
																}
															});
														} else {
															return false;
														}
													});
												} else {
													return false;
												}
											});
										} else {
											return false;
										}
									});
								} else {
									return false;
								}
							});
						} else {
							return false;
						}
					});
				} else {
					return false;
				}
			});
		} else {
			return false;
		}
	});
}
function AjouteElemPerso() {
	var ELCODE='',ELFR='',Qte=0,Prix=0;
	var titre='Elément personnalisé';
	showPrompt('Code de l\'élément',titre,'8888888',function(results) {
		if (results.buttonIndex==1) {
			ELCODE=results.input1
			showPrompt('Nom de l\'élément',titre,'',function(results) {
				if (results.buttonIndex==1) {
					ELFR=results.input1!=''?results.input1:'Sans nom';
					showPrompt('Quantité d\'éléments',titre,'',function(results) {
						if (results.buttonIndex==1) {
							Qte=results.input1!=''?results.input1:1;
							showPrompt('Prix de l\'élément',titre,'',function(results) {
								if (results.buttonIndex==1) {
									Prix=results.input1!=''?results.input1:0;
									return true;
								} else {
									return false;
								}
							});
						} else {
							return false;
						}
					});
				} else {
					return false;
				}
			});
		} else {
			return false;
		}
	});
}
function RechCP() {
	InitRech('CP');
}
function ActuFraisCompl() {
	var tot=0;
	var chkRepr=$('#chkRepr').is(':checked')==true?75:0;
	var chkEtage1=$('#chkEtage1').is(':checked')==true?90:0;
	var chkEtage3=$('#chkEtage3').is(':checked')==true?120:0;
	var chkEtage8=$('#chkEtage8').is(':checked')==true?200:0;
	var fspecial1=parseFloat($('#fspecial1').val().replace(',','.')) || 0;
	var fspecial2=parseFloat($('#fspecial2').val().replace(',','.')) || 0;
	tot=(chkRepr+chkEtage1+chkEtage3+chkEtage8+fspecial1+fspecial2);
	$('#fctotal').html(Nombre(tot)+' €');
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
//	var PT=cde.AfficherPrix==1?$('#cdePV').val():$('#cdePT').val();
	var PT=$('#cdePT').val();
	var Rem=$('#cdeRem').val();
	var Rachat=$('#cdeRachat').val();
	var FC=$('#cdeFC').val();
	var pvtot=parseFloat(PT.replace(' ','').replace(',','.')) || 0;
	if (Rem!='') {pvtot=pvtot-Rem;}
	if (Rachat!='') {pvtot=pvtot-Rachat;}
	if (FC!='') {pvtot=pvtot+parseFloat(FC);}
	//if (cde.Exoneration==0) {pvtvac=pvtot*1.21;} else {pvtvac=pvtot;}
	var pvtvac=pvtot;
	var ac20=pvtvac*0.20;
	$('#cdePVTOT').val(Nombre(pvtot))
	$('#cdePVTOTTVAC').val(Nombre(pvtvac));
	$('#labcdePVTOTTVAC').html(Nombre(pvtvac)+' €');
	$('#acompte20').html(Nombre(ac20)+' €');
}
function NePasAfficherPrix() {
	cde.AfficherPrix=0;
}
function RecapCde() {
	r='<p>Date : <span class="mev">'+cde.DateC+'</span></p>'
	+'<p>Commande : <span class="mev">'+cde.Ref+'</span></p>'
	+'<p>Vendeur : <span class="mev">'+cde.Vendeur+'</span></p>'
	+'<hr/>';
	if (cde.Societe!='') {
		r=r+'<p>Société : <span class="mev">'+cde.Societe+'</span></p>'
		+'<p>Responsable : <span class="mev">'+cde.Civil0+' '+cde.Responsable+'</span></p>'
	} else {
		r=r+'<p><span class="mev">';
		r=r+'Client : <br/>';
		r=r+cde.Civil1+' '+cde.Prenom1+' '+cde.Nom1
		if(cde.Prenom2!='') {
			r=r+'<br/>'+cde.Civil2+' '+cde.Prenom2+' '+cde.Nom2;
		}
		r=r+'</span></p>';
	}
	if(cde.Adresse!='') {r=r+'<p>Adresse : <br/><span class="mev">'+cde.Adresse+'</span></p>';}
	if(cde.CP!='') {r=r+'<p><span class="mev">'+cde.CP+' '+cde.Ville+'</span></p>';}
	if(cde.Tel1!='') {r=r+'<p>Téléphone : <span class="mev">'+cde.Tel1+'</span></p>';}
	if(cde.Tel2!='') {r=r+'<p>Téléphone : <span class="mev">'+cde.Tel2+'</span></p>';}
	if(cde.Gsm1!='') {r=r+'<p>Gsm : <span class="mev">'+cde.Gsm1+'</span></p>';}
	if(cde.Gsm2!='') {r=r+'<p>Gsm : <span class="mev">'+cde.Gsm2+'</span></p>';}
	if(cde.Email!='') {r=r+'<p>Email : <span class="mev">'+cde.Email+'</span></p>';}
	if(cde.Remarque!='') {r=r+'<p>Remarque : <br/><span class="mev">'+cde.Remarque+'</span></p>';}
	var nbmod=cde.DetailCommande.length;
	for(cptm=0;cptm<nbmod;cptm++) {
		r=r+'<hr/>';
		r=r+'<br/><p><u>Modèle</u> : <br/><span class="mev">'+cde.DetailCommande[cptm].MODNR+' - '+cde.DetailCommande[cptm].MODUC+'</span></p>';
		if (cde.DetailCommande[cptm].CUIRUC!='') {r=r+'<p>Revêtement : <span class="mev">'+cde.DetailCommande[cptm].CUIRUC+'</span></p>';}
		if (cde.DetailCommande[cptm].COLOUC!='') {r=r+'<p>Couleur : <span class="mev">'+cde.DetailCommande[cptm].COLOUC+'</span></p>';}
		if (cde.DetailCommande[cptm].OPFR!='') {r=r+'<p>Option : <span class="mev">'+cde.DetailCommande[cptm].OPFR+'</span></p>';}
		if (cde.DetailCommande[cptm].MODELAI!='') {r=r+'<p>Délai : <span class="mev">'+cde.DetailCommande[cptm].MODELAI+' à '+cde.DetailCommande[cptm].DelaiMax+' semaines - '+cde.DetailCommande[cptm].GenreDelai+'</span></p>';}
		var nbelem=cde.DetailCommande[cptm].Elements.length;
		for(cpte=0;cpte<nbelem;cpte++) {
			var descelem=cde.DetailCommande[cptm].Elements[cpte].ELFR;
			var Qte=cde.DetailCommande[cptm].Elements[cpte].Qte;
			var Px=cde.DetailCommande[cptm].Elements[cpte].Prix;
			if (Qte>0) {
				r=r+'<p class="ML15">- <span class="mev">'+descelem+' : '+Qte;
				if (cde.AfficherPrix==1) {r=r+' = '+Nombre(Qte*Px)+' €';}
				r=r+'</span></p>';
			}
		}
	}
	r=r+'<hr/>';
	r=r+'<br/><p><u>Total</u> : </p>';
	r=r+'<p>Prix de vente : <span class="mev">'+Nombre(cde.PrixVente)+' €</span></p>';
	if(cde.Remise>0) {r=r+'<p>Remise : <span class="mev">'+Nombre(cde.Remise)+' €</span></p>';}
	if(cde.Reprise>0) {r=r+'<p>Rachat : <span class="mev">'+Nombre(cde.Reprise)+' €</span></p>';}
	if(cde.Frais>0) {r=r+'<p>Frais complémentaires : <span class="mev">'+Nombre(cde.Frais)+' €</span></p>';}
	r=r+'<p>Prix TVAC : <span class="mev">'+Nombre(cde.TotalTVAC)+' €</span></p>';
	r=r+'<br/><p><u>Acompte payé ce jour</u> : <span class="mev">'+Nombre(cde.Acompte)+' €</span></p>';
	if(cde.AcompteCarte>0) {r=r+'<p>Carte : <span class="mev">'+Nombre(cde.AcompteCarte)+' €</span></p>';}
	if(cde.AcompteEspece>0) {r=r+'<p>Espèce : <span class="mev">'+Nombre(cde.AcompteEspece)+' €</span></p>';}
	if(cde.AcompteCheque>0) {r=r+'<p>Chèque : <span class="mev">'+Nombre(cde.AcompteCheque)+' €</span></p>';}
	if(cde.AcompteAutre>0) {r=r+'<p>Autre : <span class="mev">'+Nombre(cde.AcompteAutre)+' €</span></p>';}
	if(cde.SoldeAcompte>0) {r=r+'<p>Solde acompte : <span class="mev">'+Nombre(cde.SoldeAcompte)+' €</span></p>';}
	if(cde.DateA!='') {r=r+'<p>A payer pour le : <span class="mev">'+cde.DateA+'</span></p>';}
	if(cde.MontantFinancement>0) {r=r+'<br/><p>Financement : <span class="mev">'+cde.MontantFinancement+' €</span></p>';}
	var tot=0;
	var chkRepr=$('#chkRepr').is(':checked')==true?75:0;
	var chkEtage1=$('#chkEtage1').is(':checked')==true?90:0;
	var chkEtage3=$('#chkEtage3').is(':checked')==true?120:0;
	var chkEtage8=$('#chkEtage8').is(':checked')==true?200:0;
	var fspecial1=parseFloat($('#fspecial1').val().replace(',','.')) || 0;
	var fspecial2=parseFloat($('#fspecial2').val().replace(',','.')) || 0;
	tot=(chkRepr+chkEtage1+chkEtage3+chkEtage8+fspecial1+fspecial2);
	if (tot>0) {
		r=r+'<hr/><br/><p><u>Frais complémentaires sous-traitant</u></p>';
		if(cde.FCRepr>0) {r=r+'<p>Reprise ancien salon : <span class="mev">'+Nombre(cde.FCRepr)+' €</span></p>';}
		if(cde.FCEtage1>0) {r=r+'<p>Livraison par lift étage 1 ou 2 : <span class="mev">'+Nombre(cde.FCEtage1)+' €</span></p>';}
		if(cde.FCEtage3>0) {r=r+'<p>Livraison par lift étage 3 à 8 : <span class="mev">'+Nombre(cde.FCEtage3)+' €</span></p>';}
		if(cde.FCEtage8>0) {r=r+'<p>Livraison par lift étage 8 ou plus : <span class="mev">'+Nombre(cde.FCEtage8)+' €</span></p>';}
		if(cde.FCSpecial1>0) {r=r+'<p>'+cde.FCTSpecial1+' : <span class="mev">'+Nombre(cde.FCSpecial1)+' €</span></p>';}
		if(cde.FCSpecial2>0) {r=r+'<p>'+cde.FCTSpecial2+' : <span class="mev">'+Nombre(cde.FCSpecial2)+' €</span></p>';}
		r=r+'<br/><p><u>Total à payer à la livraison</u> : <span class="mev">'+Nombre(tot)+' €</span></p>';
	}
	cde.Recap=r;
	$('#RecapCde').html(r);
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
			dbu.logout();
			Go('Connexion');
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
	dbcommande.DetailBon(refcde,function(r) {
		$('#historecap').html(r);
		Go('BonCommande');
	});
}