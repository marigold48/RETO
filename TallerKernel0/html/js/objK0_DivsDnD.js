//------------------------------------------------------------------- Dimension y Geo
function dim2string(x,y,w,h){
	var geo;
			 if (!w || !h) geo = 'NdN';
	else if (x >=0 && y >=0) geo = w+'x'+h+'+'+x+'+'+y;
	else if (x >=0 && y < 0) geo = w+'x'+h+'+'+x+'-'+(-y);
	else if (x < 0 && y >=0) geo = w+'x'+h+'-'+x+'+'+y;
	else if (x < 0 && y < 0) geo = w+'x'+h+'-'+(-x)+'-'+(-y);

	return geo;
}

function string2dim(geo){
	var geox, nums = '',caso = 0;
	geox = (geo)? geo : 'NdN';
	
	var str = geox.replace(/ /g,'');
	
	if (str == 'NdN') return null;
	else if (str.match(/^\d+[xX]\d+[+]\d+[+]\d+$/)) caso = 1;
	else if (str.match(/^\d+[xX]\d+[+]\d+[-]\d+$/)) caso = 2;
	else if (str.match(/^\d+[xX]\d+[-]\d+[+]\d+$/)) caso = 3;
	else if (str.match(/^\d+[xX]\d+[-]\d+[-]\d+$/)) caso = 4;
	else return null;

	nums = /(\d*)[xX](\d*)[+-](\d*)[+-](\d*)/.exec(str);
	switch (caso){
		case 1: w = parseInt(nums[1]); h = parseInt(nums[2]); x = parseInt(nums[3]); y = parseInt(nums[4]);break;
		case 2: w = parseInt(nums[1]); h = parseInt(nums[2]); x = parseInt(nums[3]); y = -nums[4];break;
		case 3: w = parseInt(nums[1]); h = parseInt(nums[2]); x = -nums[3]; y = parseInt(nums[4]);break;
		case 4: w = parseInt(nums[1]); h = parseInt(nums[2]); x = -nums[3]; y = -nums[4];break;
		}

	var hGeo = new Hash();
	hGeo.set('x',x);
	hGeo.set('y',y);
	hGeo.set('w',w);
	hGeo.set('h',h);
	return hGeo;
}

function pnts2geo(pntI,pntF){
   var x = (pntI.x < pntF.x)? pntI.x : pntF.x;
   var y = (pntI.y < pntF.y)? pntI.y : pntF.y;
   var w = Math.abs(pntI.x - pntF.x);
   var h = Math.abs(pntI.y - pntF.x);
   var geo = w+'x'+h+'+'+x+'+'+y;
   return geo;
}

//------------------------------------------------------------------- GEO
function hash2geoNodo(hGeo){
	var myTemplate = new Template('#{w}x#{h}+#{x}+#{y}');
	var str = myTemplate.evaluate(hGeo);
	var str = str.split('--').join('-');
	var str = str.split('+-').join('-');
	return str;
}

function geoNodo2hash(geo){
	var geox, nums = '',caso = 0;
	(geo)? geox = geo : geox = 'NdN';
	var str = geox.replace(/ /g,'');
	if (str == 'NdN') return null;
	else if (str.match(/^\d+[xX]\d+[+]\d+[+]\d+$/)) caso = 1;
	else if (str.match(/^\d+[xX]\d+[+]\d+[-]\d+$/)) caso = 2;
	else if (str.match(/^\d+[xX]\d+[-]\d+[+]\d+$/)) caso = 3;
	else if (str.match(/^\d+[xX]\d+[-]\d+[-]\d+$/)) caso = 4;
	else return null;

	nums = /(\d*)[xX](\d*)[+-](\d*)[+-](\d*)/.exec(str);
	switch (caso){
		case 1: w = parseInt(nums[1]); h = parseInt(nums[2]); x = parseInt(nums[3]); y = parseInt(nums[4]);break;
		case 2: w = parseInt(nums[1]); h = parseInt(nums[2]); x = parseInt(nums[3]); y = -nums[4];break;
		case 3: w = parseInt(nums[1]); h = parseInt(nums[2]); x = -nums[3]; y = parseInt(nums[4]);break;
		case 4: w = parseInt(nums[1]); h = parseInt(nums[2]); x = -nums[3]; y = -nums[4];break;
		}

	var hGeo = new Hash();
	hGeo.set('x',x);
	hGeo.set('y',y);
	hGeo.set('w',w);
	hGeo.set('h',h);
	return hGeo;
}

