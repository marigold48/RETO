/*===================================================================
libK1_Topol.js
Contiene las funciones habituales para:
- Crear una nueva Topología (conjt|lista|arbol|grafo|malla)
- Grabar una Topología
- Listar Topologias
- Cargar una Topologia
- Borrar una Topologia

En el nodo0 de cada topología, se almacenará en el campo {etc} el string
 <coleccion>.<tipo>.<nombre>.<sufix>
 P. ej: 
 Hotel.CHARLA.Marigold.arbol
 Flora.TAXON.Bonnier.arbol
 
===================================================================*/

var vgTopol = {
	topol : '',
	bbdd : '',
	colecc: '',
	Drags : '', // drags
	triggerPostCarga : '',
	triggerPostQuery : ''
}

//------------------------------------------------------------------- Crear Nodos

function getNodoStd(cod,tag,etc,txt){
	var nodo = new Hash();
	nodo.set('id0',getId(6,1));
	nodo.set('id1',0);
	nodo.set('num',0);
	nodo.set('geo','NdN');
	nodo.set('tau','NdN');
	nodo.set('cod',cod||'NdN');
	nodo.set('tag',tag||'NdN');
	nodo.set('etc',etc||'NdN');
	nodo.set('txt',txt||'NdN');
	return nodo;
}

function getNodoZero(tag,etc){
	var nodo = getNodoStd('_nodo0',tag,etc);
	return nodo;
}

//=================================================================== Basado en Topol.js
function showNodosDnD(nodo,i,divBase){
	console.log(nodo.get('tag')+' : '+divBase);
   var divNodo = new Element('div',{id:'drag_'+i,className:'divDrag'})
	var foto = new Element('img',{src:nodo.get('etc'),width:'80px'});
	divNodo.appendChild(foto);
	var tag = new Element('span').update(nodo.get('tag'));
	divNodo.appendChild(tag);
	$(divBase).appendChild(divNodo);
}


function moverDrags(topol){
	$('divBase').update();
	var nodos = topol.getNodos();
	var DragDrop = new retoDivsDnD(nodos,showNodosDnD,'divBase');
	DragDrop.setGrid(0);
	DragDrop.setUpdtGeo(true);
	DragDrop.setLayout('GEO');
	DragDrop.showNodos();
	DragDrop.setTriggerPostDrop();
	DragDrop.initMoverDiv();
	vgTopol.Drags = DragDrop;
}

//------------------------------------------------------------------- Crear Topol
function ecoGrabaTopol(resp){

}

function getTopolStd(bbdd,colecc,nom,tipo,topol_t,fnShow,id0){
	console.log(bbdd+colecc+nom+tipo+topol_t);
	var ok = true;
	var topol = '';
	var nodos = new Array();
	var fich = colecc+'.'+tipo+'.'+nom+'.'+topol_t;
	var nodo0 = getNodoZero(nom,fich);

	if (id0) nodo0.set('id0',id0);

	nodos.push(nodo0);

	switch (topol_t){
		case 'conjt' : 
			topol = new retoConjt(nodos,fnShow);
			break;

		case 'lista' : 
			topol = new retoLista(nodos,fnShow);
			break;

		case 'arbol' : 
			var nodosOK = optimizaNodosArbol(nodos);
			topol = new retoArbol(nodosOK,fnShow);
			break;

		case 'grafo' :
			topol = new retoGrafo(nodos,fnShow);
			break;

		case 'malla' : 
			topol = new retoMalla(nodos,fnShow);
			break;
		default : ok = false; break;
	}
	if (ok){
		grabaTopol(bbdd,topol,ecoGrabaTopol);
		return topol;
	}
	else return null;
}

function getParamsTopol(topol){

}
function borraTopol(bbdd,topol,fnPost){
	
}

//------------------------------------------------------------------- Manipulación nodos Grabar Mongo DB
// Regenerar nodos con las propiedades estandar
function arrayJSON(nodos){
	var arr = new Array();
	nodos.each(function(nodo){
		var nodox = new Hash();
		nodox.set('id0', parseInt(nodo.get('id0')));
		nodox.set('id1', parseInt(nodo.get('id1')));
		nodox.set('num', parseInt(nodo.get('num')));
		nodox.set('geo', nodo.get('geo'));
		nodox.set('tau', nodo.get('tau'));
		nodox.set('cod', nodo.get('cod'));
		nodox.set('tag', nodo.get('tag'));
		nodox.set('etc', nodo.get('etc'));
		nodox.set('txt', nodo.get('txt'));
		var str = JSON.stringify(nodox);
		arr.push(str+'\n');
   })
	var str = '[' + arr.join(',') +']';
   return str;
}

function nodos2docum(nombre,colecc,tipo,mask,nodos,id0){
	var nodo0 = nodos[0];
	if (!id0) id0 = nodo0.get('id0');
	if (!nombre) nombre = nodo0.get('tag');
	if (!tipo) tipo = nodo0.get('etc')
	var stmt = 'db.'+colecc+'.remove({id0:"'+id0+'"})\n';
	stmt += 'db.'+colecc+'.insert({id0:'+id0+'nombre:"'+nombre+'", tipo:"'+tipo+'", mask:"'+mask+'", nodos:';
	console.log(stmt)	;
	stmt += arrayJSON(nodos);
	stmt += '})';
	return stmt;
}

function strMongo2nodos(str){
	var nodo, txt;
	var nodos = new Array();
	
	var lins = str.split('\n');
	var strNodos = lins[2];
   if (strNodos == 'bye'){console.log('No hay nodos');return nodos;}
   	
	var hNodos = JSON.parse(strNodos);
	
	hNodos.nodos.each(function(nodox){
		nodo = $H(nodox);
		restauraNodo(nodo);
		nodos.push(nodo);
	})
	console.log('strMongo2nodos: '+nodos.length)
	return nodos;  
}

