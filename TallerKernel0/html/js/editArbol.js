vgEdArb = {
	elForm  : '',
	elArbol : ''
}
//------------------------------------------------------------------- Nuevo Arbol

function hookNuevoArbol(){
	var nodo0 = getNodoZero('Nuevo Arbol','ARBOL');
	var nodos = new Array();
	nodos.push(nodo0);
	optimizaNodosArbol(nodos);
	vgEdArb.elArbol = new retoArbol(nodos,showNodosArbolSTD)
	vgEdArb.elArbol.show('divBase');
	vgArbol.alias = vgEdArb.elArbol;
}

function postBorraArbol(){
	null;
}

function hookBorraArbol(){
	var raiz = vgEdArb.elArbol.getRaiz();
	var param = new Hash();
	param.set('dbase','RETO');
	param.set('colecc','topol');
	param.set('mask','.arbol');
	param.set('id0',raiz.get('id0'));
	borraArbol(param,postBorraArbol);
}

function postGrabaArbol(){
	null;
}

function hookGrabaArbol(){
	var raiz = vgEdArb.elArbol.getRaiz();
	var param = new Hash();
	param.set('dbase','RETO');
	param.set('colecc','topol');
	param.set('tipo',raiz.get('etc'));
	param.set('mask','.arbol');
	param.set('nombre',raiz.get('tag'));
	param.set('id0',raiz.get('id0'));
	grabaArbol(param,postGrabaArbol);
}

function postCargaArbol(nodos){
	
	var nodosOK = optimizaNodosArbol(nodos);
	initCanvasTOL();
	vgEdArb.elArbol = new retoArbol(nodosOK,showNodosArbolTOL)
	vgEdArb.elArbol.expandAll();
	vgEdArb.elArbol.showTOL('divBase');	
	vgArbol.alias = vgEdArb.elArbol;	
}

function hookCargaArbol(id0){
	var param = new Hash();
	param.set('dbase','RETO');
	param.set('colecc','topol');
	param.set('mask','.arbol');
	param.set('id0',id0);

	cargaArbol(param,postCargaArbol);
}

// Se ejecuta con el evento 'change' del select en html
function hookPickArbol(lista){
	var txt = lista.options[lista.selectedIndex].text;
	console.log(lista.value+'::'+txt);
	vgEdArb.elForm.nombre.value = txt;
	hookCargaArbol(lista.value);
}


function postQueryArbols(lista){
	var lst = vgEdArb.elForm.lst;
	lst.update();
	lista.each(function(item){
		var opt = new Element('option');
		opt.value = item.id0;
		opt.text = item.nombre;
		lst.appendChild(opt);

	})
	vgEdArb.idDoc = lst.value;
	vgEdArb.elForm.nombre.value = lst.options[lst.selectedIndex].text;
}

function hookQueryArbols(){
	var param = new Hash();
	param.set('dbase','RETO');
	param.set('colecc','topol');
	param.set('tipo',"{$regex:'.*'}");
	queryArbol(param,postQueryArbols);
}


// Funcion que deb existir para crear nodos ancla
// Recibe el nodo al cual se encha el ancla, para decidir qué parámetros se usan
function getParamsAncla(nodo){
	var param = new Hash();
	param.set('dbase','RETO');
	param.set('colecc','topol');
	param.set('tipo','ARBOL');
	return param;
}
function hookMontaArbol(){
	montaRamasArbol(); //editRamas.js
}

function initEditArbol(frmId){
	vgEdArb.elForm = $(frmId);
	hookQueryArbols();
}

