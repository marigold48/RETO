// GrFSM es un Grafo que funciona como una Máquina de Estados Finitos (FSM)
// No tiene funciones de edición, porque no se visualiza.
var retoGrFSM = Class.create({
initialize : function(nodos,arcos,f){
	this.nodos = nodos;
	this.arcos = arcos;
	this.state = '';
	this.iNodos = new Array();
	this.kNodos = new Array();
	this.iArcos = new Array();
	this.fnShow = f;
	this.optimizaNodos();
	this.optimizaArcos();
},
optimizaNodos : function(){
	this.iNodos = new Array();
	var n = this.nodos.length;
	for (var i=0;i<n;i++){ 
		this.iNodos.push(parseInt(this.nodos[i].get('id0')));
		this.kNodos.push(this.nodos[i].get('cod'));
	};
},
optimizaArcosSimple : function(){
	this.iArcos = new Array();
	var n = this.arcos.length;
	for (var i=0;i<n;i++) this.iArcos.push(parseInt(this.arcos[i].get('id0')));
	console.log(this.iArcos.join('|'));
},
optimizaArcos : function(){
   console.log(this.iNodos.join('|'));
	var arcos = new Array();
	var n = this.arcos.length;
	for (var i=0;i<n;i++){
		arco = this.arcos[i];
		id0 = parseInt(arco.get('id0'));
		id1 = parseInt(arco.get('id1'));
		
		id0 ^= id1; 
		id0 -= 111;
		
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
getNumArcos : function(){
   return this.arcos.length;
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
getNodoByCod : function(cod){
	var ix = this.kNodos.indexOf(cod);
	console.log('cod/ix nodo: '+cod+'/'+ix);
	var nodo = this.nodos[ix];
	return nodo;
},
getArcoById : function(id){
	var ix = this.iArcos.indexOf(parseInt(id));
	console.log('id/ix nodo: '+id+'/'+ix);
	var arco = this.arcos[ix];
	return arco;
},
getArcosSal : function (nodo){
	var idNodo = parseInt(nodo.get('id0'));
	var ixNodo = this.iNodos.indexOf(idNodo);

	var arcosSal = new Array();
	this.arcos.each(function(arco){
		if (parseInt(arco.get('nodoI')) == ixNodo) arcosSal.push(arco);
	})
	return arcosSal;
},
getArcosEnt : function (nodo){
	var idNodo = parseInt(nodo.get('id0'));
	var ixNodo = this.nodos.indexOf(idNodo);
	
	var arcosEnt = new Array();
	this.arcos.each(function(arco){
		if (arco.get('nodoF') == ixNodo) arcosEnt.push(arco);
	})
	return arcosEnt;
},
changeState(arcoId){
	var ixArco = this.iArcos.indexOf(arcoId);
	var ixNodo = this.arcos[ix].get('nodoF');
	var nodo = this.nodos[ixNodo];
	this.state = nodo.get('cod');
},
setState : function(state){
	this.state = state;
},
getState : function(){
	return this.state;
},
show : function(divBase){
	var nodo = this.getNodoByCod(this.state);
	var arcos = this.getArcosSal(nodo);
	var frm = new Element('form');
	var i = new Element('input',{type:'text',value:nodo.get('tag')});
	frm.appendChild(i);
	var N = arcos.length;
	for (i=0;i<N;i++){
		var arco = arcos[i];
      var btn = new Element('button',{type:"button", id:arco.get('id0'),className:"btn btn-success"}).update(arco.get('tag'));
		btn.onclick = this.fnShow.bind(this);
		frm.appendChild(btn);
	}
	$('divBase').update(frm);
}
})
