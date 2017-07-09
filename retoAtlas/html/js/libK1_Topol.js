/*===================================================================
libK0_Topol.js
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