function strMongo2lista(str){
	var item, txt;
	var items = new Array();
	
	var lins = str.split('\n');
	
	lins.each(function(lin){
		if (lin.match('nombre')){
			item = $H(lin);
			items.push(item);
		}
	})

	return items;  
}

function topol2stmt(topol,clonar){
	var nodos = topol.getNodos();
	var nodo0 = nodos[0];
	var idDoc = nodo0.get('id0');

	if (clonar){
		idDoc = getId(6,1);
		nodo0.set('id0',idDoc);
	}

	var etc = nodo0.get('etc');
	console.log('topol2stmt 1: ' + etc);
	var params = etc.split('.');
	var colecc = params[0];
	var tipoT  = params[1];
	var nombre = params[2];
	var maskT  = params[3];

// Sincroniza el nombre (tag) en etc	
	params[2] = nodo0.get('tag');
	etc = params.join('.');
	console.log('topol2stmt 2: ' + etc);
	nodo0.set('etc',etc);

	var strNodos = arrayJSON(nodos);
	
	var strJson = '{"id0":'+idDoc+',"nombre":"'+nodo0.get('tag')+'", "tipo":"'+tipoT+'", "mask":"'+maskT+'", "nodos":'+strNodos+'}';
	var ok = JSON.parse(strJson);
	stmt = 'db.'+colecc+'.update({"id0":'+idDoc+'},'+strJson+',{upsert: true})';
	return stmt;
}

function grabaTopol(bbdd,topol,fnPost){
	var id = getSess();
	var stmt = topol2stmt(topol,false);
	console.log(stmt);

	ajaxQueryMongoDB(id,bbdd,stmt,vgComun.pathApp,fnPost);
}

function clonaTopol(db,topol,fnPost){
	var id = getSess();
	var stmt = topol2stmt(topol,true);
	if (stmt) ajaxQueryMongoDB(db,stmt,vgComun.pathApp,fnPost);
}

//------------------------------------------------------------------- Carga Topol
function ecoCargaTopol(resp){
	var nodos = strMongo2nodos(resp.responseText);
	vgTopol.triggerPostCarga(nodos);
}

function cargaTopolById0(id0){
	var id   = getSess();
	var ruta  = vgComun.pathApp;
	var bbdd  = vgTopol.bbdd;
	var colecc = vgTopol.colecc;
	var stmt = 'db.'+colecc+'.find({"id0" : '+id0+'},{"_id":0,"nodos":1})';
	console.log(stmt);
	ajaxQueryMongoDB(id,bbdd,stmt,ruta,ecoCargaTopol);
	
}

function cargaTopolBy_ID(_ID){
	var id   = getSess();
	var ruta  = vgComun.pathApp;
	var bbdd  = vgTopol.bbdd;
	var colecc = vgTopol.colecc;
	var stmt = 'db.'+colecc+'.find({"_id" : ObjectId("'+_ID+'")},{"_id":0,"nodos":1})';
	console.log(stmt);
	ajaxQueryMongoDB(id,bbdd,stmt,ruta,ecoCargaTopol);
	
}

function pickedTopol(ev){
	var elem = ev.element();
	console.log(elem.value);
	var _ID = elem.value;
	cargaTopolBy_ID(_ID);
}

function listaTopol(items){
	var lst = new Element('select');
	lst.style.fontSize = '200%';
	lst.on('click',pickedTopol);
	items.each(function(item){
		var opt = new Element('option');
		opt.value = item._id;
		opt.text  = item.nombre;
		lst.appendChild(opt);

	})
	$('divBase').update(lst);
}

function ecoQueryTopol(resp){
	try{
	var items = new Array();
	var lins = resp.responseText.split('\n');
	if (lins[2] == 'bye') {vgTopol.triggerPostQuery(items); return false}
	var n = lins.length;
	for (var i=2;i<n-3;i++){
		var str = lins[i].replace('ObjectId(','').replace('")','"');
		console.log(str);
		var item = JSON.parse(str);
		items.push(item);
		}
   vgTopol.triggerPostQuery(items);
}catch(e){alert(e.message);}
}

function queryTopol(bbdd,ruta,colecc,tipo){
	var id = getSess();
	var stmt = 'db.'+colecc+'.find({"tipo":"'+tipo+'"},{"nombre":1})';
	console.log(stmt);
	ajaxQueryMongoDB(id,bbdd,stmt,ruta,ecoQueryTopol);
}

//=================================================================== Obj Conjt
var retoConjt = Class.create({
initialize : function(nodos,f){
	this.nodos = nodos;
	this.indice = new Array();
	this.fnShow = f;
	this.optimizaNodos();
},
optimizaNodos : function(){
	this.indice = new Array();
	var n = this.nodos.length;
	for (var i=0;i<n;i++) { 
		this.indice.push(parseInt(this.nodos[i].get('id0')));
	}
},
getNodos : function(){
	return this.nodos;
},
getNumNodos : function(){
   return this.nodos.length;
},
getNodoByIx : function(ix){
    var nodo = this.nodos[ix];
	return nodo;
},
getNodoById : function(id){
	var ix = this.indice.indexOf(parseInt(id));
    var nodo = this.nodos[ix];
	return nodo;
},
updtNodoSelf : function (nodo){
	var id = parseInt(nodo.get('id0')); 
	var ix = this.indice.indexOf(id);
	this.nodos[ix] = nodo.clone();
},
addNodoSelf : function (nodo){
	this.nodos.push(nodo.clone());
	console.log('addNodoSelf '+nodo.get('tag'));
	this.optimizaNodos();
},
borraNodoSelf : function(nodo){
	var id = parseInt(nodo.get('id0')); 
	var ix = this.indice.indexOf(id);
	console.log(id+'::'+ix);
	if (ix == -1) return false;
	this.nodos.splice(ix,1);	
	this.optimizaNodos();
},

show : function(div){
	$(div).update();
	var n = this.nodos.length;
	for (var i=0;i<n;i++) this.fnShow(this.nodos[i],div);
}
})

