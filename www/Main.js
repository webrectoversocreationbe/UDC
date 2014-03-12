var debug=false;
var bConnected=false;   // SI INTERNET (Wifi, 3G, Etc)
var bAdmin=false;       // SI l'utilisateur est administrateur
var User='';            // Utilisateur loggué
var UserVersion=2;      // Version du pgm en fonction de l'utilisateur
var adresseServeur='';  // 192.168.0.248
var Magasin='';         // Gosselies Bouge Waterloo
var BonDuNum=1;
var BonAuNum=1000;

var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('offline', this.onOffline, false);
        document.addEventListener('online', this.onOnline, false);
		document.addEventListener("menubutton", this.onMenuKeyDown, false);
	},
    onOffline: function() {
        app.receivedEvent('offline');
    },
    onOnline: function() {
        app.receivedEvent('online');
    },
	onMenuKeyDown: function() {
		Sonne(1);
		showAlert('Touche Menu appuyée','Menu contextuel','OK');
	},
    receivedEvent: function(id) {
		switch(id) {
		case 'deviceready':
			log('L\'application est prête');
			check_network();
			break;
		case 'offline':
			log('Offline');
			check_network();
			break;
		case 'online':
			log('Online');
			check_network();
			break;
		}
    }
};

$(document).ready(function() {
	document.addEventListener("deviceready", onDeviceReady, false);
	$('#sigPadSign1').signaturePad({drawOnly:true,bgColour:'#fff',lineColour:'#fff',penColor:'#e2001a',penWidth:3,canvas:'#canvassign1'});
	$('#sigPadCroquis').signaturePad({drawOnly:true,bgColour:'#fff',lineColour:'#fff',penColor:'#e2001a',penWidth:3,canvas:'#canvascroquis'});
	$(function(){$( ".DatePicker" ).datepicker({showOtherMonths: true,selectOtherMonths: true,dateFormat:'dd/mm/yy',monthNames: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],dayNamesMin: ['Di','Lu','Ma','Me','Je','Ve','Sa']});});
	$('.btnannulevente').click(function() {
		if (confirm('Voulez vous annuler ce bon de commande et revenir au menu principal ?')) {
			Go('Main');
		}
	});
});

