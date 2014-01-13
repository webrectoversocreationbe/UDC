var fs;                 // FileSystem (accès disques)
var ft;                 // FileTransfer (download/upload fichiers);

var gfs={
	init: function(callback) {
		var self=this;
		log('Initialisation système de fichiers');
		window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
		try {
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, self.gotFS(filesystem,callback), self.failFS(error,callback));
		} catch(e) {
			log('Erreur init filesystem' + e);
		}
	},
	gotFS: function(fileSystem,callback) {
		fs=fileSystem;
		log('FileSystem opérationnel');
		callback();
	},
	failFS: function(error,callback) {
		log('fserror '+error.target.error.code);
		callback();
	}
}

function InitFS(callback) {
	gfs.init(callback);
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
