var trfModele={}
function InitTarif() {
	$('#trfResult').html('');
	$('#trfTLesElems').html('');
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
        } else {
            $('#trfResult').html('<p>Modèle innexistant</p>');
        }
    });
}
