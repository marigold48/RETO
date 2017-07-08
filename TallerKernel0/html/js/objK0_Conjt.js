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