//================================================================== Obj Lista

var retoLista = Class.create({
initialize : function(nodos,f){
	this.nodos = nodos;
	this.indice = new Array();
	this.fnShow = f;
	this.optimizaNodos();
},
optimizaNodos : function(){
	this.indice = new Array();
	var n = this.nodos.length;
	for (var i=0;i<n;i++) { 
		this.indice.push(parseInt(this.nodos[i].get('id0')));
		this.nodos[i].set('num',i);
	}
},
getNodos : function(){
	return this.nodos;
},
getNumNodos : function(){
   return this.nodos.length;
},
getNodoById : function(id){
	var ix = this.indice.indexOf(parseInt(id));
    var nodo = this.nodos[ix];
	return nodo;
},
updtNodoSelf : function (nodo){
	var id = parseInt(nodo.get('id0')); 
	var ix = this.indice.indexOf(id);
	this.nodos[ix] = nodo.clone();
},
addNodoSelf : function (nodo){
	this.nodos.push(nodo.clone());
	console.log('addNodoSelf '+nodo.get('tag'));
	this.optimizaNodos();
},
borraNodoSelf : function(nodo){
	var id = nodo.get('id0'); 
	var ix = this.indice.indexOf(id);
	console.log(id+'::'+ix);
	this.nodos.splice(ix,1);	
	this.optimizaNodos();
},
subeNodoSelf : function(nodo){
	var id = parseInt(nodo.get('id0')); 
	var ix = this.indice.indexOf(id);
	if (ix < 2) return;
	var aux = this.nodos[ix-1];
	this.nodos[ix-1] = nodo;
	this.nodos[ix] = aux;
	this.optimizaNodos();
},
bajaNodoSelf : function(nodo){
	var id = parseInt(nodo.get('id0')); 
	var ix = this.indice.indexOf(id);
	var n = this.nodos.length;
	if (ix >= n-1) return;
	var aux = this.nodos[ix+1];
	this.nodos[ix+1] = nodo;
	this.nodos[ix] = aux;
	this.optimizaNodos();
},
show : function(div){
	$(div).update();
	var n = this.nodos.length;
	for (var i=1;i<n;i++) this.fnShow(this.nodos[i],div);
}
})

//=================================================================== Obj Arbol

function cambiaIdsArbol(nodos){
	var nodosOK = optimizaNodosArbol(nodos);
	var arbol = new retoArbol(nodosOK);
	arbol.cambiaIds();
	var cambiados = arbol.getNodos();
	return cambiados;
}

function optimizaNodosArbol(nodos){
	var ixP,ixH,nAux,hijos;

	var indice0 = new Array();
	var indice1 = new Array();
	var nodosOK = new Array();
	var nodosKO = new Array();

// recopila todos los id0 que llegan

	nodos.each(function(nodo){
		indice0.push(parseInt(nodo.get('id0')));
	})
// swap si ix-hijo < ix-padre
	nodos.each(function(nodo){
		ixH = indice0.indexOf(parseInt(nodo.get('id0')));
		ixP = indice0.indexOf(parseInt(nodo.get('id1')));
		if (ixH < ixP){
			nAux = nodos[ixP];
			nodos[ixP] = nodo;
			nodos[ixH] = nAux;
			indice0[ixP] = parseInt(nodo.get('id0'));
			indice0[ixH] = parseInt(nAux.get('id0'));
			}
	})
// console.log(indice0.join('|'));

// Trata los nodos
	nodos.each(function(nodo){
		id0 = parseInt(nodo.get('id0'));
		id1 = parseInt(nodo.get('id1'));
		cod = nodo.get('cod');

		nodo.set('hijos',new Array());
		nodo.set('stat','FULLA');
		ixP = indice1.indexOf(id1); // ixP refleja la posicion del nodo padre en nodosOK
// console.log(id0+'/'+id1+':'+ixP);

		if (cod == '_borrado') null;
		else if (cod == '_nodo0'){
			indice1.push(id0);
			nodosOK.push(nodo);
		} 
		else if (ixP >= 0){ // Hay un padre Anterior. Caso normal
			nAux = nodosOK[ixP];
			nAux.set('stat','COLAP');
			hijos = nAux.get('hijos');
			hijos.push(id0);
//			console.log(hijos.join('|'));
			nodo.set('num',hijos.length);
			indice1.push(id0);
			nodosOK.push(nodo);
			}
		else {
			nodosKO.push(nodo);
			} 
		})
	// Si hay nodos 'fuera de secuencia', pero que tienen nodo padre, se repite la operación
	
//	console.log(nodosOK.length+' OK y '+ nodosKO.length + ' KO');

	return nodosOK; 
}

