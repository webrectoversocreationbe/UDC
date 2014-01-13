var trfModele={}
function InitTarif() {
	log('Init tarif');
}
function trfInfoModele() {
    trfModele=new Modele();
    trfModele.init($('#ValRech').val(), function() {
        if (trfModele.Existe==true) {
            dump(trfModele,'log');
            var ret='<h2>'+trfModele.MODNR+' - '+trfModele.MOUC+'</h2><p>Délai : '+trfModele.MODELAI+' semaines</p>';
            var l=trfModele.Elements.length;
            $('#LesElems').html('');
            for(cpt=0;cpt<l;cpt++) {
                var el='<tr><td>'+trfModele.Elements[cpt].ELCODE+'</td><td>'+trfModele.Elements[cpt].ELFR+'</td><td align="right" id="trfpx'+trfModele.Elements[cpt].ELCODE+'"></td></tr>';
                $('#LesElems').append(el);
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
