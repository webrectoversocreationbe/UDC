var debug=false;
var bConnected=false;   // SI INTERNET (Wifi, 3G, Etc)
var bAdmin=false;       // SI l'utilisateur est administrateur
var User='';            // Utilisateur loggué
var UserVersion=2;      // Version du pgm en fonction de l'utilisateur

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
		Vibre(2500);
		Sonne(3);
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
});

function onDeviceReady() {
	// initialisation de l'application
	app.initialize();
	app.receivedEvent('deviceready');
	// initialisation du filesystem
	InitFS(function() {
		// initialisation du filetransfer
		InitFT(function() {
			// initialisation de la DB
			InitDB(function() {
				log('Base de données initialisée');
			});
		});
	});
}
function CloseApp() {
	if(navigator.app) {navigator.app.exitApp();} else if (navigator.device) {navigator.device.exitApp();}
}

function Go(Ou) {
	switch(Ou) {
	case 'SQL':
		$('.Panneau').removeClass('current');
		$('#SQL').addClass('current');
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
function check_network() {
	log('Test de connectivité');
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
		bConnected=false;
		$('#cnType').removeClass('vert');
		$('#cnType').addClass('rouge');
	} else {
		bConnected=true;
		$('#cnType').removeClass('rouge');
		$('#cnType').addClass('vert');
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
function Vibre(temps) {
	navigator.notification.vibrate(temps)
}
function Sonne(nb) {
	navigator.notification.beep(nb);
}
function ShowProduits() {
	$.ajax({
		type: "POST",
		url: "http://www.candicar.eu/Prod/ajaxPhoneGap.php",
        crossDomain: true,
		dataType: "html",
		success: function(response) {
			$('#Produits').html(response);
		},
		error: function() {
			$('#Produits').append('Une erreur est survenue');
		}
	});	
}