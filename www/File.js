var fs;                 // FileSystem (accès disques)
var ft;                 // FileTransfer (download/upload fichiers);

var objfs={
	init: function(callback) {
		var self=this;
		log('Initialisation système de fichiers');
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		try {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
				function(filesystem) {log('FileSystem opérationnel'); fs=filesystem; callback();}, 
				function(error) {log('fserror '+error.target.error.code); callback();}
			);
		} catch(e) {
			log('Erreur init filesystem' + e);
		}
	}
}

function InitFS(callback) {
	objfs.init(callback);
}

function InitFT(callback) {
	ft = new FileTransfer();
	log('FileTransfer opérationnel');
	callback();
/*	ft.download(
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
	);*/
}
function SynchroImg() {
	$.ajax({
		type: "POST",
		url: "http://192.168.0.248/UDC/SynchroImgVersTablettes.php",
        crossDomain: true,
		dataType: "json",
		success: function(response) {
			var l = response.length;
			var e;
			for (var i = 0; i < l; i++) {
				e = response[i];
				log(e);
			}
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
