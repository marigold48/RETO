var vgArbol = {
	alias : '', //se usa para edición estandar
	divShow : '',
	triggerPostQuery :'',
	triggerPostCarga :'',
	triggerPostGraba :'',
	nivelTop : [0,0,0,0,0,0,0,0],
	nivelTOL : new Hash()
}
function resetTOL(){
	vgArbol.nivelTop = [0,0,0,0,0,0,0,0];
}
function expandeNodoArbol(id){
	var nodo = vgArbol.alias.getNodoById(id);
	nodo.set('stat','EXPAN');
	vgArbol.alias.show(divBase);
}
function colapsaNodoArbol(id){
	var nodo = vgArbol.alias.getNodoById(id);
	nodo.set('stat','COLAP');
	vgArbol.alias.show(divBase);
}

function editNodoArbol(id){
	var nodo = vgArbol.alias.getNodoById(id);
	var botones = getBtnsArbolStd();
	var editor = new retoEditNodo('Editor Nodo Arbol',nodo,'',botones);
	var modal = new retoModal(editor.show());
	nodo2frm('frmEdNodo',nodo);
}

function showNodosArbolTraza(nodo,divBase,nivel){
//	try {console.log(nodo.values().join('|'));}catch(e){console.log(e.message);}
}


function initCanvasTOL(){
	vgArbol.canvas = new Element('canvas');
	vgArbol.canvas.id = 'canvas1';
	vgArbol.canvas.style.width = divCanvas.scrollWidth+'px';
	vgArbol.canvas.style.height = divCanvas.scrollHeight+'px';

	vgArbol.canvas.width = divCanvas.scrollWidth;
	vgArbol.canvas.height = divCanvas.scrollHeight;
	vgArbol.canvas.style.overflow = 'visible';
	vgArbol.canvas.style.position = 'absolute';
	vgArbol.canvas.style.zOrden = 1;
	
	$('divCanvas').update(vgArbol.canvas);
	vgArbol.cntxt = vgArbol.canvas.getContext("2d");
	vgArbol.cntxt.strokeStyle='blue';
	console.log('canvas OK');
}
function pintaLineaTOL(x0,y0,x1,y1){

 	vgArbol.cntxt.beginPath();
	vgArbol.cntxt.moveTo(x0+0.5,y0+0.5);
	vgArbol.cntxt.lineTo(x1+0.5,y1+0.5);
	vgArbol.cntxt.stroke();
	vgArbol.cntxt.closePath();

}

function showNodosArbolTOL(nodo,divBase,nivel){
	try{
	var n = nivel;
	var leftTOL = 0; if (nivel) leftTOL = nivel*150 - 30;

	var num = parseInt(nodo.get('num')) - 1;
	if (nodo.get('stat') == 'FULLA') nivel = 6;

	var topTOL = vgArbol.nivelTop[nivel] * 35;
	var divNodo = new Element('div',{id : ''+nodo.get('id0'),className:'button-group'});
	divNodo.style.position = 'absolute';
	divNodo.style.left = (nivel*150)+'px';
	divNodo.style.top = (100+topTOL)+'px';
	var a = new Element('a',{className: 'btn btn-default', href:'javascript:editNodoArbol('+nodo.get('id0')+')'}).update(nodo.get('tag'));
	divNodo.appendChild(a);
	$(divBase).appendChild(divNodo);

// Pinta lineas estilo Tree Of Life (TOL)

	if (nivel) {
		var id = ''+nodo.get('id1');
		var offset = parseInt($(id).style.top.split('px')[0]);
		console.log(nodo.get('tag')+':'+offset);
		}

	if (nivel == 6 ){
		for (var i=0;i<nivel+1;i++)	vgArbol.nivelTop[i]++;
		pintaLineaTOL(leftTOL,topTOL+35,900,topTOL+35);
		} 
	else {
		pintaLineaTOL(leftTOL,topTOL+35,leftTOL+150,topTOL+35);
	}	

	if  (nivel && num) pintaLineaTOL(leftTOL,topTOL+35,leftTOL,offset-65);



} catch(e){alert(e.message);}
}

function showNodosArbolSTD(nodo,divBase,nivel){

	var i,ctl,a;
	var divNodo = new Element('div',{className:'button-group'});
	divNodo.style.marginLeft = (nivel*30)+'px';
	divNodo.style.marginTop = '8px';

	var status = nodo.get('stat');
	switch (status){
		case 'EXPAN':
			i = new Element('i',{className:'fa fa-plus'});
			ctl = new Element('a',{className: 'btn', href:'javascript:colapsaNodoArbol('+nodo.get('id0')+')'}).update(i);
			a = new Element('a',{className: 'btn btn-primary', href:'javascript:editNodoArbol('+nodo.get('id0')+')'}).update(nodo.get('tag'));
			break;
		case 'COLAP':
			i = new Element('i',{className:'fa fa-minus'});
			ctl = new Element('a',{className: 'btn', href:'javascript:expandeNodoArbol('+nodo.get('id0')+')'}).update(i);
			a = new Element('a',{className: 'btn btn-info', href:'javascript:editNodoArbol('+nodo.get('id0')+')'}).update(nodo.get('tag'));
			break;
		case 'FULLA':
			if (nodo.get('cod') == '_ancla'){
				i = new Element('i',{className:'fa fa-anchor'});
				ctl = new Element('a',{className: 'btn', href:'javascript:cargaRamaNodo('+nodo.get('id0')+')'}).update(i);
			}
			else {
				i = new Element('i',{className:'fa fa-leaf'});
				ctl = new Element('span',{className: 'btn'}).update(i);
			}
			a = new Element('a',{className: 'btn btn-success', href:'javascript:editNodoArbol('+nodo.get('id0')+')'}).update(nodo.get('tag'));
			break;
	} 
	divNodo.appendChild(ctl);
	divNodo.appendChild(a);
	$(divBase).appendChild(divNodo);
}


