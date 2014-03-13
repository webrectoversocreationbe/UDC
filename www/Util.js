function FormatNombre(valeur,decimal,separateur) {
	var deci=Math.round( Math.pow(10,decimal)*(Math.abs(valeur)-Math.floor(Math.abs(valeur)))) ; 
	var val=Math.floor(Math.abs(valeur));
	if ((decimal==0)||(deci==Math.pow(10,decimal))) {val=Math.floor(Math.abs(valeur)); deci=0;}
	var val_format=val+"";
	var nb=val_format.length;
	for (var i=1;i<4;i++) {
		if (val>=Math.pow(10,(3*i))) {
			val_format=val_format.substring(0,nb-(3*i))+separateur+val_format.substring(nb-(3*i));
		}
	}
	if (decimal>0) {
		var decim=""; 
		for (var j=0;j<(decimal-deci.toString().length);j++) {decim+="0";}
		deci=decim+deci.toString();
		val_format=val_format+","+deci;
	}
	if (parseFloat(valeur)<0) {val_format="-"+val_format;}
	return val_format;
}
function Nombre(valeur) {
	return FormatNombre(valeur,2,"");
}
function NomMois(mois) {
	t=['','Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
	return t[mois];
}
function FormatDate(uneDate) {
	var t=uneDate.split('-');
	var aaaa=t[0], mm=t[1], dd=t[2];
	if (mm.length==1) {mm='0'+mm;}
	if (dd.length==1) {dd='0'+dd;}	if (dd.length==3) {dd=dd[1]+dd[2];}
	var ret=dd+'/'+mm+'/'+aaaa;
	return ret;
}
function FormatDateI(uneDate) {
	var t=uneDate.split('-');
	var aaaa=t[0], mm=t[1], dd=t[2];
	if (mm.length==1) {mm='0'+mm;}
	if (dd.length==1) {dd='0'+dd;}	if (dd.length==3) {dd=dd[1]+dd[2];}
	var ret=dd+'/'+mm+'/'+aaaa;
	return ret;
}
function repeatString(str, num) {out = ''; for (var i = 0; i < num; i++) {out += str;} return out;}
function dump(v, howDisplay, recursionLevel) {
    howDisplay = (typeof howDisplay === 'undefined') ? "alert" : howDisplay;
    recursionLevel = (typeof recursionLevel !== 'number') ? 0 : recursionLevel;
    var vType = typeof v; var out = vType;
    switch (vType) {
        case "number":
        case "boolean":
            out += ": " + v;
            break;
        case "string":
            out += "(" + v.length + '): "' + v + '"';
            break;
        case "object":
            if (v === null) {out = "null";}
            else if (Object.prototype.toString.call(v) === '[object Array]') {  
                out = 'array(' + v.length + '): {\n';
                for (var i = 0; i < v.length; i++) {
                    out += repeatString('   ', recursionLevel) + "   [" + i + "]:  " + 
                        dump(v[i], "none", recursionLevel + 1) + "\n";
                }
                out += repeatString('   ', recursionLevel) + "}";
            }
            else {
                sContents = "{\n";
                cnt = 0;
                for (var member in v) {
                    sContents += repeatString('   ', recursionLevel) + "   " + member +
                        ":  " + dump(v[member], "none", recursionLevel + 1) + "\n";
                    cnt++;
                }
                sContents += repeatString('   ', recursionLevel) + "}";
                out += "(" + cnt + "): " + sContents;
            }
            break;
    }
    if (howDisplay == 'body') {
        var pre = document.createElement('pre');
        pre.innerHTML = out;
        document.body.appendChild(pre)
    }
    else if (howDisplay == 'alert') {
        alert(out);
    } else {
		if ($('#'+howDisplay)) {
			$('#'+howDisplay).prepend('<pre>'+out+'</pre>');
		}
	}
    return out;
}