//=================================================================== Obj Arbol
var retoArbol = Class.create({
initialize : function(nodos,f){
	this.nodos = nodos;
	this.indice = new Array();
	this.fnShow = f;
	this.indexaNodos();
},
setFnShow : function(f){
	this.fnShow = f;
},
indexaNodos : function(){
	this.indice = new Array();
	var nodos = new Array();
	var n = this.nodos.length;
	for (var i=0;i<n;i++){
		if (this.nodos[i].get('cod') != '_borrado'){
			this.indice.push(parseInt(this.nodos[i].get('id0')));
			nodos.push(this.nodos[i]);
		}
	} 
	this.nodos = nodos;
//	console.log(this.nodos.length+' Nodos y '+this.indice.length+' IDs');
},
colapAll : function(){
	console.log('Expande todo');
	var n = this.nodos.length;
	for (var i=1;i<n;i++) if (this.nodos[i].get('stat') == 'EXPAN') this.nodos[i].set('stat','COLAP');
},
expandAll : function(){
	var n = this.nodos.length;
	for (var i=0;i<n;i++)  if (this.nodos[i].get('stat') == 'COLAP') this.nodos[i].set('stat','EXPAN');
},
cambiaIdNodo : function(nodo,index){
//	console.log('Entra: '+nodo.values().join('|'));
	var hijosNew = new Array();
	var hijosOld = nodo.get('hijos');
	var n = hijosOld.length;
	for(var i=0;i<n;i++){
		var ix = this.indice.indexOf(hijosOld[i]);
		hijosNew.push(index[ix])
	}
	nodo.set('hijos',hijosNew);
	var ix = this.indice.indexOf(nodo.get('id0'));
	nodo.set('id0',index[ix]);

	var ix = this.indice.indexOf(nodo.get('id1'));
	if (ix === -1) null;
	else nodo.set('id1',index[ix]);
//	console.log('Sale: '+nodo.values().join('|'));
},
cambiaIds : function(){
	var idx,nodo;
	var index = new Array();
	var n = this.indice.length;
	for(var i=0;i<n;i++) index.push(getId(6,1));
	for (var i=0;i<n;i++){
		idx = this.indice[i];
		nodo = this.getNodoById(idx);
		this.cambiaIdNodo(nodo,index);
	}

},
purgaHijosBorrados : function(nodo){
	var hijos = nodo.get('hijos');
	var hijosOK = new Array();
	var n = hijos.length;
	for(var i=0;i<n;i++){
		var idH = hijos[i];
		var hijo = this.getNodoById(idH);
		if (hijo.get('cod') != '_borrado') hijosOK.push(idH);
	}

	nodo.set('hijos',hijosOK);

	var n = hijosOK.length;
	if (!n) nodo.set('stat','FULLA');
	else {
		for(var i=0;i<n;i++){
			var idH = hijos[i];
			var hijo = this.getNodoById(idH);
			this.purgaHijosBorrados(hijo);
		}
	}

},
getRaiz : function(){
	return this.nodos[0];
},
getNodos : function(){
	return this.nodos;
},
getNumNodos : function(){
   return this.nodos.length;
},
setShowFunction : function(f){
	this.fnShow = f;
},
getNodoById : function(id){
	var ix = this.indice.indexOf(parseInt(id));
	if (ix != -1) return this.nodos[ix];
},
updtNodoSelf : function (nodo){
	var id = parseInt(nodo.get('id0')); 
	var ix = this.indice.indexOf(id);
	nodo.set('stat',this.nodos[ix].get('stat'))
	nodo.set('hijos',this.nodos[ix].get('hijos'))
	this.nodos[ix] = nodo;
},
addNodoHijo : function (pare,nodo,ix){
	var idP = parseInt(pare.get('id0'));
	var idH = parseInt(nodo.get('id0'));

	var padre = this.getNodoById(idP);
	var stat = padre.get('stat');
	var hijos = padre.get('hijos');

	if (stat = 'FULLA') padre.set('stat','EXPAN');
	
	if (ix % 1 === 0) hijos.splice(ix+1,0,idH); // si hay presente un indice, inserta detrás
	else hijos.push(idH); // si no, añade al final

	nodo.set('num',hijos.length);
	nodo.set('id1',idP);
	nodo.set('stat','FULLA');
	nodo.set('hijos',new Array());

	this.nodos.push(nodo);
	this.indice.push(idH);
},
borraRama : function(nodo){
	nodo.set('cod','_borrado');

	var hijos = nodo.get('hijos');
	var n = hijos.length;
	for (var i=0;i<n;i++){
		var idH = hijos[i];
		var hijo = this.getNodoById(idH);
		this.borraRama(hijo);
	}
},
getRamaNodo : function (nodo,rama){
	rama.push(nodo);
	var hijos = nodo.get('hijos');
	var n = hijos.length;
	for (var i=0;i<n;i++){
		var id = hijos[i];
		var nodox = this.getNodoById(id);
		this.getRamaNodo(nodox,rama);
		}
},
getNodosAncla : function(){
   var nodo,cod;
   var anclas = new Array();
   var n = this.nodos.length;
   
	for (var i=0;i<n;i++){
	   nodo = this.nodos[i];
		cod = nodo.get('cod');
		if (cod == '_ancla') anclas.push(nodo);
		}
	return anclas;
},
pegaRamaNodo : function(ancla,rama){
	var idP = parseInt(ancla.get('id1'));
	var padre = this.getNodoById(idP);
	var stat = padre.get('stat');
	var hijos = padre.get('hijos');

	var injerto = rama.splice(0,1)[0];
	console.log(injerto);
	var idInj = injerto.get('id0');
	rama.each(function(nodo){
		if (nodo.get('id1') == idInj){  // Los nodos hijos del injerto pasan a ser hijos del nodo injertado
			hijos.push(nodo.get('id0'));
			nodo.set('id1',idP)
		}
	
	})

	this.nodos = this.nodos.concat(rama);
	this.indexaNodos();
},
updtRamaNodo : function(nodo,rama){
	this.borraRama(nodo);
	this.pegaRamaNodo(nodo,rama);
},
borraNodoSelf : function(nodo){ // Borrado recursivo de la rama, y purgar hijos borrados. Reindexar
	var id0 = parseInt(nodo.get('id0'));
	var nodox = this.getNodoById(id0);
	this.borraRama(nodox);
	this.purgaHijosBorrados(this.getRaiz());
	this.indexaNodos();
},
subeNodoSelf : function(nodo){  // swap en los hijos del padre, y swap en el array this.nodos. Reindexar
	var id0 = parseInt(nodo.get('id0'));
	var id1 = parseInt(nodo.get('id1'));
	var padre = this.getNodoById(id1);
	var hijos = padre.get('hijos');
	var ixH = hijos.indexOf(id0);
	if (!ixH) return;
	var idAux = hijos[ixH-1];
	hijos[ixH-1] = id0;
	hijos[ixH] = idAux;
	var ixAux = this.indice.indexOf(idAux);
	var ixAct = this.indice.indexOf(id0);
	var nAux = this.nodos[ixAux];
	var nAct = this.nodos[ixAct];
	nAct.set('num',ixH-1)
	this.nodos[ixAct] = nAux;
	this.nodos[ixAux] = nAct;
	this.indexaNodos();
},
bajaNodoSelf : function(nodo){
	var id0 = parseInt(nodo.get('id0'));
	var id1 = parseInt(nodo.get('id1'));
	var padre = this.getNodoById(id1);
	var hijos = padre.get('hijos');
	var ixH = hijos.indexOf(id0);
	if (ixH == hijos.length-1) return;
	var idAux = hijos[ixH+1];
	hijos[ixH+1] = id0;
	hijos[ixH] = idAux;
	var ixAux = this.indice.indexOf(idAux);
	var ixAct = this.indice.indexOf(id0);
	var nAux = this.nodos[ixAux];
	var nAct = this.nodos[ixAct];
	nAct.set('num',ixH+1)
	this.nodos[ixAct] = nAux;
	this.nodos[ixAux] = nAct;
	this.indexaNodos();
},

showNodos : function(nodo,div,nivel){
	this.fnShow(nodo,div,nivel);
	var stat = nodo.get('stat');
	if (stat == 'EXPAN'){
		var hijos = nodo.get('hijos');
		var n = hijos.length;
		for (var i=0;i<n;i++){
			var id = hijos[i];
			var nodox = this.getNodoById(id);
			this.showNodos(nodox,div,nivel+1);
		}
	}
},
show : function(div){
	$(div).update();
	var raiz = this.nodos[0];
	this.showNodos(raiz,div,0);
}
})

