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
});

function onDeviceReady() {
	// initialisation de l'application
	app.initialize();
	app.receivedEvent('deviceready');
	InitAll();
}
function InitAll() {
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
	} else {
		log('Test de connectivité - '+states[networkState]);
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
function DoPDF() {
	var doc = new jsPDF();
	doc.setFontSize(20);
	doc.text(35, 25, "Hello world");
	var pdfOutput = doc.output();
	fs.root.getFile("ici.pdf", {create: true}, function(entry) {
		var fileEntry = entry;
		entry.createWriter(function(writer) {
			writer.onwrite = function(evt) {
				log("write success"+fs.root.fullPath);
				Dropbox.save(fs.root.fullPath+"/ici.pdf");
				log('droped');
			};
			writer.write( pdfOutput );
		}, function(error) {
			log(error);
		});
		}, function(error){
			log(error);
	});
}