function addNodoArbol(tag){
	try{
	var padre = vgArbol.alias.getRaiz();
	var nodo = getNodoNuevo(tag||'Nuevo');
	nodo.set('hijos',new Array());
	nodo.set('stat','FULLA');
	console.log('addNodoArbol '+nodo.get('tag'))
	vgArbol.alias.addNodoHijo(padre,nodo);
	vgArbol.alias.show('divBase');
	return parseInt(nodo.get('id0'));
	} catch(e){alert(e.message);}
}

function hijoNodoArbol(frmId){
	var padre = frm2nodo(frmId,true);
	var nodo = getNodoNuevo('Nuevo hijo');
	nodo.set('hijos',new Array());
	nodo.set('stat','FULLA');
	console.log('hijoNodoArbol '+nodo.get('tag'))
	vgArbol.alias.addNodoHijo(padre,nodo);
	vgArbol.alias.show('divBase');
}

function grabaNodoArbol(frmId){
	var nodo = frm2nodo(frmId,true);
	vgArbol.alias.updtNodoSelf(nodo);
	vgArbol.alias.show('divBase');
}
function borraNodoArbol(frmId){
	var nodo = frm2nodo(frmId,true);
	vgArbol.alias.borraNodoSelf(nodo);
	vgArbol.alias.show('divBase');
}

function subeNodoArbol(frmId){
	var nodo = frm2nodo(frmId,false);
	vgArbol.alias.subeNodoSelf(nodo);
	vgArbol.alias.show('divBase');
}

function bajaNodoArbol(frmId){
	var nodo = frm2nodo(frmId,false);
	vgArbol.alias.bajaNodoSelf(nodo);
	vgArbol.alias.show('divBase');
}




//------------------------------------------------------------------- Carga Cesto Mongo
function ecoCargaArbol(resp){
	var nodo, txt;
	var lins = resp.responseText.split('\n');
	var strNodos = lins[2];
	var hNodos = JSON.parse(strNodos);
	var nodos = new Array();
	hNodos.nodos.each(function(nodox){
		nodo = $H(nodox);
		nodo.set('id0',parseInt(nodo.get('id0')));
		nodo.set('id1',parseInt(nodo.get('id1')));
		restauraNodo(nodo); // en comun.js, para tratar etc y txt
		nodos.push(nodo);
	})
	vgArbol.triggerPostCarga(nodos);
}

function cargaArbol(param,fpost){
	vgArbol.triggerPostCarga = fpost;
	vgMongo.tipoT = 'ARBOL';
	vgMongo.dbase = param.get('dbase');
	vgMongo.maskT = param.get('mask');
	vgMongo.idDoc = param.get('id0');
	vgMongo.fPostCarga = ecoCargaArbol;
	cargaTopol();
}

function cargaArbolByNom(param,fpost){
	vgArbol.triggerPostCarga = fpost;
	vgMongo.dbase = param.get('dbase');
	vgMongo.tipoT = param.get('tipo');
	vgMongo.maskT = '.arbol';
	vgMongo.nombre = param.get('nombre');
	vgMongo.fPostCarga = ecoCargaArbol;
	cargaTopolByNom();
}


function ecoQueryArbol(resp){
	var lista = new Array();
	var lineas = resp.responseText.split('\n');
	var n = lineas.length;
	for (var i=2;i<n-3;i++){
		var str = lineas[i];
		var item = JSON.parse(str);
		lista.push(item);
	}
	vgArbol.triggerPostQuery(lista);
}

function queryArbol(param,fpost){
	vgArbol.triggerPostQuery = fpost;
	vgMongo.tipoT = param.get('tipo');
	vgMongo.dbase = param.get('dbase');
	vgMongo.maskT = '.arbol';
	vgMongo.fPostQuery = ecoQueryArbol;
	queryTopol();
}
//------------------------------------------------------------------- Graba Arbol
function ecoGrabaArbol(resp){
	console.log('ecoGrabaArbol '+resp.responseText);
}

function grabaArbol(param,fpost){
	vgArbol.triggerPostCarga = fpost;
	vgMongo.maskT = '.arbol';
	vgMongo.dbase = param.get('dbase');
	vgMongo.tipoT = param.get('tipo');
	vgMongo.idDoc = param.get('id0');
	vgMongo.nombre = param.get('nombre');
	vgMongo.fPostGraba = ecoGrabaArbol;
	var nodos = vgArbol.alias.getNodos();
	grabaTopol(nodos);
}

function ecoBorraArbol(resp){
	console.log('ecoBorraArbol '+resp.responseText);
}

function borraArbol(param){
	vgMongo.maskT = '.arbol';
	vgMongo.dbase = param.get('dbase');
	vgMongo.tipoT = param.get('tipo');
	vgMongo.idDoc = param.get('id0');
	vgMongo.fPostBorra = ecoBorraArbol;
	borraTopol();

}