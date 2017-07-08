var vgGrafoGui = {
	cntxt : '',
	canvas : '',
	flecha : [[3.5,0],[8.5,8.5],[0,3.5]]
}
//------------------------------------------------------------------- Dibuja flecha
function rotacion(dx,dy){
//	punts = [[0,-3.5],[8.5,0],[0,3.5]];
	var ang = Math.atan(dy/dx);
	if (dx < 0) ang = ang + Math.PI;
	p0X = 0*Math.cos(ang)-3.5*Math.sin(ang);
	p0Y = 0*Math.sin(ang)+3.5*Math.cos(ang);

	p1X = 8.5*Math.cos(ang)-0*Math.sin(ang);
	p1Y = 8.5*Math.sin(ang)+0*Math.cos(ang);

	p2X = 0*Math.cos(ang)+3.5*Math.sin(ang);
	p2Y = 0*Math.sin(ang)-3.5*Math.cos(ang);
	var punts = [[p0X,p0Y],[p1X,p1Y],[p2X,p2Y]];
	return punts;
}

function rotarFlecha(x0,y0,x1,y1){
	var punts;
	var x = Math.round((x0+x1)/2);
	var y = Math.round((y0+y1)/2);
	var dx = (x1 - x0);
	var dy = (y1 - y0);
	var m = dy/dx;
	if (m != 1) punts = rotacion(dx,dy);
	else if (m == 1 && (dx > 0 && dy > 0)) punts = [[ 3.5,0],[ 8.5, 8.5],[0, 3.5]];	//  45 grados
	else if (m == 1 && (dx > 0 && dy < 0)) punts = [[ 3.5,0],[ 8.5,-8.5],[0,-3.5]];	// 135 grados
	else if (m == 1 && (dx < 0 && dy < 0)) punts = [[-3.5,0],[-8.5,-8.5],[0,-3.5]];	// 225 grados
	else if (m == 1 && (dx < 0 && dy > 0)) punts = [[-3.5,0],[-8.5, 8.5],[0, 3.5]];	// 315 grados
	
	punts[0][0]=punts[0][0]+x;
	punts[0][1]=punts[0][1]+y;

	punts[1][0]=punts[1][0]+x;
	punts[1][1]=punts[1][1]+y;

	punts[2][0]=punts[2][0]+x;
	punts[2][1]=punts[2][1]+y;

	vgGrafoGui.cntxt.fillStyle = 'black';
	vgGrafoGui.cntxt.beginPath();
	vgGrafoGui.cntxt.moveTo(punts[0][0],punts[0][1]);
	vgGrafoGui.cntxt.lineTo(punts[1][0],punts[1][1]);
	vgGrafoGui.cntxt.lineTo(punts[2][0],punts[2][1]);
	vgGrafoGui.cntxt.closePath();
	vgGrafoGui.cntxt.fill();
}

function flechaHoriz(x0,y0,x1,y1){
	vgGrafoGui.cntxt.fillStyle = 'black';
	vgGrafoGui.cntxt.beginPath();
	var x = Math.round((x0+x1)/2);
	var y = Math.round((y0+y1)/2);
	vgGrafoGui.cntxt.moveTo(x,y);
	if (x0 < x1){
		vgGrafoGui.cntxt.lineTo(x-8.5,y-3.5);
		vgGrafoGui.cntxt.lineTo(x-8.5,y+3.5);
	}
	else{
		vgGrafoGui.cntxt.lineTo(x+8.5,y+3.5);
		vgGrafoGui.cntxt.lineTo(x+8.5,y-3.5);
	}
	vgGrafoGui.cntxt.closePath();
	vgGrafoGui.cntxt.fill();
}

function flechaVert(x0,y0,x1,y1){
	vgGrafoGui.cntxt.fillStyle = 'black';
	vgGrafoGui.cntxt.beginPath();
	var x = Math.round((x0+x1)/2);
	var y = Math.round((y0+y1)/2);
	vgGrafoGui.cntxt.moveTo(x,y);
	if (y0 > y1){
		vgGrafoGui.cntxt.lineTo(x-3.5,y+8.5);
		vgGrafoGui.cntxt.lineTo(x+3.5,y+8.5);
	}
	else{
		vgGrafoGui.cntxt.lineTo(x-3.5,y-8.5);
		vgGrafoGui.cntxt.lineTo(x+3.5,y-8.5);
	}
	vgGrafoGui.cntxt.closePath();
	vgGrafoGui.cntxt.fill();
}

