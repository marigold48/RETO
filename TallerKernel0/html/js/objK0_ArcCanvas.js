var retoArcCanvas = Class.create({
initialize : function(f,arcos,divBase){
   this.f = f;
   this.arcos = arcos;
   this.divBase = divBase;
   this.cntxt = '';
   this.setCanvasGrafo(divBase);
},
limpiaArcos : function(){
	this.cntxt.clearRect(0,0,900,800);
},
intersectNodos : function(posI,posF){
/*
   Se definen las posiciones, tomando como referencia el nodo I.
*/
   var offset = 0;
   
   var puntos = new Array();
   var x0 = posI.get('x');
   var y0 = posI.get('y');
   var w0 = posI.get('w'); if (!w0) w0 = 200;
   var h0 = posI.get('h'); if (!h0) h0 = 100;
   
   var x1 = posF.get('x');
   var y1 = posF.get('y');
   var w1 = posF.get('w'); if (!w1) w1 = 200;
   var h1 = posF.get('h'); if (!h1) h1 = 100;
   
   var arrb = y0 - (y1+h1); // Gap arriba
   var abaj = y1 - (y0+h0); // Gap abajo
   var dcha = x1 - (x0+w0); // Gap a la derecha
   var izqd = x0 - (x1+w1); // Gap a la izqda
   
   
// No hay interseccion
   var NE = (arrb > 0) && (abaj < 0) && (dcha > 0) && (izqd < 0);
   if (NE){
      offset = Math.round(dcha/2);
      puntos.push([x0+w0,y0+h0/2]);
      puntos.push([x0+w0+offset,y0+h0/2]);
      puntos.push([x0+w0+offset,y1+h1/2]);
      puntos.push([x1,y1+h1/2]);
      return puntos;
   }

   var SE = (arrb < 0) && (abaj > 0) && (dcha > 0) && (izqd < 0);
   if (SE){
      offset = Math.round(dcha/2);
      puntos.push([x0+w0,y0+h0/2]);
      puntos.push([x0+w0+offset,y0+h0/2]);
      puntos.push([x0+w0+offset,y1+h1/2]);
      puntos.push([x1,y1+h1/2]);
      return puntos;
   }

   var SW = (arrb < 0) && (abaj > 0) && (dcha < 0) && (izqd > 0);
   if (SW){
      offset = Math.round(izqd/2);
      puntos.push([x0,y0+h0/2]);
      puntos.push([x0-offset,y0+h0/2]);
      puntos.push([x0-offset,y1+h1/2]);
      puntos.push([x1+w1+8,y1+h1/2]);
      return puntos;
   }
   var NW = (arrb > 0) && (abaj < 0) && (dcha < 0) && (izqd > 0);
   if (NW){
      offset = Math.round(izqd/2);
      puntos.push([x0,y0+h0/2]);
      puntos.push([x0-offset,y0+h0/2]);
      puntos.push([x0-offset,y1+h1/2]);
      puntos.push([x1+w1+8,y1+h1/2]); 
      return puntos;
   }
   
// Hay interseccion N y S
// Se calcula la posicion de los puntos medios, y se busca el centro de interseccion
// Ojo! al restar dcha/izqd en realidad se suma, ya que ambos han de ser negativos
   
   var N = (arrb > 0) && (abaj < 0) && (dcha < 0) && (izqd < 0);
   if (N && (x0+w0/2 == x1+w1/2)){
      puntos.push([x0+w0/2,y0]);
      puntos.push([x0+w0/2,y1+h1+6]);
      return puntos;
   }
   else if (N && (x0+w0/2 < x1+w1/2)){
      puntos.push([x0+w0/2-dcha/2,y0]);
      puntos.push([x0+w0/2-dcha/2,y1+h1+6]);
      return puntos;
   }
   else if (N && (x0+w0/2 > x1+w1/2)){
      puntos.push([x0-izqd/2,y0]);
      puntos.push([x0-izqd/2,y1+h1+6]);
      return puntos;
   }
  
   var S = (arrb < 0) && (abaj > 0) && (dcha < 0) && (izqd < 0);
   if (S && (x0+w0/2 == x1+w1/2)){
      puntos.push([x0+w0/2,y0+h0]);
      puntos.push([x0+w0/2,y1]);
      return puntos;
   }
   else if (S && (x0+w0/2 < x1+w1/2)){
      puntos.push([x0+w0/2-dcha/2,y0+h0]);
      puntos.push([x0+w0/2-dcha/2,y1]);
      return puntos;
   }
   else if (S && (x0+w0/2 > x1+w1/2)){
      puntos.push([x0-izqd/2,y0+h0]);
      puntos.push([x0-izqd/2,y1]);
      return puntos;
   }
   
   // Hay interseccion (Como suelen ser iguales, se toma el punto medio)
   var E = (arrb < 0) && (abaj < 0) && (dcha > 0) && (izqd < 0);
   if (E){
      puntos.push([x0+w0,y0+h0/2]);
      puntos.push([x1,y0+h0/2]);
      return puntos;
   }
   var W = (arrb < 0) && (abaj < 0) && (dcha < 0) && (izqd > 0);
   if (W){
      puntos.push([x0,y0+h0/2]);
      puntos.push([x1+w1+8,y0+h0/2]);
      return puntos;
   }

   return null;
},
pintaArcoGUI : function(nodoI,nodoF){
   
	var x0,y0,x1,y1,geoI,geoF,posI,posF;
	geoI = nodoI.get('geo');
	geoF = nodoF.get('geo');
	
	
	posI = geoNodo2hash(geoI);
	posF = geoNodo2hash(geoF);
	
	if (!posI|| !posF) {alert('POS_NODOS_MAL');return;}
   console.log(posI.values().join('|'));;
   console.log(posF.values().join('|'));;

	var pts = this.intersectNodos(posI,posF);
	if (!pts){
	   x0  = posI.get('x')+13;
	   y0  = posI.get('y')+13;
	   x1  = posF.get('x')+13;
	   y1  = posF.get('y')+13;
	   this.cntxt.moveTo(x0+0.5,y0+0.5);
	   this.cntxt.lineTo(x1+0.5,y1+0.5);
	   this.cntxt.stroke();
	   }
	else if (pts.length == 2){
      this.cntxt.moveTo(pts[0][0]+0.5,pts[0][1]+0.5);
	   this.cntxt.lineTo(pts[1][0]+0.5,pts[1][1]+0.5);
//	   this.cntxt.rect(pts[0][0]-5+0.5,pts[0][1]-5+0.5,10,10);
	   this.cntxt.stroke();
	   }
	else if (pts.length == 4){
      this.cntxt.moveTo(pts[0][0]+0.5,pts[0][1]+0.5);
	   this.cntxt.lineTo(pts[1][0]+0.5,pts[1][1]+0.5);
	   this.cntxt.lineTo(pts[2][0]+0.5,pts[2][1]+0.5);
	   this.cntxt.lineTo(pts[3][0]+0.5,pts[3][1]+0.5);
//	   this.cntxt.rect(pts[0][0]-5+0.5,pts[0][1]-5+0.5,10,10);
	   this.cntxt.stroke();
	   }
//			this.flecha(x0,y0,x1,y1);
},
showArcosGUI : function(color){
try{
	var arco,nodoI,nodoF,iniOK,finOK;
	this.limpiaArcos();
 	this.cntxt.beginPath();
	this.cntxt.strokeStyle=color;
	var n = this.arcos.length;
	for (var i=0;i<n;i++){
		arco = this.arcos[i];
		
		nodoI = this.f(arco.get('nodoI'));
		nodoF = this.f(arco.get('nodoF'));
		
		iniOK = (nodoI && nodoI.get('cod')!='_borrado') ? true : false;
		finOK = (nodoF && nodoF.get('cod')!='_borrado') ? true : false;
		
		if (iniOK && finOK ) this.pintaArcoGUI(nodoI,nodoF);
		};
		this.cntxt.closePath();
	}catch(e){alert(e.message);}
},
redibujaArcos : function(color){
	this.showArcosGUI(color);
},
setCanvasGrafo : function(div){
	try {
	var divCanvas = $(div);
	divCanvas.show();
	
	this.canvas = new Element('canvas');
	this.canvas.id = 'canvas1';
	this.canvas.style.width = divCanvas.scrollWidth+'px';
	this.canvas.style.height = divCanvas.scrollHeight+'px';

	this.canvas.width = divCanvas.scrollWidth;
	this.canvas.height = divCanvas.scrollHeight;
	this.canvas.style.overflow = 'visible';
	this.canvas.style.position = 'absolute';
	this.canvas.style.zOrden = 1;
	
	divCanvas.update(this.canvas);
	
	this.cntxt = this.canvas.getContext("2d");
	
	}catch (e){alert(e.message);}

}
})