//=================================================================== Obj Grafo
var retoGrafo = Class.create({
initialize : function(todos,f){
	this.nodos = new Array();
	this.arcos = new Array();
	this.iNodos = new Array();
	this.iArcos = new Array();
	this.fnShow = f;
	separaNodosArcos(todos);
	this.optimizaNodos();
	this.optimizaArcos();
},
separaNodosArcos : function(todos){
	var nodox = '';
	var n = todos.length;
	for (i=0;i<n;i++){
		nodox = todos[i];
		if (!parseInt(nodox.get('id1'))) this.nodos.push(nodox); // nodos han de tener {id1}=0
		else this.arcos.push(nodox);}
},
optimizaNodos : function(){
	this.iNodos = new Array();
	var n = this.nodos.length;
	for (var i=0;i<n;i++) this.iNodos.push(parseInt(this.nodos[i].get('id0')));
},
optimizaArcosSimple : function(){
	this.iArcos = new Array();
	var n = this.arcos.length;
	for (var i=0;i<n;i++) this.iArcos.push(parseInt(this.arcos[i].get('id0')));
	console.log(this.iArcos.join('|'));
},
optimizaArcos : function(){
	var arco, idx,id0,id1,ixI,ixF;
	var arcos = new Array();
	var n = this.arcos.length;
	for (var i=0;i<n;i++){
		arco = this.arcos[i];
		idx = parseInt(arco.get('id0'));
		id1 = parseInt(arco.get('id1'));
		
		id0 = idArc2id0 (idx,id1) ; //libK0_Comun.js
		
		ixI = this.iNodos.indexOf(id0);
		ixF = this.iNodos.indexOf(id1);
		
		console.log(id0+'->'+id1+' | '+ixI+':'+ixF);

		if (ixI >=0 && ixF >= 0) {
			arco.set('nodoI',ixI);
			arco.set('nodoF',ixF);
			arco.set('num',i);
			arcos.push(arco);
		}
	}
	this.arcos = arcos;
	this.optimizaArcosSimple();
},
getRaiz : function(){
	return this.nodos[0];
},
getNodos : function(){
	return this.nodos;
},
getArcos : function(){
	return this.arcos;
},
getNumNodos : function(){
   return this.nodos.length;
},
getNodoByIx : function(ix){
	var nodo = this.nodos[ix];
	return nodo;
},
getNodoById : function(id){
	var ix = this.iNodos.indexOf(parseInt(id));
	console.log('id/ix nodo: '+id+'/'+ix);
	var nodo = this.nodos[ix];
	return nodo;
},
getArcoById : function(id){
	var ix = this.iArcos.indexOf(parseInt(id));
	console.log('id/ix nodo: '+id+'/'+ix);
	var arco = this.arcos[ix];
	return arco;
},

updtNodoSelf : function (nodo){
	var id = parseInt(nodo.get('id0')); 
	var ix = this.iNodos.indexOf(id);
	this.nodos[ix] = nodo.clone();
},
updtArcoSelf : function (arco){
	var id = parseInt(arco.get('id0')); 
	var ix = this.iArcos.indexOf(id);
	this.arcos[ix] = arco.clone();
},
addNodoSelf : function (nodo){
	this.nodos.push(nodo);
	this.optimizaNodos();
},
addArcoByIds : function (idI,idF){
	var id0  = parseInt(idI);
	var id1  = parseInt(idF);
	var idx = id02idArc(id0,id1);
	if (this.iArcos.indexOf(idx)>= 0) return false; //solo se permite un arco en cada dirección, entre 2 nodos

	var nodoI = this.getNodoById(idI);
	var nodoF = this.getNodoById(idF);
	var ixI = this.iNodos.indexOf(idI);
	var ixF = this.iNodos.indexOf(idF);
	var arco = getNodoStd(nodoI.get('tag')+':'+nodoF.get('tag'));
	arco.set('id0',idx);
	arco.set('id1',id1);
	arco.set('num',this.arcos.length);
	arco.set('ixI',ixI);
	arco.set('ixF',ixF);
	this.iArcos.push(idx);
	this.arcos.push(arco);
	return idx;
},
borraNodoSelf : function(nodo){ 
	var id = parseInt(nodo.get('id0')); 
	var ix = this.iNodos.indexOf(id);
	console.log(id+'::'+ix);
	this.nodos.splice(ix,1);	
	this.optimizaNodos();
},
borraArcoSelf : function(arco){ 
	var id = parseInt(arco.get('id0')); 
	var ix = this.iArcos.indexOf(id);
	console.log(id+'::'+ix);
	this.arcos.splice(ix,1);	
	this.optimizaArcosSimple();
},
show : function(div){
	$(div).update();
	this.optimizaArcos();
	var n = this.nodos.length;
	for (var i=1;i<n;i++) this.fnShow(this.nodos[i],div);
	var n = this.arcos.length;
	for (var i=0;i<n;i++) this.fnShow(this.arcos[i],div);
}
})

