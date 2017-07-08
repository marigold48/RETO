
function pintaTriang(cntxt,triang){
   var x,y;
   
   var div = document.getElementById('texto');
   div.innerHTML = txt.substr(0,frase++);
   var A = triang.A;
   var B = triang.B;
   var C = triang.C;
   var color = triang.color;
   
	cntxt.strokeStyle = 'maroon';
	cntxt.fillStyle = color;
	cntxt.beginPath();
   
   x = Math.round(A.x)+0.5;
   y = Math.round(A.y)+0.5;
   cntxt.moveTo(x,y);
   
   x = Math.round(B.x)+0.5;
   y = Math.round(B.y)+0.5;
   cntxt.lineTo(x,y);

   x = Math.round(C.x)+0.5;
   y = Math.round(C.y)+0.5;
   cntxt.lineTo(x,y);

   x = Math.round(A.x)+0.5;
   y = Math.round(A.y)+0.5;
   cntxt.lineTo(x,y);

	cntxt.closePath();
	cntxt.stroke();
//	if (color) cntxt.fill();
	pintaColaTriangulos(cntxt);
}

function pintaColaTriangulos(cntxt){
   if (!colaTriang.length){
      setTimeout(function(){cargaPaginaInicial();},50);
      return;
      }
   
   var triang = colaTriang.pop();
   if (triang.color == 'red') setTimeout(function(){pintaTriang(cntxt,triang);},60);
   else setTimeout(function(){pintaTriang(cntxt,triang);},60);
}

function puntoMedio(A,B){
   var M = new Object();
   M.x = (A.x + B.x)/2;
   M.y = (A.y + B.y)/2;
   return M;
}

function generaSierpinsky(cntxt,A,B,C,N,color){
   if (N < 0) return;
//   alert(N);
   var triang = new Object();
   triang.A = A;
   triang.B = B;
   triang.C = C;
   triang.color = color;
   colaTriang.push(triang);
	
   var AB = puntoMedio(A,B);
   var BC = puntoMedio(B,C);
   var CA = puntoMedio(A,C);

   generaSierpinsky(cntxt, A, AB, CA, N-1,'green');
   generaSierpinsky(cntxt, AB, B, BC, N-1,'blue');
   generaSierpinsky(cntxt, CA, BC, C, N-1,'red');

}

function Sierpinsky (){
   var x = 10;
   var y = 600;
   var l = 600;
   var n = 5;
   var canvas = document.createElement("canvas");
   canvas.setAttribute("width", l+30);
   canvas.setAttribute("height", l+30);
	var cntxt = canvas.getContext("2d");

	var divBase = document.getElementById('divBase');
	divBase.appendChild(canvas);
   var A = new Object(); A.x = x; A.y = y;
   var B = new Object(); B.x = x+l; B.y = y;
   var C = new Object(); C.x = x+l/2; C.y = y - l*Math.sin(3.1416/3);
   generaSierpinsky(cntxt,A,B,C,n);
   pintaColaTriangulos(cntxt);
}


