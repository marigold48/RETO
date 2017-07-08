/*
Algoritmo:
Cuando se selecciona una opción, se busca en el stack el ixP : nodo.id1=padre.id0,
y se borran todos los select por debajo de él.
Luego se añade al stack el id0 del seleccionado.
*/


var retoMList = Class.create({
initialize : function (nodos,divBase){
	this.arbol = new retoArbol(nodos,'','');
	this.divBase = divBase;
	this.nivel = 0;
	this.stack = new Array();
	this.toolBar = '';
	this.prefix = '';
	this.divMList = '';
},
getStack : function(){
	return this.stack;
},
getCodsStack : function(){
	var nodo, str = '';
	var n = this.stack.length;
	for (var i=1;i<n;i++){
		nodo = this.arbol.getNodoById(this.stack[i]);
		str += nodo.get('cod')+'::';
	}
	str += nodo.get('etc');
	return str;
},
nextSelect : function (ev){
	var id0KO, selKO;
	var el = ev.element();
	var id0 = el.id.split('_')[1];
	var nodo = this.arbol.getNodoById(id0);
	console.log(nodo.get('tag')+':'+'nextSelect');
	var ixP = this.stack.indexOf(nodo.get('id1'));
	var n = this.stack.length;
	for (var i=ixP+1;i<n;i++){
		id0KO = this.stack[i];
		selKO = $('SEL_'+id0KO);
		if (selKO) this.divMList.removeChild(selKO);
		}
	this.stack.splice(ixP+1,n+1);
	this.addSelect(this.divMList,nodo);
},
creaSelect : function (nodo){
	var opc, id0,cod,tag;
	var opcs = nodo.get('hijos');
	var n = opcs.length;
	if (!n) return null;

	var select = new Element('select',{id:'SEL_'+nodo.get('id0')});
	select.style.display = 'block';
	select.style.width = '150px';
	for (var i=0;i<n;i++){
		opc = this.arbol.getNodoById(opcs[i]);
		id0 = opc.get('id0');
		cod = opc.get('cod');
		tag = opc.get('tag');
		option = new Element('option',{id:'OPT_'+id0,value:cod}).update(tag);
		option.on('click',this.nextSelect.bind(this));
		select.appendChild(option);
		}
	return select;
},
addSelect : function(div,nodo){
	this.stack.push(nodo.get('id0'));
	if (this.nivel > 9 ) return;
	var combo = this.creaSelect(nodo);
	if (combo){
		this.level++;
		div.appendChild(combo);
		var h1 = nodo.get('hijos')[0];
		var nodox = this.arbol.getNodoById(h1);
		if (nodox) this.addSelect(div,nodox);
		}
	console.log(this.stack.join(':'));
},
getMList : function(){
	this.level = 0;
	this.stack = new Array();
	this.divMList = new Element('div',{id:'divMList'});
	var raiz = this.arbol.getRaiz();
	this.addSelect(this.divMList,raiz);
	return this.divMList;
}
})
