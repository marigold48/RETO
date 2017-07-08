var retoArcQuadr = Class.create({
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

rotarPunto : function (dx,dy,Px,Py){
   var ang = Math.atan(dy/dx);
   if (dx < 0) ang = ang + Math.PI;
   p0X = Px*Math.cos(ang)+Py*Math.sin(ang);
   p0Y = Px*Math.sin(ang)-Py*Math.cos(ang);

   var punt = [p0X,p0Y];
   return punt;
},

getPuntosQuadr : function(posI,posF){
   
   var puntos = new Array();
   var x0 = posI.get('x');
   var y0 = posI.get('y');
   var w0 = posI.get('w');
   var h0 = posI.get('h');
   
   var x1 = posF.get('x');
   var y1 = posF.get('y');
   var w1 = posF.get('w');
   var h1 = posF.get('h');
   
   var dx = x1-x0;
   var dy = y1-y0;

// Centro nodos:
   var Xi = Math.round(8+x0+w0/2);
   var Yi = Math.round(8+y0+h0/2);
   var Xf = Math.round(8+x1+w1/2);
   var Yf = Math.round(8+y1+h1/2);

// Punto medio del segmento I->F;
   var Xm = Math.round((Xi+Xf)/2);
   var Ym = Math.round((Yi+Yf)/2);

   Pc = this.rotarPunto(dx,dy,0,50.0); Xc = Pc[0]; Yc = Pc[1];

   F1 = this.rotarPunto(dx,dy,0,-3.5); F1x = Math.round(F1[0]); F1y = Math.round(F1[1]);
   F2 = this.rotarPunto(dx,dy,8.5,0);  F2x = Math.round(F2[0]); F2y = Math.round(F2[1]);
   F3 = this.rotarPunto(dx,dy,0,3.5);  F3x = Math.round(F3[0]); F3y = Math.round(F3[1]);

   puntos.push([Xi,Yi]);
   puntos.push([Xf,Yf]);
   puntos.push([Xc+Xm,Yc+Ym]);

   puntos.push([F1x+(Xc+2*Xm)/2,F1y+(Yc+2*Ym)/2]);
   puntos.push([F2x+(Xc+2*Xm)/2,F2y+(Yc+2*Ym)/2]);
   puntos.push([F3x+(Xc+2*Xm)/2,F3y+(Yc+2*Ym)/2]);
   return puntos;
},
pintaArcoGUI : function(nodoI,nodoF){
   
	var x0,y0,x1,y1,geoI,geoF,posI,posF;
	geoI = nodoI.get('geo');
	geoF = nodoF.get('geo');
	
	
	posI = geoNodo2hash(geoI);
	posF = geoNodo2hash(geoF);
	
	if (!posI|| !posF) {alert('POS_NODOS_MAL');return;}
//   console.log(posI.values().join('|'));;
//   console.log(posF.values().join('|'));;

	var pts = this.getPuntosQuadr(posI,posF);

	if (!pts){
	   }
	else{
// Pinta el arco
      x0 = pts[0][0]+0.5;
      y0 = pts[0][1]+0.5;
      x1 = pts[1][0]+0.5;
      y1 = pts[1][1]+0.5;
      xc = pts[2][0]+0.5;
      yc = pts[2][1]+0.5;
      this.cntxt.moveTo(x0,y0);
      this.cntxt.quadraticCurveTo(xc,yc,x1,y1);
	   this.cntxt.stroke();

// Pinta la flecha
      F1x = pts[3][0];
      F1y = pts[3][1];
      F2x = pts[4][0];
      F2y = pts[4][1];
      F3x = pts[5][0];
      F3y = pts[5][1];

      this.cntxt.fillStyle = 'blue';
      this.cntxt.beginPath();
      this.cntxt.moveTo(F1x,F1y);
      this.cntxt.lineTo(F2x,F2y);
      this.cntxt.lineTo(F3x,F3y);
      this.cntxt.closePath();
      this.cntxt.fill();
	   }
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

