var trfModele={}
var trfScroll;
function InitTarif() {
	$('#trfResult').html('');
	$('#trfTLesElems').html('');
	$('#trfscroller ul').empty();
}
function trfInfoModele() {
    trfModele=new Modele();
    trfModele.init($('#ValRech').val(), function() {
        if (trfModele.Existe==true) {
            var ret='<h2>'+trfModele.MODNR+' - '+trfModele.MOUC+'</h2><p>Délai : '+trfModele.MODELAI+' semaines</p>';
            var l=trfModele.Elements.length;
            $('#trfTLesElems').html('');
            for(cpt=0;cpt<l;cpt++) {
                var el='<tr><td>'+trfModele.Elements[cpt].ELCODE+'</td><td>'+trfModele.Elements[cpt].ELFR+'</td><td align="right" id="trfpx'+trfModele.Elements[cpt].ELCODE+'"></td></tr>';
                $('#trfTLesElems').append(el);
            }
            ret=ret+'<p id="infotypcuir"></p>';
            ret=ret+'<p id="infocouleur"></p>';
            ret=ret+'<p id="infooption"></p>';
            $('#trfResult').html(ret);
			// Images...
			$('#trfscroller ul').empty();
			var Fichier='';
			Fichier=fs.root.fullPath + "/UDC/"+trfModele.MODNR+'.jpg';
			CheckIfFileExists(Fichier, 
				function() {
					log('existe');
					$('#trfscroller ul').append('<li><img src="file:///storage/emulated/0/UDC/'+trfModele.MODNR+'.jpg"></li>');
					trfScroll = new IScroll('#trfwrapperimg', { scrollX: true, scrollY: false, mouseWheel: true });
					},
				function() {}
			);
			Fichier=fs.root.fullPath + "/UDC/"+trfModele.MODNR+'A.jpg';
			CheckIfFileExists(Fichier, 
				function() {
					log('existe A');
					$('#trfscroller ul').append('<li><img src="file:///storage/emulated/0/UDC/'+trfModele.MODNR+'A.jpg"></li>');
					trfScroll = new IScroll('#trfwrapperimg', { scrollX: true, scrollY: false, mouseWheel: true });
					},
				function() {}
			);
        } else {
            $('#trfResult').html('<p>Modèle innexistant</p>');
        }
    });
}
