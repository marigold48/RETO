vgComun = {
	hSesion : '',
	triggerPostValidaSesion : '',
	stackModal : new Array(),
	pathCGIs : '/cgi-bin/Kernel0/',
	qryMongo : 'k0GetMongoDB.cgi',
	qySQLite : 'k0GetQryLite.cgi',
	qyOracle : 'k0GetQryORCL.cgi',
	cgiGraba : 'k0GrabaFich.cgi',
	dbaseUsr : '',
	pathApp  : '',
	divBase  : 'divBase'
}
//------------------------------------------------------------------ Comprobacion de null,undefined,0,'',false,NaN
function guay(expr){
   return (typeof expr != 'undefined' && expr)? true : false;
};

function goPag(url){
	window.location = url + '?id=' + vgComun.hSesion.get('id0');
}
//------------------------------------------------------------------- Identificadores Random
// Retorna un Num random de p+1 digitos, empezando por s = 1-9
// Nodos (6,1) : 1000000 - 1999999
// Sesiones (9,1) : 1000000000 - 1999999999
function getId(prec,serie){
	if (!prec) prec = 6;
	if (!serie) serie = 1;
	var base = 1;
	for (var i=0;i<prec;i++) base *= 10; // 10 ^ base
	return Math.floor(Math.random()*base + serie*base);
}

// Calcular un id0 para arcos, de forma que no se repitan el de salida y entrada
function id02idArc(id0,id1){
	return (id0 + 111) ^ id1; 
}
function idArc2id0(idx,id1){
	return (idx ^ id1) - 111; 
}
//------------------------------------------------------------------- AJAX POST
function retoAjaxPost(params,cgi,eco){
	var myAjax = new Ajax.Request(cgi, { parameters: params, onComplete: eco, evalJS : false, evalJSON : false });
	}

//------------------------------------------------------------------- Graba texto en el FS
function ajaxGrabaFS (id,fich,texto,path,eco){
	var txtB64 = Base64.encode(texto);
	var params = '';
	params += 'id='+id;
	params += '&fich='+fich;
	params += '&info='+txtB64;
	params += '&path='+path;
	var cgi = vgComun.pathCGIs + vgComun.cgiGraba;
	retoAjaxPost(params,cgi,eco);
}

//------------------------------------------------------------------- Ejecuta Query SQLite
function ajaxQuerySQLite (id,bd,stmt,path,eco){
try{
	var txtB64 = Base64.encode(stmt);
	var params = '';
	params += 'id='+id;
	params += '&bd='+bd;
	params += '&stmt='+txtB64;
	params += '&path='+path;
	var cgi = vgComun.pathCGIs + vgComun.qySQLite;
	retoAjaxPost(params,cgi,eco);
	}catch(e){alert(e.message);}
}
//------------------------------------------------------------------- Ejecuta Query MongoDB
function ajaxQueryMongoDB (id,bd,stmt,path,eco){
try{
	var txtB64 = Base64.encode(stmt);
	var params = '';
	params += 'id='+id;
	params += '&bd='+bd;
	params += '&stmt='+txtB64;
	params += '&path='+path;
	var cgi = vgComun.pathCGIs + vgComun.qryMongo;
	retoAjaxPost(params,cgi,eco);
	}catch(e){alert(e.message);}
}

//------------------------------------------------------------------- Ejecuta Query Oracle
function ajaxQueryOracle (id,bd,SO,stmt,eco){
try{
	var txtB64 = Base64.encode(stmt);
	var params = '';
	params += 'id='+id;
	params += '&bd='+bd;
	params += '&stmt='+txtB64;
	var cgi = vgComun.pathCGIs + vgComun.qyOracle;
	retoAjaxPost(params,cgi,eco);
	}catch(e){alert(e.message);}
}


//------------------------------------------------------------------- Parametros HTML
function getProy(){
   return vgComun.hSesion.get('proy');
}
function getSess(){
   return vgComun.hSesion.get('id0');
}

function getParamsHTML(){

	var campo;
	var laURL = document.URL;
	var strParams = laURL.substring(laURL.indexOf('?')+1,laURL.length);
	var trozos = strParams.split('&');
	var params = new Hash();
	trozos.each(function(trozo){
		campo = trozo.split('=');
		params.set(campo[0],campo[1]);
	});
	return params;
}

