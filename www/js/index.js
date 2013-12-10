var bConnected=false;
var app = {
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener('offline', this.onOffline, false);
        document.addEventListener('online', this.onOnline, false);
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
    receivedEvent: function(id) {
		switch(id) {
		case 'deviceready':
			check_network();
			break;
		case 'offline':
			check_network();
			$('#sync').attr('enabled',false);
			break;
		case 'online':
			check_network();
			$('#sync').attr('enabled',true);
			break;
		}
    }
};
app.initialize();
function CloseApp() {
	if(navigator.app) {navigator.app.exitApp();} else if (navigator.device) {navigator.device.exitApp();}
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
		bConnected=false;
		$('#cnType').removeClass('vert');
		$('#cnType').addClass('rouge');
	} else {
		bConnected=true;
		$('#cnType').removeClass('rouge');
		$('#cnType').addClass('vert');
	}
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