function flecha(x0,y0,x1,y1){
	if (x0 != x1 && y0 != y1) rotarFlecha(x0,y0,x1,y1);
	else if (x0 == x1) flechaVert(x0,y0,x1,y1);
	else if (y0 == y1) flechaHoriz(x0,y0,x1,y1);
}
//------------------------------------------------------------------- Dibuja Arcos
function limpiaArcos(){
	vgGrafoGui.cntxt.beginPath();
	vgGrafoGui.cntxt.fillStyle = 'white';
	vgGrafoGui.cntxt.fillRect(0,0,900,800);
	vgGrafoGui.cntxt.closePath();
}


function showArcosGUI(color){
	var x0,y0,x1,y1;
	var ini,fin,geoI,geoF,posI,posF;
	limpiaArcos();
	vgGrafoGui.cntxt.beginPath();
	vgGrafoGui.cntxt.strokeStyle=color;
	vgArco.arcos.each(function(arco){
		ini = getNodoByID(arco.get('id0'));
		fin = getNodoByID(arco.get('id1'));
		if (ini && fin ){
			geoI = ini.get('geo');
			geoF = fin.get('geo');
			posI = geoNodo2hash(geoI);
			posF = geoNodo2hash(geoF);
			x0  = posI.get('x')+13;
			y0  = posI.get('y')+13;
			x1  = posF.get('x')+13;
			y1  = posF.get('y')+13;
			vgGrafoGui.cntxt.moveTo(x0+0.5,y0+0.5);
			vgGrafoGui.cntxt.lineTo(x1+0.5,y1+0.5);
			vgGrafoGui.cntxt.stroke();
			flecha(x0,y0,x1,y1);
			}
		});
		vgGrafoGui.cntxt.closePath();
}

//------------------------------------------------------------------- Set Canvas
function setCanvasGrafo(){
	try {
	var divCanvas = $('divBase');
	vgGrafoGui.canvas = new Element('canvas');
	vgGrafoGui.canvas.id='canvas1';
	vgGrafoGui.canvas.style.width = divCanvas.scrollWidth+"px";
	vgGrafoGui.canvas.style.height = divCanvas.scrollHeight+"px";

	vgGrafoGui.canvas.width = divCanvas.scrollWidth;
	vgGrafoGui.canvas.height = divCanvas.scrollHeight;
	vgGrafoGui.canvas.style.overflow = 'visible';
	vgGrafoGui.canvas.style.position = 'absolute';
	vgGrafoGui.canvas.style.zOrden = 1;
	divCanvas.appendChild(vgGrafoGui.canvas);
	
	vgGrafoGui.cntxt = vgGrafoGui.canvas.getContext("2d");
	
	}catch (e){alert(e.message);}

}
function redibujaArcos(){
	showArcosGUI('blue');
}

function showGrafoGui0(){
	showNodos0(true);
	showDivsXY();
	vgLyt.updateGeo = true;
	vgPag.triggerPosDiv = 'redibujaArcos()';
	setCanvasGrafo();
	redibujaArcos();
}	
//------------------------------------------------------------------- Test Dijkstra
function testDijkstra0(){
	var nodox = vgNodo.nodos[1];
	var djkst = new retoDijkstra();
	djkst.setNodos(vgNodo.nodos);
	djkst.setArcos(vgArco.arcos);
	djkst.setNodoI(nodox);
	djkst.go();
	var arbol = djkst.getArbol();
	var hArbol = new Hash();
	hArbol.set('fich','NdN');
	hArbol.set('tag','Dijkstra-'+arbol[0].get('tag'));
	hArbol.set('nodos',arbol);
	vgArbol.arbols.push(hArbol);
	showArbols0(true);
}
//=================================================================== Interfaces del menu

function showGrafoGui(){showGrafoGui0();}
function testDijkstra(){testDijkstra0();}
