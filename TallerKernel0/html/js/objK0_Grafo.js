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