//=================================================================== Obj Malla

var retoMalla = Class.create({
  initialize : function (nodo0,cols,rows,cells,f){
      this.nodo0  = nodo0;
      this.cols   = cols;
      this.rows   = rows;
      this.cells  = cells;
      this.fnShow = f;
      this.celdas = new Hash();
      this.optimizaCeldas();
},
optimizaCeldas : function(){
   var n = this.cells.length;
   for (var i=0;i<n;i++){
      id0 = this.cells[i].get('id0'); 
      id1 = this.cells[i].get('id1'); 
      id0 = id0 ^ id1;
      this.celdas.set(id0+'.'+id1,'SI');
   }
   console.log(this.celdas);
},
getNodos : function(){
   var nodos = new Array();
   nodos.push(this.nodo0);
   nodos = nodos.concat(this.cols);
   nodos = nodos.concat(this.rows);
   nodos = nodos.concat(this.cells);
   return nodos;
},
getCols : function(){
	return this.cols;
},
getRows : function(){
	return this.rows;
},
getCells : function(){
	return this.cells;
},
buscaValor : function (tdId){
	return this.celdas.get(tdId);
},
borraCell :function (idCell){
   var n = this.cells.length;
   console.log('Cells: '+n);
   for (var i=0;i<n;i++){
      var cell = this.cells[i];
      var id0 = parseInt(cell.get('id0'));
      var id1 = parseInt(cell.get('id1'));
      id0 = id0 ^ id1;
      console.log(idCell+'::'+id0+'.'+id1);
      
      if (idCell == (''+id0+'.'+id1)){
         this.cells.splice(i,1);
         return false;
         }
   }

},
editaCelda : function (ev){
	var idCell = ev.element().id;
	console.log('Edit '+idCell);
	var valor = this.buscaValor(idCell);
	if (!valor){
	   var cell = getNodoNuevo('Celda');
	   cell.set('geo','CELL');
	   var id0 = parseInt(idCell.split('.')[0]);
	   var id1 = parseInt(idCell.split('.')[1]);
	   id0 = id0 ^ id1;
	   cell.set('id0', id0);
	   cell.set('id1', id1);
	   this.cells.push(cell);
		var ok = new Element('i',{id:idCell,className:'fa fa-check'}).update('X');
		ok.style.color ='green';
		$(idCell).update(ok);
		this.celdas.set(idCell,'SI');
	} 
	else {
	   this.borraCell(idCell);
		this.celdas.unset(idCell);
		$(idCell).update('');
	} 
},
show : function (div){
	var tMatr = new Element('table');tMatr.style.border = '1px blue solid';
	var tBody = new Element('tbody',{});
	var th0 = new Element('th').update('');
	tMatr.appendChild(th0);
	
   var nh = this.cols.length;
	console.log('MALLA nh '+nh);
   for (var i=0;i<nh;i++){
 		var th = new Element('th').update(this.cols[i].get('tag'));
		tMatr.appendChild(th);
 		};
 	
   var nr =  this.rows.length;
	console.log('MALLA nr '+nr);
   for (var i=0;i<nr;i++){
 		var tr = new Element('tr');
		var td0 = new Element('td').update(this.rows[i].get('tag'));
		tr.appendChild(td0);
 		tMatr.appendChild(tr);
		for (var j=0;j<nh;j++){
			vid = this.cols[j].get('id0')+'.'+ this.rows[i].get('id0');
	 		var td = new Element('td',{id:vid});td.style.border = '1px blue solid';
	 		td.on('click',this.editaCelda.bind(this));
	 		valor = this.buscaValor(vid);
//	 		console.log(vid+' : '+valor);
	      if (guay(valor) && valor == 'SI'){
		      var ok = new Element('i',{id:vid,className:'fa fa-check'}).update('X');
		      ok.style.color ='green';
   	      } 
	      else ok = null;
	 		td.update(ok);
			tr.appendChild(td);
	 		};
   };
	$(div).update(tMatr);
}
})
  
//=================================================================== Edit Nodo