//------------------------------------------------------------------- String <--> Hash
function cambiaMarcas(pstr){
	var aux = pstr;
	if (aux.match('·:')){
		aux = aux.replace(/\]·\[/g,'·|');
		aux = aux.replace(/\]·/g,'');
		aux = aux.replace(/·\[/g,'');
		aux = aux.replace(/\n/g,'');
		}
	else {
		aux = aux.replace(/\]\[/g,'·|');
		aux = aux.replace(/\]/g,'');
		aux = aux.replace(/\[/g,'');
		aux = aux.replace(/:/g,'·:');
		aux = aux.replace(/\n/g,'');
	}
	return aux;
}


function str2hash (pstr){
	var trozos,key,value;
	var str = cambiaMarcas(pstr);
	var campos = str.split('·|');		
	var hash = new Hash();
	campos.each(function(campo){
		trozos = campo.split('·:');
		key = trozos[0];
		value = trozos[1];
		hash.set(key,value);
	});
	return hash;
}

function hash2str (phash){
   var str = '';
   var keys = phash.keys();
   keys.each(function(key){
      str += '['+key+':'+phash.get(key)+']';
   })
   console.log(str);
   return str;
}

//------------------------------------------------------------------- Manipulación nodos Grabar FS
function escapaText(txt){
	var str = txt;
	str = str.replace(/\"/g,'·,');
	str = str.replace(/\{/g,'·[');
	str = str.replace(/\}/g,']·');
	str = str.replace(/\n/g,'·~');
	return str;
}
function escapaNodo(nodo){
	nodo.set('etc', escapaText(nodo.get('etc')));
	nodo.set('txt', escapaText(nodo.get('txt')));
}

function restauraText(txt){
	var str = txt;
	str = str.replace(/·,/g,'"');
	str = str.replace(/·\[/g,'{');
	str = str.replace(/\]·/g,'}');
	str = str.replace(/·~/g,'\n');
	return str;
}
function restauraNodo(nodo){
	nodo.set('etc', restauraText(nodo.get('etc')));
	nodo.set('txt', restauraText(nodo.get('txt')));
}

function plain2html(plain){
	var html = plain.split('\n').join('<br>');
	return html;
}

//------------------------------------------------------------------- clona Array de Hash (normalmente, nodos)
// Ojo! solo funciona si los obj Hash del Array orig, han sido generados con sets
// Bien : cosa.set('info','ABC'); cosa.set('num',123);
// Mal : cosa.info = 'ABC'; cosa.num = 123;
function clonaArray(orig){
   var copia = new Array();
   orig.each(function(viejo){ 
      var nuevo = viejo.clone();
      copia.push(nuevo);
      })
   return copia;
}

function arrayJSON_FS(nodos){
	var template = new Template('{"id0": #{id0},"id1": #{id1},"num": #{num},"geo":"#{geo}","tau":"#{tau}","cod":"#{cod}","tag":"#{tag}","etc":"#{etc}","txt":"#{txt}"}');
	var arr = new Array();
	nodos.each(function(nodo){
		var nodox = nodo.clone();
		escapaNodo(nodox);
		var str = template.evaluate(nodo);
		arr.push(str);
   })
	var str = '[' + arr.join(',') +']';
   	return str;
}



//------------------------------------------------------------------- CSV a Hash
// Recibe dos string, uno con las claves y otro con valores
// Ej. claves : cod|nom|mail
// Ej. valores : PEPE|Jose Maria|pepe.at.reto-labs.es
// --> Hash({cod:"PEPE",nom:"Jose Maria",mail:"pepe.at.reto-labs.es"})
function csv2hash (caps,pstr){
	var valor;
	var claves = caps.split('|');		
	var values = pstr.split('|');	
	if (claves.length != values.length){ alert('CLAVES_VALORES_MAL :'+pstr); return false}
	var hash = new Hash();
	claves.each(function(clave,ix){
		valor = values[ix];
		hash.set(clave,valor);
	});
	return hash;
}
//------------------------------------------------------------------- Form Modal
var retoModal = Class.create({
initialize : function(frm){
	this.div = new Element('div',{id:'tapaModal',className:'tapaModal'});
	this.div.style.zIndex = 4999;
	this.div.update(frm);
	vgComun.stackModal.push(this.div);
	document.body.appendChild(this.div);
}
})
function hideModal(){
   if (vgComun.stackModal.length){
	   var modal =	vgComun.stackModal.pop();
	   if (modal) document.body.removeChild(modal);
	   }
}

