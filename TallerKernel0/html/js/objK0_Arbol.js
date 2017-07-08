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
