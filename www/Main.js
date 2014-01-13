var debug=false;
var bConnected=false;   // SI INTERNET (Wifi, 3G, Etc)
var bAdmin=false;       // SI l'utilisateur est administrateur
var User='';            // Utilisateur loggué
var UserVersion=2;      // Version du pgm en fonction de l'utilisateur

var app = {
    initialize: function() {
        this.bindEvents();
        app.receivedEvent('deviceready');
    },
    bindEvents: function() {
        document.addEventListener('offline', this.onOffline, false);
        document.addEventListener('online', this.onOnline, false);
		document.addEventListener("menubutton", this.onMenuKeyDown, false);
	},
    onDeviceReady: function() {
		$.mobile.allowCrossDomainPages = true;
		$.support.cors = true;
		app.receivedEvent('deviceready');
    },
    onOffline: function() {
        app.receivedEvent('offline');
    },
    onOnline: function() {
        app.receivedEvent('online');
    },
	onMenuKeyDown: function() {
		showAlert('Menu','Menu','OK');
	},
    receivedEvent: function(id) {
		switch(id) {
		case 'deviceready':
			log('deviceready');
			check_network();
			break;
		case 'offline':
			log('offline');
			check_network();
//			$('#sync').attr('enabled',false);
			break;
		case 'online':
			log('online');
			check_network();
//			$('#sync').attr('enabled',true);
			break;
		}
    }
};
var fs;
document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	app.initialize();
}
$(document).ready(function() {
	InitDB();
	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
	try {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, failFS);
	} catch(e) {
		alert('Erreur filesystem');
		log(e);
	}
});
function gotFS(fileSystem) {
	fs=fileSystem;
	log('FileSystem opérationnel');
//	fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
	var fileTransfer = new FileTransfer();
	log('FileTransfer opérationnel');
	fileTransfer.download(
		encodeURI("http://192.168.0.248/UDC/ServeurDistant/Photos/350/350003.jpg"),
		fs.root.fullPath + "/350003.jpg",
		function(entry) {
			log("download complete: " + entry.fullPath);
		},
		function(error) {
			log("download error source " + error.source);
			log("download error target " + error.target);
			log("upload error code" + error.code);
		}
	);
}
function failFS(error) {
	log('fserror '+error.target.error.code);
}
    function gotFileEntry(fileEntry) {
        fileEntry.createWriter(gotFileWriter, fail);
    }

    function gotFileWriter(writer) {
        writer.onwriteend = function(evt) {
            log("contents of file now 'some sample text'");
            writer.truncate(11);  
            writer.onwriteend = function(evt) {
                log("contents of file now 'some sample'");
                writer.seek(4);
                writer.write(" different text");
                writer.onwriteend = function(evt){
                    log("contents of file now 'some different text'");
                }
            };
        };
        writer.write("some sample text");
    }
    function fail(error) {
        log(error.code);
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
function downloadFile() {
/*		"http://192.168.0.248/UDC/ServeurDistant/Photos/450/450002.jpg",
*/

	log('fct dowl');
		alert('ft');
	var ft = new FileTransfer();
		alert('ft cree');
	ft.download(
		encodeURI("http://www.universducuir.be/Accueil/ImgSlide/10-canapes-cuir-bicolore-blanc-et-noir-pas-cher.jpg"),
		"file:///storage/emulated/0/Download/450002.jpg",
		function(theFile) {
	alert('la');
			log("download complete: " + theFile.toURI());
		},
		function(error) {
	alert('erreur');
			log("download error source " + error.source);
			log("download error target " + error.target);
			log("upload error code: " + error.code);
		}
	);
	alert('ici');
	log('finonfilesucc');
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