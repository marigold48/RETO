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