function initPosDim(nodos){
	var div,geo;
	nodos.each(function(nodo,ix){
		div = $('drag_'+ix);
		geo = getDivGeo(div);
		nodo.set('geo',geo);
	})
}

//===================================================================
//------------------------------------------------------------------- retoDivsDnD
var retoDivsDnD = Class.create({
initialize : function (nodos,f,divBase){
	this.nodos = nodos;
	this.divBase = divBase;
	this.oDrag = '';
	this.icon = '';
	this.moz = '';
	this.xPnt = 0;
	this.yPnt = 0;
	this.laX = 0;
	this.laY = 0;
	this.grid = 0;
	this.laZ = 100;
	this.layout = '';
	this.myLyt = ''; // new retoLayout
	this.updateGeo = false;
	this.triggerPostDrop = 'null';
	this.fnShow = f;
},
setGrid : function(grid){
   this.grid = grid;
},
setNodos : function(nodos){
   this.nodos = nodos;
},
setIconFA : function(icon){
   this.icon = icon;
},
setTriggerPostDrop : function (strTrigger){
	this.triggerPostDrop = strTrigger;
},
setLayout : function (lyt){
	this.layout = lyt;
},
setUpdtGeo : function (modo){
	this.updateGeo = modo;
},
getObjDrag : function (){
	return this.oDrag;
},
getDivGeo : function (div){
	var geo;
	var lyt = div.getLayout();
	var x = lyt.get('left');
	var y = lyt.get('top');
	var w = lyt.get('width');
	var h = lyt.get('height');

	if (!x || !y || !w || !h) return null;
	else if (x >=0 && y >=0) geo = w+'x'+h+'+'+x+'+'+y;
	else if (x >=0 && y < 0) geo = w+'x'+h+'+'+x+'-'+y;
	else if (x < 0 && y >=0) geo = w+'x'+h+'-'+x+'+'+y;
	else if (x < 0 && y < 0) geo = w+'x'+h+'+'+x+'+'+y;
	return geo;
},

updtGeoNodo : function (div){
	var tipo,ix;
	var divId = div.id;
	if (!divId) return false;
	var geo = this.getDivGeo(div);
	ix = div.id.split('_')[1];
	this.nodos[ix].set('geo',geo);
},
edit : function(){
	var nEdita = getNodoNuevo();
	nEdita.set('cod','_editar');
	nEdita.set('tag','Edita');
	this.nodos.push(nEdita);
	
	var nBorra = getNodoNuevo();
	nBorra.set('cod','_borrar');
	nBorra.set('tag','Borra');
//	this.nodos.push(nBorra); // el form de edit ya lleva el boton de eliminar
},

showNodos : function(){
//	$(this.divBase).update();
	var n = this.nodos.length;
	for (var i=1;i<n;i++) this.fnShow(this.nodos[i],i,this.divBase);
	
   this.myLyt = new retoLayout(this.nodos,this.divBase);
   this.myLyt.ejecutar(this.layout,'drag');
},
/*
showNodosKK : function(modo){
//	if (modo == 'EDIT') this.edit();
	
	var nodo,cod,tag,etc,div;
	
	var n = this.nodos.length;
	for(var i=1;i<n;i++){
		nodo = this.nodos[i];
		cod = nodo.get('cod');
		tag = nodo.get('tag');
      div = new Element('div',{id:'drag_'+i,className:'divDrag'})
      if (modo =='EDIT')  div.update('<a href="javascript:editThisItem('+i+')"><i class="fa '+this.icon+'"></i> '+tag+'</a>');
      else div.update('<i class="fa '+this.icon+'"></i> '+tag)

		$(this.divBase).appendChild(div);
	}
	
   this.myLyt = new retoLayout(this.nodos,this.divBase);
   this.myLyt.ejecutar(this.layout,'drag');
},
*/
refrescaTags : function(){
	this.myLyt.ejecutar(this.layout,'drag');
},
borraDivs : function(){
	this.myLyt.borraDivs();
},
setPosPnt : function (x,y){
	var pos0 = $(this.divBase).positionedOffset();
	var posD = this.oDrag.positionedOffset();
	var offX = window.pageXOffset;
	var offY = window.pageYOffset;
	this.xPnt = x + offX - posD.left - pos0.left ;
	this.yPnt = y + offY - posD.top  - pos0.top ;
},

pulsarBoton : function (e) {
	var fobj = this.moz ? e.target  : event.srcElement;
	var pntX = this.moz ? e.clientX : event.clientX;
	var pntY = this.moz ? e.clientY : event.clientY;

	while (fobj.tagName.toLowerCase() != "html" && fobj.className != "divDrag") {
		fobj = this.moz ? fobj.parentNode : fobj.parentElement;
	}

	if (fobj.tagName.toLowerCase() == "div" && fobj.className == "divDrag") {
		this.oDrag = fobj;
		this.oDrag.style.zIndex = this.laZ++;
		this.setPosPnt(pntX,pntY);
		fobj.onmouseup = this.soltarBoton.bind(this);
		$(this.divBase).onmouseup = this.soltarBoton.bind(this);
		$(this.divBase).onmousemove = this.moverRaton.bind(this);
		return false;
	}
	else return false;
	
},

moverRaton : function (e){
	var newX = this.moz ? e.clientX : event.clientX;
	var newY = this.moz ? e.clientY : event.clientY;
	var pos0 = $(this.divBase).positionedOffset();
	var offX = window.pageXOffset;
	var offY = window.pageYOffset;
	var x = newX - pos0.left + offX - this.xPnt;
	var y = newY - pos0.top  + offY - this.yPnt;
	if (this.grid){
	   x = Math.round(x/this.grid) * this.grid;
	   y = Math.round(y/this.grid) * this.grid;
	}
	this.oDrag.style.left = x + 'px';
	this.oDrag.style.top  = y + 'px';
	return false;
},

soltarBoton : function (e) {	
	$(this.divBase).onmousemove = null;
	$(this.divBase).onmouseup = null;
	this.oDrag.onmousemove = null;
	this.oDrag.onmouseup = null;
	if (this.updateGeo) this.updtGeoNodo(this.oDrag);
	
	if (!this.triggerPostDrop) return false;
	else if (this.triggerPostDrop.match(/IXNODO/)){
		var ixNodo = this.oDrag.id.split('_')[1];
		var trigger = this.triggerPostDrop.replace('IXNODO',ixNodo);
		eval (trigger);
		}
	else eval (this.triggerPostDrop);
	return false;
},
touchStart :function (e){
	var id = e.element().id;
	
	var fobj=document.getElementById(id);
	vgLyt.objX = fobj;
	if (id.split('_')[0] != 'Drag'){
		var bgrnd = fobj.getStyle('background-color');
		if (bgrnd == 'gray') fobj.style.background='white';
		else fobj.style.background='gray';
	}
	fobj.style.zIndex = vgLyt.laZ++;
	e.preventDefault();
	return false;
},
touchMove : function (e){
	var id = e.element().id;
	var targetEvent = e.touches.item(0);
	var fobj=document.getElementById(id);
	if (id.split('_')[0] != 'Drag') fobj.style.background='yellow';
	fobj.style.left=(targetEvent.clientX -120)+'px';
	fobj.style.top=(targetEvent.clientY-120)+'px';
	e.preventDefault();
	return false;
},
touchEnd : function (e){
	var id = e.element().id;
	var fobj=document.getElementById(id);
	e.preventDefault();
	if (id.split('_')[0] != 'Drag') grabaPosDiv(vgLyt.objX);
	return false;
},

haySolape : function (divA,divB){
	if (!divA || !divB) return false;
	var lytA = divA.getLayout();
	var lytB = divB.getLayout();
	var AL = lytA.get('left');
	var AT = lytA.get('top');
	var AW = lytA.get('width');
	var AH = lytA.get('height');

	var BL = lytB.get('left');
	var BT = lytB.get('top');
	var BW = lytB.get('width');
	var BH = lytB.get('height');

//	debugLog('A: '+AL+','+AT+','+AW+','+AH)
//	debugLog('B: '+BL+','+BT+','+BW+','+BH)

	if (!AW || !AH || !BW || !BH) return false;
	else if (AL + AW < BL) return false;
	else if (AT + AH < BT) return false;
	else if (AL > BL + BW) return false;
	else if (AT > BT + BH) return false;
	else return true;
},

initMoverDiv : function (){
	this.moz = document.getElementById && !document.all;
	if (this.moz)	$(this.divBase).onmousedown = this.pulsarBoton.bind(this);
	else $(this.divBase).on('touchstart', this.touchStart.bind(this));
}

})

