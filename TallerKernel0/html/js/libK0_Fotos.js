var vgFoto = {
	formato : 'NORMAL',
	wOrig : ''

}

//------------------------------------------------------------------- Info Fotos
function ecoGetInfoImg(resp){
	var texto = resp.responseText.split('\n');
	texto = texto.join('<br>');
	var divInfo = new Element('div',{className:'formModal'});
	divInfo.style.width='500px';
	divInfo.style.height = '400px';

	var cancel = new Element('input',{type:'button',name:'',value:'Cancelar',onclick:'javascript:hideModal();'});
   var divTxt = new Element('div',{id:'infoFoto'});
	divTxt.style.height = '350px';
	divTxt.update(texto);
	divInfo.appendChild(divTxt);
	divInfo.appendChild(cancel);
	var modal = new retoModal(divInfo);
	modal.show();
}


function getInfoFoto(ix){
   var nodo =vgPag.Conjt.getNodoByIx(ix);
	var path = nodo.get('etc');
	debugLog('Info: '+path);
	ajaxGetInfoImg(path,ecoGetInfoImg);
}

function creaMapa(nodox){
	var area,XY,pntX,pntY,x0,y0,x1,y1,marco,titulo;
	var mapImg = new Element('map',{name:nodox.get('cod').split('.')[0]});
	vgNodo.nodos.each(function(nodo){
		if (nodo.get('ID1')==nodox.get('ID0')){
			XY = nodo.get('etc').split('=')[1];
			pntX = parseInt(XY.split(',')[0]);
			pntY = parseInt(XY.split(',')[1]);
			x0 = pntX-30;
			y0 = pntY-40;
			x1 = pntX+30;
			y1 = pntY+40;
			marco = x0+','+y0+','+x1+','+y1;
			titulo = nodo.get('tag');
			debugLog('creaMap '+titulo+' : '+marco);
			area = new Element('area',{shape:'rect',coords:marco,href:"#",title: titulo});
			mapImg.appendChild(area);
		}
	})
	return mapImg;
}


function mapImagen0(){
	initMapImg(vgPag.path);
//	window.open('albumMapImg.html?id='+vgPag.idSesion+'&img='+vgPag.path);
}


//------------------------------------------------------------------- Funciones Fotos



function setFormatoLupa(ev){
   var elem = ev.element();
   vgFoto.formato = elem.value;
   var lupa = $('lupaGrande');
   switch (vgFoto.formato){
      case 'NORMAL' : lupa.style.width = '960px';lupa.style.height = '650px'; break;
      case 'BANNER' : lupa.style.width = '960px';lupa.style.height = '120px'; break;
      case 'RETRAT' : lupa.style.width = '400px';lupa.style.height = '600px'; break;
      case 'PAISAJ' : lupa.style.width = '600px';lupa.style.height = '400px'; break;
      case 'CARAS'  : lupa.style.width = '220px';lupa.style.height = '300px'; break;
   }
}

function zoomInFoto(){
	var width = $('img0').width;
	width = Math.round(parseInt(width)*1.25);
	debugLog(width);
	$('img0').style.width = width+'px';
}
function zoomOutFoto(){
	var width = $('img0').width;
	width = Math.round(parseInt(width)*0.75);
	debugLog(width);
	$('img0').style.width = width+'px';
}
function ecoManipularFotoOK(resp){
   debugLog(resp.responseText);
}
function manipularFotoOK(ix){
	var wLupa = parseInt($('lupaGrande').getWidth());
	var hLupa = parseInt($('lupaGrande').getHeight());
	var xLupa = parseInt($('lupaGrande').scrollLeft);
	var yLupa = parseInt($('lupaGrande').scrollTop);
	var wImg0 = parseInt($('img0').getWidth());

	var frm = $('formManipFoto');
	var str = frm.serialize(true);
	var hForm = $H(str);

	var nombre = hForm.get('nomCrop');
	var tipoCrop = hForm.get('manipT');
	
	var ratio = wImg0/vgFoto.wOrig; ratio *= 100; ratio = +ratio.toFixed(3);
   debugLog('Ratio: '+':'+wImg0+'/'+vgFoto.wOrig+' = '+ratio);
   debugLog('Size: '+':'+wLupa+' x '+hLupa);
   debugLog('Posic: '+':'+xLupa+' + '+yLupa);
   
   var nodo = vgPag.Conjt.getNodoByIx(ix);
   var imgI = nodo.get('etc');
   var dirCrops = vgPaths.pathAbs+'/retoDirs/Crops/';

   var imgF = dirCrops+vgAjax.hSesion.get('proy')+'.'+tipoCrop+'-'+nombre;
   var rect = wLupa+'x'+hLupa+'\+'+xLupa+'\+'+yLupa;
   ajaxCreaCropImg (imgI,imgF,rect,ratio,ecoManipularFotoOK);
   showUnglesFotos();
}
function getDimensionOriginal(){
   var img0 = $('img0');
   vgFoto.wOrig = parseInt(img0.width);
   img0.style.width='100%';
}
function manipularFoto(ix){
   var nodo = vgPag.Conjt.getNodoByIx(ix);
   var path = getPathWeb(nodo.get('etc'));
   var frm = creaFormManipFoto(ix,nodo);
   $('divBase').update(frm);
   
   var lupa = new Element('div',{id:'lupaGrande'});
   var img0 = new Element('img',{id:'img0',src:path,onload:'javascript:getDimensionOriginal()'});
   lupa.appendChild(img0);
   $('divBase').appendChild(lupa);
   cancelEditModal();
}