function onDeviceReady() {
	// initialisation de l'application
	app.initialize();
	app.receivedEvent('deviceready');
	InitAll();
}
function InitAll() {
	TesteLaConnectivite(function(){
		// initialisation du filesystem
		InitFS(function() {
			// initialisation du filetransfer
			InitFT(function() {
				// initialisation de la DB
				InitDB(function() {
					log('Base de données initialisée');
					ParamsParDef();
				});
			});
		});
	});
}
function CloseApp() {
	if(navigator.app) {navigator.app.exitApp();} else if (navigator.device) {navigator.device.exitApp();}
}
function TesteLaConnectivite(callback) {
	// Connectivité obligatoire à l'init
	if (bConnected==false) {
		alert('Vous devez activer le WiFi pour continuer');
	}
	var bTest=true;
	// Adresse du serveur
	adresseServeur=getPref('AdresseServeur','');
	if (adresseServeur=='') {
		bTest=false;
		showPrompt('Adresse IP du serveur : ','Connectivité','192.168.0.248',function(results) {
			if (results.buttonIndex==1) {
				adresseServeur=results.input1
				setPref('AdresseServeur',adresseServeur);
				TesteLaConnectivite(callback);
			}
		});
	}
	$('#AdmAdresseServeur').val(adresseServeur);
	if (bTest==true) {
		// Accès au serveur ?
		$.ajax({
			url: "http://"+adresseServeur+"/UDC/ajaxTestConnexion.php",
			crossDomain: true,
			async: false,
			success: function(data) {
				log('Serveur : '+adresseServeur);
				log('Connexion au serveur réussie');
				callback();
			},
			error: function(xhr,err,errt) {
				adresseServeur='';
				setPref('AdresseServeur','');
				alert('Adresse incorrecte');
				TesteLaConnectivite(callback);
			}
		});
	}
}
function DefinirAdresseServeur(idAdrsServ) {
	setPref('AdresseServeur',$('#'+idAdrsServ).val());
	TesteLaConnectivite();
}
function ParamsParDef() {
	var bTest=true;
	// Magasin 
		log('0');
	Magasin=getPref('Magasin','');
	if (Magasin=='') {
		bTest=false;
		showConfirm('Magasin : ','Vous êtes dans quel',['Waterloo','Bouge','Gosselies'],function(results) {
			if (results==1) {
				setPref('Magasin','Gosselies');
				$('#mag1').prop('checked',true);
			}
			if (results==2) {
				setPref('Magasin','Bouge');
				$('#mag2').prop('checked',true);
			}
			if (results==3) {
				setPref('Magasin','Waterloo');
				$('#mag3').prop('checked',true);
			}
			ParamsParDef();
		});
	} else {
		log('1');
		switch(Magasin) {
			case 'Gosselies':document.getElementById('#mag1').selected=true;break;
			case 'Bouge':document.getElementById('#mag2').selected=true;break;
			case 'Waterloo':document.getElementById('#mag3').selected=true;break;
		}
		alert(Magasin+' '+document.getElementById('#mag2').selected);
	}
	BonDuNum=getPref('BonDuNum',1);
	BonAuNum=getPref('BonAuNum',1000);
	log(BonDuNum+' '+BonAuNum+' '+Magasin);
	$('#dunum').val(BonDuNum);
	$('#aunum').val(BonAuNum);
}
function DefinirMagasin(id) {
	switch(id) {
		case 1:setPref('Magasin','Gosselies');break;
		case 2:setPref('Magasin','Bouge');break;
		case 3:setPref('Magasin','Waterloo');break;
	}
}
function DefinirNumBon() {
	BonDuNum=$('#dunum').val();
	BonAuNum=$('#aunum').val();
	setPref('BonDuNum',BonDuNum);
	setPref('BonAuNum',BonAuNum);
}
function Go(Ou) {
	switch(Ou) {
	case 'SQL':
		$('.Panneau').removeClass('current');
		$('#SQL').addClass('current');
		break;
	case 'Administration':
		$('.Panneau').removeClass('current');
		$('#Administration').addClass('current');
		break;
	case 'Main':
		$('.Panneau').removeClass('current');
		$('#Main').addClass('current');
		break;
	case 'Tarif':
		InitTarif();
		$('.Panneau').removeClass('current');
		$('#Tarif').addClass('current');
		break;
	case 'Commande':
		InitCommande();
		$('.Panneau').removeClass('current');
		$('#Commande').addClass('current');
		break;
	}
}
function log(msg) {$('#log').prepend('<p>'+msg+'</p>');}
function getPref(cle, parDefaut){
    try{
        var R = window.localStorage.getItem(cle);
        if (R==null || R=='') {return parDefaut;} else {return R;}
    }catch(e){return parDefaut;}     
}
function setPref(cle, valeur){
    window.localStorage.setItem(cle, valeur);
}
function check_network() {
    var networkState = navigator.network.connection.type;
    var states = {};
    states[Connection.UNKNOWN]  = 'Inconnu';
    states[Connection.ETHERNET] = 'Ethernet';
    states[Connection.WIFI]     = 'WiFi';
    states[Connection.CELL_2G]  = '2G';
    states[Connection.CELL_3G]  = '3G';
    states[Connection.CELL_4G]  = '4G';
    states[Connection.NONE]     = 'Non connecté';
    $('#cnType').html(states[networkState]);
	if (states[networkState]=='Non connecté') {
		log('Test de connectivité - Non connecté');
		bConnected=false;
		$('#cnType').removeClass('vert');
		$('#cnType').addClass('rouge');
		$('.uniquementdeconnecte').css('display','block');
		$('.uniquementconnecte').css('display','none');
	} else {
		log('Test de connectivité - '+states[networkState]);
		bConnected=true;
		$('#cnType').removeClass('rouge');
		$('#cnType').addClass('vert');
		$('.uniquementdeconnecte').css('display','none');
		$('.uniquementconnecte').css('display','block');
	}
}
function alertDismissed() {}
function showAlert(Mes,Titre,Bouton) {
	navigator.notification.alert(
		Mes, 
		alertDismissed,
		Titre,
		Bouton
	);
}
function showConfirm(Mes,Titre,Bouton,callback) {
	navigator.notification.confirm(
		Mes, 
		callback,
		Titre,
		Bouton
	);
}
function showPrompt(Mes,Titre,MesParDef,callback) {
    navigator.notification.prompt(
        Mes,
        callback,
        Titre,
        ['Ok','Annuler'],
		MesParDef
    );
}
function Vibre(temps) {
	navigator.notification.vibrate(temps)
}
function Sonne(nb) {
	navigator.notification.beep(nb);
}