//------------------------------------------------------------------- Para Safari
function touchStart(e){
	var id = e.element().id;
	
	var fobj=document.getElementById(id);
	vgLyt.objX = fobj;
	if (id.split('_')[0] != 'Mov'){
		var bgrnd = fobj.getStyle('background-color');
		if (bgrnd == 'gray') fobj.style.background='white';
		else fobj.style.background='gray';
	}
	fobj.style.zIndex = vgLyt.laZ++;
	e.preventDefault();
	return false;
}


function touchMove(e){
	var id = e.element().id;
	var targetEvent = e.touches.item(0);
	var fobj=document.getElementById(id);
	if (id.split('_')[0] != 'Mov') fobj.style.background='yellow';
	fobj.style.left=(targetEvent.clientX -120)+'px';
	fobj.style.top=(targetEvent.clientY-120)+'px';
	e.preventDefault();
	return false;
}

function touchEnd(e){
	var id = e.element().id;
	var fobj=document.getElementById(id);
	e.preventDefault();
	if (id.split('_')[0] != 'Mov') grabaPosDiv(vgLyt.objX);
	return false;
}

//===================================================================
//------------------------------------------------------------------- retoLayout
var retoLayout = Class.create({
initialize : function(nodos,divBase){
	this.nodos = nodos;
	this.divBase = divBase;
	this.divT = 'nodo';
	this.offsetX = 1000;
	this.laX = 0;
	this.laY = 0;
	this.laZ = 100;
},
setOffsetX : function(offset){
	this.offsetX = offset;
},
//------------------------------------------------------------------- Layout
hideDivs : function (){
	var base = $(this.divBase);
	var divs = $A(base.getElementsByTagName('div'));
	divs.each(function (div){
		div.hide();
	})
},
borraDivs : function (){
//	debugLog('borraDivs en: '+this.divBase+' divT: '+this.divT);
	var base = $(this.divBase);
	var divs = $A(base.getElementsByTagName('div'));
	var n = divs.length;
	//debugLog('Layout: '+n+ 'divs');
	for (var i=0;i<n;i++){
		div = divs[i];
		tipo = div.id.split('_')[0];
		ix =  div.id.split('_')[1];
		if (tipo == this.divT)	base.removeChild(div);
		}
	
},

showDiv : function (div,left,top){
		div.style.zIndex = this.laZ++;
		div.style.left = left + 'px';
		div.style.top  = top + 'px';
		$(this.divBase).appendChild(div);
},

showDivsMatrix : function (dx,dy){
	var tipo,ix,left,top;
	this.laX = 0;
	this.laY = 0;
	var base = $(this.divBase);
	var divs = $A(base.getElementsByTagName('div'));
	divs.each(function (div){
		left = 3 + this.laX;
		top =  3 + dy*this.laY;
		div.style.left = left + 'px';
		div.style.top = top + 'px';
		div.style.width = (dx-14) + 'px';
		div.style.height = (dy-14) + 'px';
		this.laX = this.laX + div.getWidth()+3;
		if (this.laX > (850-dx)){
			this.laX = 0;
			this.laY++; 
			}
	});
},

showDivsGeo : function (){
	var tipo,ix,geo,hGeo;
	var base = $(this.divBase);
	var divs = $A(base.getElementsByTagName('div'));
	var n = divs.length;
	for (var i=0;i<n;i++){
		div = divs[i];
		tipo = div.id.split('_')[0];
		ix =  div.id.split('_')[1];
		
		if (tipo != this.divT) null;
		else if (ix.match(/Edita/)){ div.style.left = '5px'; div.style.top  = '5px';}
		else if (ix.match(/Borra/)){ div.style.left = '5px'; div.style.top  = '60px';}
		else {
			geo = this.nodos[ix].get('geo');
			hGeo = geoNodo2hash(geo);
			if (hGeo) {	div.style.left = hGeo.get('x') + 'px';div.style.top  = hGeo.get('y') + 'px';}
		 	}
	};
},
showDivsRows : function (){
//debugLog(this.divBase);
	var base = $(this.divBase);
	var lyt0 = base.getLayout();
	var w0 = lyt0.get('width');
	var div,tipo,x,y,w,h;
	this.laX = 0;
	this.laY = 0;
	var divs = $A(base.getElementsByTagName('div'));
	var n = divs.length;
	for (var i=0;i<n;i++){
		div = divs[i];
		tipo = div.id.split('_')[0];
		if (tipo == this.divT){
			w = div.getWidth();
			h = div.getHeight();
			if (this.laX + w > w0){
				this.laX = 0;
				this.laY += (h+3); 
				}
			x = 3 + this.laX;
			y = 3 + this.laY;
		 	div.style.left = x + 'px';
		 	div.style.top  = y + 'px';
			this.laX = this.laX + w + 3;
		 	}
	};
},

showDivsCols : function (){
	var base = $(this.divBase);
	var lyt0 = base.getLayout();
	var h0 = lyt0.get('height');
	var div,tipo,x,y,w,h;
	this.laX = 0;
	this.laY = 90;
	var divs = $A(base.getElementsByTagName('div'));
	var n = divs.length;
	for (var i=0;i<n;i++){
		div = divs[i];
		tipo = div.id.split('_')[0];
		if (tipo == this.divT){
			w = div.getWidth();
			h = div.getHeight();
			if (this.laY + h > h0){
				this.laX += 100;
				this.laY += (h+3); 
				}
			x = this.offsetX + this.laX;
			y = 3 + this.laY;
		 	div.style.left = x + 'px';
		 	div.style.top  = y + 'px';
			this.laY += h + 3;
		 	}
	};
},

showDivsListaV : function (dx,dy){
	var tipo,ix,left,top;
	this.laX = 0;
	this.laY = 0;
	var base = $(this.divBase);
	var divs = $A(base.getElementsByTagName('div'));
	divs.each(function (div){
		tipo = div.id.split('_')[0];
		ix =  div.id.split('_')[1];
		if (tipo == this.divT){
			left = dx;
			top = dy*this.laY++;
		 	div.style.left = left + 'px';
		 	div.style.top = top + 'px';
		 	}
	});
},

selectAllDivs : function (){
	var base = $(this.divBase);
	var divs = $A(base.getElementsByTagName('div'));
	divs.each(function (div){div.style.backgroundColor = 'gray';});
},
ejecutar : function (modo,tipo){
	if (!tipo) this.divT = 'nodo';
	else this.divT = tipo;
	switch (modo){
		case 'ROWS' : this.showDivsRows(); break;
		case 'COLS' :	this.showDivsCols(); break;
		case 'GEO'  :	this.showDivsGeo(); break;
		}
}

})


