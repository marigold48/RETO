vgRama = {
	laRama  : '',
	nomRama : '',
	numRamas: 0,
	anclas : '',
	triggerPostMontaje : ''
}


function copyRamaNodo(frmId){
	var nodo = frm2nodo(frmId,true);
	var orig = vgArbol.alias.getNodoById(nodo.get('id0'));
	var padre = vgArbol.alias.getNodoById(nodo.get('id1'));
	var nombre = padre.get('tag');
	var rama = new Array();
	vgArbol.alias.getRamaNodo(orig,rama);
	var nodo0 = getNodoZero(nombre,'ARBOL');
	nodo0.set('id0',padre.get('id0'));
	var nodos = new Array();
	nodos.push(nodo0);
	var todos = nodos.concat(rama);
	optimizaNodosArbol(todos);
	vgRama.laRama = new retoArbol(todos,showNodosArbol)
	swapArbol(frmId);
}


function pegaRamaNodo(frmId){
	var nodo = frm2nodo(frmId,true);
	var id0 = parseInt(nodo.get('id0'));
	var rama = vgRama.laRama.getNodos();
	vgArbol.alias.pegaRamaNodo(nodo,rama);
	vgArbol.alias.show('divBase');
}


//------------------------------------------------------------------- Crea un Ancla a otro nodo
function addNodoRama(id0){
	var nodo = vgArbol.alias.getNodoById(id0);

	var lst = $('frmListaRamas').mlista;
	var id0Rama = lst.value;
	var tagRama = lst.options[lst.selectedIndex].text;

	var ancla = getNodoNuevo(tagRama);
	ancla.set('cod','_ancla');
	ancla.set('etc',tagRama+'::'+id0Rama);
	vgArbol.alias.addNodoHijo(nodo,ancla);
	vgArbol.alias.show('divBase');
	hideModal();
	hideModal();
}


function postQueryRamas(lista){
	console.log(lista.length + ' ramas');
	var nodo = frm2nodo('frmEdNodo',false);
	var id0 = nodo.get('id0');
	console.log('id0 nodo: '+id0);
	var frm = creaFormListaRamas(id0,lista);
	var modal = new retoModal(frm);
}

function creaNodoAncla(frmId){
	var nodo = frm2nodo(frmId,false);
	var param = getParamsAncla(nodo); // esta función debe existir en el .js de la página
	queryArbol(param,postQueryRamas);
}
//------------------------------------------------------------------- Swap entre arbol y rama (btn eliminado)
function swapArbol(frmId){
	var aux = vgRama.laRama;
	vgRama.laRama = vgArbol.alias;
	vgArbol.alias = aux;
	if (aux){
		$(frmId).nombre.value = vgRama.nomRama;
		vgRama.nomRama = vgRama.nomTree;
		vgRama.nomTree = $(frmId).nombre.value;
		vgArbol.alias.show('divBase');
	}
	else {
		vgRama.nomRama = vgRama.nomTree;
		$(frmId).nombre.value = '';
		$('divBase').update();
	}

}

//------------------------------------------------------------------- Montaje Arbol
function buscaNodosAncla(nodos){
	var tag0 = nodos[0].get('tag');
	console.log('Num anclas: '+ vgRama.anclas.length + 'Num Nodos: '+nodos.length);
	vgRama.anclas.each(function(ancla,ix){
		var tagA = ancla.get('etc').split('::')[0];
		console.log(tag0+':'+tagA);
		if (tagA == tag0){
			console.log('Ancla: ' + ancla.values().join('|'));
			var nodosOK = cambiaIdsArbol(nodos); // Ya incluye la optimización de los nodos

/*
			vgRama.laRama = new retoArbol(nodosOK,showNodosArbolTraza);
			vgRama.laRama.expandAll();
try{
			vgRama.laRama.show('divBase');
} catch(e){alert(e.message);}
			alert('Rama cargada');
*/
			vgArbol.alias.pegaRamaNodo(ancla,nodosOK);
			vgArbol.alias.show('divBase');

			vgRama.anclas.splice(ix,1);
			return false;

		}
	})
}

function postCargaRama(nodos){
	vgRama.numRamas--;
	console.log('postCarga Rama: ' + vgRama.numRamas);
	buscaNodosAncla(nodos);

	nodos.each(function(nodo){
		var cod = nodo.get('cod');
		if (cod == '_ancla'){
			vgRama.anclas.push(nodo);
			cargaRama(nodo);
		} 
	})

	if (!vgRama.numRamas) {
		console.log ('ramas OK');
		vgRama.triggerPostMontaje();
	};
}

function cargaRama(ancla){
	console.log('Montando: ' + ancla.get('tag'));
	var param = getParamsAncla(ancla); // esta función debe existir en el .js de la página
	var idRama = ancla.get('etc').split('::')[1];
	param.set('id0',idRama);
	vgRama.numRamas++;
	console.log('Num Ramas: '+ vgRama.numRamas)

	cargaArbol(param,postCargaRama);
}


function montaRamasArbol(){
	vgRama.numRamas = 0;
	vgRama.anclas = new Array();
	var nodos = vgArbol.alias.getNodos();
	nodos.each(function(nodo){
		var cod = nodo.get('cod');
		if (cod == '_ancla'){
			vgRama.anclas.push(nodo);
			cargaRama(nodo);
		} 
	})
	if (!vgRama.anclas.length) {
//		alert ('ramas OK');
		vgRama.triggerPostMontaje();
	}
}
