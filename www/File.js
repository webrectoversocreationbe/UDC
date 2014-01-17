var fs;                 // FileSystem (accès disques)
var ft;                 // FileTransfer (download/upload fichiers);

var objfs={
	init: function(callback) {
		var self=this;
		log('Initialisation système de fichiers');
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		try {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
				function(filesystem) {log('FileSystem opérationnel'); fs=filesystem; self.createdir('UDC'); callback();}, 
				function(error) {log('fserror '+error.target.error.code); callback();}
			);
		} catch(e) {
			log('Erreur init filesystem' + e);
		}
	},
	createdir: function(Dossier) {
		fs.root.getDirectory(Dossier, {create: true, exclusive: false}, 
			function() {log('Dossier UDC ok');}, 
			function() {log('erreur dossier');}
		);
	}
}

function InitFS(callback) {
	objfs.init(callback);
}

function InitFT(callback) {
	ft = new FileTransfer();
	log('FileTransfer opérationnel');
	callback();
}

function FileExist(Fichier) {
}

function DownloadFile(Url,FileName) {
	ft.download(
		encodeURI(Url),
		fs.root.fullPath + "/UDC/"+FileName,
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
function SynchroImg() {
	$.ajax({
		type: "POST",
		url: "http://192.168.0.248/UDC/SynchroImgVersTablettes.php",
        crossDomain: true,
		dataType: "json",
		success: function(response) {
			$('#admloaderimg').css('display','inline');
			var l = response.length;
			var e;
			for (var i = 0; i < l; i++) {
				(function test(response,i,l) {
				e = response[i];
				var tfile=e.split('/');
				var filen=tfile[3];
				DownloadFile("http://192.168.0.248/UDC/"+e,filen);
				$('#nbimg').html(i+'/'+l);
				})(response,i,l);
			}
			$('#nbimg').html('');
			$('#admloaderimg').css('display','none');
			showAlert('Terminée','Synchronisation','OK');
		},
		error: function() {
			showAlert('Une erreur est survenue','Attention','OK');
		}
	});	
}
// créer un fichier
	//	fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
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
