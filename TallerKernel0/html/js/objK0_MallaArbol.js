// El modelo topológico es un grafo, con dos tipos de nodos :
// Lista COLS : Origina los encabezados de columna. {id1} = 1
// Lista ROWS : Origina los encabezados de fila. {id1} = 2
// Lista CELLS : Origina las celdas de la matriz sparse. {id1} = 1234567
// Son ARCOS de Row->Col | Col -> Row

var retoMallaArbol = Class.create({
  initialize : function (grafo){
		this.grafo  = grafo;
      this.celdas = new Hash();
      this.optimizaNodos();
},
optimizaNodos : function(){
	var arcos = this.grafo.getArcos();
   var n = arcos.length;
   for (var i=0;i<n;i++){
		var ixI = arcos[i].get('nodoI');
    	var ixF = arcos[i].get('nodoF');
		this.celdas.set(ixI+'.'+ixF,'SI');
   }
   console.log(this.celdas.length);
},
getNodos : function(){
   var nodos = new Array();
   nodos.push(this.nodo0);
   nodos = nodos.concat(this.cols);
   nodos = nodos.concat(this.rows);
   nodos = nodos.concat(this.cells);
   return nodos;
},
buscaValor : function (tdId){
	return this.celdas.get(tdId);
},
borraCell :function (idCell){
   var n = this.cells.length;
   console.log('Cells: '+n);
   for (var i=0;i<n;i++){
      var cell = this.cells[i];
      var idx = parseInt(cell.get('id0'));
      var id1 = parseInt(cell.get('id1'));
      var id0 = idArc2id0(idx,id1);
      console.log(idCell+'::'+id0+'.'+id1);
      
      if (idCell == (''+id0+'.'+id1)){
         this.cells.splice(i,1);
         return false;
         }
   }

},
editaCelda : function (ev){
	var idCell = ev.element().id;
	console.log('Edit '+idCell);
	var valor = this.buscaValor(idCell);
	if (!valor){
	   var cell = getNodoStd('','Celda');
	   cell.set('geo','CELL');
	   var id0 = parseInt(idCell.split('.')[0]);
	   var id1 = parseInt(idCell.split('.')[1]);
	   var idx = id02idArc(id0,id1);
	   cell.set('id0', id0);
	   cell.set('id1', id1);
	   this.cells.push(cell);
	   this.
		var ok = new Element('i',{id:idCell,className:'fa fa-check'}).update('X');
		ok.style.color ='green';
		$(idCell).update(ok);
		this.celdas.set(idCell,'SI');
	} 
	else {
	   this.borraCell(idCell);
		this.celdas.unset(idCell);
		$(idCell).update('');
	} 
},
show : function (div){
	var tMatr = new Element('table');tMatr.style.border = '1px blue solid';
	var tBody = new Element('tbody',{});
	var th0 = new Element('th').update('');
	tMatr.appendChild(th0);
	
   var nh = this.cols.length;
	console.log('MALLA nh '+nh);
   for (var i=0;i<nh;i++){
 		var th = new Element('th').update(this.cols[i].get('tag'));
		tMatr.appendChild(th);
 		};
 	
   var nr =  this.rows.length;
	console.log('MALLA nr '+nr);
   for (var i=0;i<nr;i++){
 		var tr = new Element('tr');
		var td0 = new Element('td').update(this.rows[i].get('tag'));
		tr.appendChild(td0);
 		tMatr.appendChild(tr);
		for (var j=0;j<nh;j++){
			vid = this.cols[j].get('id0')+'.'+ this.rows[i].get('id0');
	 		var td = new Element('td',{id:vid});td.style.border = '1px blue solid';
	 		td.on('click',this.editaCelda.bind(this));
	 		valor = this.buscaValor(vid);
//	 		console.log(vid+' : '+valor);
	      if (guay(valor) && valor == 'SI'){
		      var ok = new Element('i',{id:vid,className:'fa fa-check'}).update('X');
		      ok.style.color ='green';
   	      } 
	      else ok = null;
	 		td.update(ok);
			tr.appendChild(td);
	 		};
   };
	$(div).update(tMatr);
}
})
  