function getNodoMask(id0,id1,num,geo,tau,cod,tag,etc,txt){
   var mask = getNodoStd(cod,tag,etc,txt);
   mask.set('id0',id0);
   mask.set('id1',id1);
   mask.set('num',num);
   mask.set('geo',geo);
   mask.set('tau',tau);
   return mask;
}

function clickBtnEditNodo(boton){
	var nodo = frm2nodo('frmEdNodo',true);
	var topol = boton.get('topol');
	var func = boton.get('func');
	func(nodo,topol);
}

function frm2nodo(frmId,reset){
	var nodo = getNodoStd();
	var frm = $(frmId);

	nodo.set('id0',frm.id0.value);
	nodo.set('id1',frm.id1.value);
	nodo.set('num',frm.num.value);
	nodo.set('geo',frm.geo.value);
	nodo.set('tau',frm.tau.value);
	nodo.set('cod',frm.cod.value || 'NdN');
	nodo.set('tag',frm.tag.value || 'NdN');
	nodo.set('etc',frm.etc.value || 'NdN');
	nodo.set('txt',frm.txt.value || 'NdN');

	if (reset) hideModal();

	return nodo;
}

function nodo2frm(frmId,nodo){
	var frm = $(frmId);
	frm.id0.value = nodo.get('id0');
	frm.id1.value = nodo.get('id1');
	frm.num.value = nodo.get('num');
	frm.geo.value = nodo.get('geo');
	frm.tau.value = nodo.get('tau');
	frm.cod.value = (nodo.get('cod') == 'NdN') ? '' : nodo.get('cod');
	frm.tag.value = (nodo.get('tag') == 'NdN') ? '' : nodo.get('tag');
	frm.etc.value = (nodo.get('etc') == 'NdN') ? '' : nodo.get('etc');
	frm.txt.value = (nodo.get('txt') == 'NdN') ? '' : nodo.get('txt');
}

//=================================================================== Editor Nodos
var retoEditNodo = Class.create({
initialize : function(titulo,nodo,mask,botones,topol){
	this.titulo = titulo;
	this.nodo = nodo;
	this.mask = mask;
	this.botones = botones;
	this.dialog = '';
	this.topol = topol;
	this.creaCampos();
},
creaHeader : function(mh){
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update(this.titulo);
               mh.appendChild(h4);
},
creaBody : function(mb){
   var mskId0 = parseInt(this.mask.get('id0'));
   var mskId1 = parseInt(this.mask.get('id1'));
   var mskNum = parseInt(this.mask.get('num'));
   var mskGeo = this.mask.get('geo');
   var mskTau = this.mask.get('tau');
   var mskCod = this.mask.get('cod');
   var mskTag = this.mask.get('tag');
   var mskEtc = this.mask.get('etc');
   var mskTxt = this.mask.get('txt');
   
	var frm = new Element('form',{id:'frmEdNodo'});
	if (mskId0)	var iId0 = new Element('input',{name:'id0',type:'text',placeholder:'Id0', className:'form-control'});
   else var iId0 = new Element('input',{name:'id0',type:'hidden'});

	if (mskId1)	var iId1 = new Element('input',{name:'id1',type:'text',placeholder:'Id1', className:'form-control'});
   else var iId1 = new Element('input',{name:'id1',type:'hidden'});

	if (mskNum)	var iNum = new Element('input',{name:'num',type:'text',placeholder:'Num', className:'form-control'});
   else	var iNum = new Element('input',{name:'num',type:'hidden'});
   
	if (mskGeo != 'NdN')	var iGeo = new Element('input',{name:'geo',type:'text',placeholder:mskGeo, className:'form-control'});
   else	var iGeo = new Element('input',{name:'geo',type:'hidden'});

	if (mskTau != 'NdN')	var iTau = new Element('input',{name:'tau',type:'text',placeholder:mskTau, className:'form-control'});
   else	var iTau = new Element('input',{name:'tau',type:'hidden'});

	if (mskCod != 'NdN')	var iCod = new Element('input',{name:'cod',type:'text',placeholder:mskCod, className:'form-control'});
   else	var iCod = new Element('input',{name:'cod',type:'hidden'});

	if (mskTag != 'NdN')	var iTag = new Element('input',{name:'tag',type:'text',placeholder:mskTag, className:'form-control'});
   else var iTag = new Element('input',{name:'tag',type:'hidden'});

	if (mskEtc != 'NdN')	var iEtc = new Element('input',{name:'etc',type:'text',placeholder:mskEtc, className:'form-control'});
   else	var iEtc = new Element('input',{name:'etc',type:'hidden'});

	if (mskTxt != 'NdN') var iTxt = new Element('textarea',{name:'txt', rows:'5',placeholder:mskTxt,className:'form-control'});
   else	var iTxt = new Element('input',{name:'txt',type:'hidden'});

	frm.appendChild(iId0);
	frm.appendChild(iId1);
	frm.appendChild(iNum);
	frm.appendChild(iGeo);
	frm.appendChild(iTau);
	frm.appendChild(iCod);
	frm.appendChild(iCod);
	frm.appendChild(iTag);
	frm.appendChild(iEtc);
	frm.appendChild(iTxt); 

	frm.id0.value = this.nodo.get('id0');
	frm.id1.value = this.nodo.get('id1');
	frm.num.value = this.nodo.get('num');
	frm.geo.value = this.nodo.get('geo');
	frm.tau.value = this.nodo.get('tau');
	frm.cod.value = (this.nodo.get('cod') == 'NdN') ? '' : this.nodo.get('cod');
	frm.tag.value = (this.nodo.get('tag') == 'NdN') ? '' : this.nodo.get('tag');
	frm.etc.value = (this.nodo.get('etc') == 'NdN') ? '' : this.nodo.get('etc');
	frm.txt.value = (this.nodo.get('txt') == 'NdN') ? '' : this.nodo.get('txt');

    mb.appendChild(frm);

},
creaFooter : function(mf){
	this.botones.each(function(boton){
		var i = new Element('i',{className : boton.get('icoFA')});
		var btn = new Element('button',{className : boton.get('clase')}).update(i);
		btn.observe('click',function(){clickBtnEditNodo(boton);})
		mf.appendChild(btn);
	})
},
creaCampos : function(){
	this.dialog = new Element('div',{className :'modal-dialog'});
	var mc = new Element('div',{className:'modal-content'});
	var mh = new Element('div',{className:'modal-header'}); this.creaHeader(mh);
	var mb = new Element('div',{className:'modal-body'});this.creaBody(mb);
	var mf = new Element('div',{className:'modal-footer'});this.creaFooter(mf);
	mc.appendChild(mh);
	mc.appendChild(mb);
	mc.appendChild(mf);
	this.dialog.appendChild(mc);

},
show : function(){
	return this.dialog;
}
})