function editaNodoFoto(ix){
		nodo = vgPag.Conjt.getNodoByIx(ix);
		frm = creaEdNodoConjt(ix,nodo);
   	frm.addButton('Manipular',function(){manipularFoto(ix);});
   	frm.addButton('Info',function(){getInfoFoto(ix);});
		frm.show();
}
//=================================================================== Antiguo
function nodo2crop(nodo,ix){
	if (vgPag.esIPad){ div = $('box').clone(); div.id = 'imgS_'+ix;}
	else div = new Element('div',{id:'imgS_'+ix,className:'objMovible'});
	var path = getPathFoto(nodo,'');
//	debugLog(path);
	var img = new Element ('img',{src:path,title:nodo.get('tag')});
	img.style.display='block';
	div.appendChild(img);
	var ver1=new Element('input',{type:'button',value:'[x]',onclick:'borrarUnoSolo('+ix+')'});
	var mapa=new Element('input',{type:'button',value:'Mapea',onclick:'initMapImg('+ix+')'});
	
	div.appendChild(ver1);
	div.appendChild(mapa);
	return div;
}


function infoFoto1(resp){
	var texto = resp.responseText.split('\n');
	texto = texto.join('<br>');
	var divInfo = new Element('div',{id:'infoFoto'});
	divInfo.hide();
	divInfo.update(texto);
	$('divBase').appendChild(divInfo);
}


function infoFoto0(){
	var pathI = vgLupa.pathFoto;
	pathI='/var/www'+pathI;

	debugLog('Info: '+pathI);
	var carga1 = new retoCarga2('imgI='+pathI,'info_img.sh',infoFoto1);
	carga1.go();
}

function fotoInfo(){$('infoFoto').show();}


/*



//--------------------------------------------------------- Mapear Imagen
function creaMapa(nodox){
	var area,XY,pntX,pntY,x0,y0,x1,y1,marco,titulo;
	var mapImg = new Element('map',{name:nodox.get('cod').split('.')[0]});
	vgNodo.nodos.each(function(nodo){
		if (nodo.get('ID1')==nodox.get('ID0')){
			XY = nodo.get('etc').split('=')[1];
			pntX = parseInt(XY.split(',')[0]);
			pntY = parseInt(XY.split(',')[1]);
			x0 = pntX-30;
			y0 = pntY-40;
			x1 = pntX+30;
			y1 = pntY+40;
			marco = x0+','+y0+','+x1+','+y1;
			titulo = nodo.get('tag');
			debugLog('creaMap '+titulo+' : '+marco);
			area = new Element('area',{shape:'rect',coords:marco,href:"#",title: titulo});
			mapImg.appendChild(area);
		}
	})
	return mapImg;
}


function mapImagen0(){
	initMapImg(vgPag.path);
//	window.open('albumMapImg.html?id='+vgPag.idSesion+'&img='+vgPag.path);
}

function nodo2crop(nodo,ix){
	if (vgPag.esIPad){ div = $('box').clone(); div.id = 'imgS_'+ix;}
	else div = new Element('div',{id:'imgS_'+ix,className:'objMovible'});
	var path = getPathFoto(nodo,'');
//	debugLog(path);
	var img = new Element ('img',{src:path,title:nodo.get('tag')});
	img.style.display='block';
	div.appendChild(img);
	var ver1=new Element('input',{type:'button',value:'[x]',onclick:'borrarUnoSolo('+ix+')'});
	var mapa=new Element('input',{type:'button',value:'Mapea',onclick:'initMapImg('+ix+')'});
	
	div.appendChild(ver1);
	div.appendChild(mapa);
	return div;
}


function infoFoto1(resp){
	var texto = resp.responseText.split('\n');
	texto = texto.join('<br>');
	var divInfo = new Element('div',{id:'infoFoto'});
	divInfo.hide();
	divInfo.update(texto);
	$('divBase').appendChild(divInfo);
}


function infoFoto0(){
	var pathI = vgLupa.pathFoto;
	pathI='/var/www'+pathI;

	debugLog('Info: '+pathI);
	var carga1 = new retoCarga2('imgI='+pathI,'info_img.sh',infoFoto1);
	carga1.go();
}

function fotoInfo(){$('infoFoto').show();}


	var img = new Element('img',{src:path,usemap:'#mapPbas'});
	var mapImg = new Element('map',{name:'mapPbas'});
	var area = new Element('area',{shape:'rect',coords:"0,0,100,110",href:"sun.html",title:"Sun"});
	mapImg.appendChild(area);
	img.appendChild(mapImg);
	
	Algoritmo para rotar las nodos
	public static void FixOrientation(this Image image)
{
    // 0x0112 is the EXIF byte address for the orientation tag
    if (!image.PropertyIdList.Contains(0x0112))
    {
        return;
    }

    // get the first byte from the orientation tag and convert it to an integer
    var orientationNumber = image.GetPropertyItem(0x0112).Value[0];

    switch (orientationNumber)
    {
        // up is pointing to the right
        case 8:
            image.RotateFlip(RotateFlipType.Rotate270FlipNone);
            break;
        // up is pointing to the bottom (image is upside-down)
        case 3:
            image.RotateFlip(RotateFlipType.Rotate180FlipNone);
            break;
        // up is pointing to the left
        case 6:
            image.RotateFlip(RotateFlipType.Rotate90FlipNone);
            break;
        // up is pointing up (correct orientation)
        case 1:
            break;
    }
}
*/