//------------------------------------------------------------------- Generación Botones Editor
function getBtnTxt(tag,clase,func,topol){
	var btn = getNodoStd('TEXTO',tag,clase,'javascript:'+ func);
	btn.set('topol',topol)
	return btn;
}
function getBtnIcon(cod,clase,func,topol){
	var btn = getNodoStd('fa fa-'+cod,cod,clase,'javascript:'+ func);
	btn.set('topol',topol)
	return btn;
}

function getBtnFA(ico,clase,func,topol){
	var btn = new Hash();
	btn.set('icoFA','fa fa-'+ico);
	btn.set('clase',clase);
	btn.set('func',func);
	btn.set('topol',topol)
	return btn;
}

function getBtnFA_OK(fn,topol){var btn = getBtnFA('check','btn btn-success',fn,topol); return btn;}
function getBtnFA_KO(fn,topol){var btn = getBtnFA('close','btn btn-warning',fn,topol); return btn;}
function getBtnFA_Hijo(fn,topol){var btn = getBtnFA('child','btn btn-info',fn,topol); return btn;}
function getBtnFA_Borra(fn,topol){var btn = getBtnFA('trash','btn btn-info',fn,topol); return btn;}
function getBtnFA_Sube(fn,topol){var btn = getBtnFA('arrow-up','btn btn-info',fn,topol); return btn;}
function getBtnFA_Baja(fn,topol){var btn = getBtnFA('arrow-down','btn btn-info',fn,topol); return btn;}
function getBtnFA_Tree(fn,topol){var btn = getBtnFA('tree','btn btn-info',fn,topol); return btn;}
function getBtnFA_Link(fn,topol){var btn = getBtnFA('link','btn btn-info',fn,topol); return btn;}

function getBtnsFA_OK_KO(fOK,topol){
	var nodos = new Array();
	var ok = getBtnFA_OK(fOK,topol);
	var ko = getBtnFA_KO('hideModal()',topol);
	nodos.push(ok);
	nodos.push(ko);
	return nodos;
}

//------------------------------------------------------------------- Sets de Botones STD
function getBtns_OK_KO(icono,fOK,topol){
	var nodos = new Array();
	if (icono){
		var ok = getBtnIcon('check','btn btn-success',fOK,topol);
		var ko = getBtnIcon('close','btn btn-warning','hideModal()',topol);
	}
	else {
		var ok = getBtnTxt('OK','btn btn-success',fOK);
		var ko = getBtnTxt('KO','btn btn-danger','hideModal()');
	}
	nodos.push(ok);
	nodos.push(ko);
	return nodos;
}

function getBtnsArbolStd(topol){
	var nodos = new Array();
	var borra = getBtnIcon('trash','btn btn-danger','borraNodoArbol("frmEdNodo")',topol);
	var sube =  getBtnIcon('arrow-up','btn btn-info','subeNodoArbol("frmEdNodo")',topol);
	var baja =  getBtnIcon('arrow-down','btn btn-info','bajaNodoArbol("frmEdNodo")',topol);
	var hijo =  getBtnIcon('child','btn btn-info','hijoNodoArbol("frmEdNodo")');

	var copia =  getBtnIcon('tree'  ,'btn btn-primary','copyRamaNodo("frmEdNodo")',topol);
	var pegar =  getBtnIcon('chain' ,'btn btn-primary','pegaRamaNodo("frmEdNodo")',topol);
	var ancla =  getBtnIcon('anchor','btn btn-primary','creaNodoAncla("frmEdNodo")',topol);
	nodos.push(copia);
	nodos.push(pegar);
	nodos.push(ancla);

	nodos.push(borra);
	nodos.push(sube);
	nodos.push(baja);
	nodos.push(hijo);
	var OKKO = getBtns_OK_KO(true,'grabaNodoArbol("frmEdNodo")',topol)
	var todo = nodos.concat(OKKO);
	return todo;
}

function getBtnsRamaArbol(){
	var nodos = new Array();
	var copia =  getBtnIcon('tree'  ,'btn btn-primary','copyRamaNodo("frmEdNodo")');
	var pegar =  getBtnIcon('chain' ,'btn btn-primary','pegaRamaNodo("frmEdNodo")');
	var ancla =  getBtnIcon('anchor','btn btn-primary','creaNodoAncla("frmEdNodo")');
	nodos.push(copia);
	nodos.push(pegar);
	nodos.push(ancla);
	var OKKO = getBtns_OK_KO(true,'grabaNodoArbol("frmEdNodo")')
	var todo = nodos.concat(OKKO);
	return todo;
}

