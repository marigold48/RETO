var vgLupa = {
	sizeFoto: '',
	pathFoto: '',
	cambiar : true
}

function t(id){return document.getElementById(id);}
function addEvent(obj,fun,type){
    if(obj.addEventListener){
        obj.addEventListener(type,fun,false);
    }else if(obj.attachEvent){
        var f=function(){
            fun.call(obj,window.event);
        }
        obj.attachEvent('on'+type,f);
        obj[fun.toString()+type]=f;
    }else{
        obj['on'+type]=fun;
    }
} 

function getPos(e){
    var ev=e || window.event;
    var obj=ev.target || ev.srcElement;
    obj.style.position='relative'; 
    posX=ev.layerX || ev.offsetX || 0;
    posY=ev.layerY || ev.offsetY || 0;
    return {x:posX,y:posY}
} 
function css(id,prop){
    if(window.getComputedStyle){
        return document.defaultView.getComputedStyle(t(id),null).getPropertyValue(prop);
    }else{
        var re = /(-([a-z]){1})/g;
        if (prop == 'float') prop = 'styleFloat';
        if (re.test(prop)) {
            prop = prop.replace(re, function () {
                return arguments[2].toUpperCase();
            });
        }
        return t(id).currentStyle[prop] ? t(id).currentStyle[prop] : null;
    }
} 
function cambiar(pos,rel,e,a,a2,w,h){
	if (!vgLupa.cambiar) return;
    var al=parseInt(a);
    var al2=parseInt(a2);
    if(pos.x<(al/2)/rel)
        pos.x=(al/2)/rel;
    if(pos.y<(al2/2)/rel)
        pos.y=(al2/2)/rel;
    if(pos.x>(w)-(al/2)/rel)
        pos.x=(w)-(al/2)/rel;
    if(pos.y>(h)-(al2/2)/rel)
        pos.y=(h)-(al2/2)/rel;
    t('im').style.left=-(rel*pos.x)+(al/2)+'px';
    t('im').style.top=-(rel*pos.y)+(al2/2)+'px';
}
// onload=function(){}

function setSizeFoto(){
	vgLupa.sizeFoto = t('im0').width;
	$('im0').style.width = '900px';
	$('im0').show();
	debugLog('setSizeFoto '+vgLupa.sizeFoto);
	$('im').src = vgLupa.pathFoto;
}
function toggleCambio(){
	vgLupa.cambiar = (!vgLupa.cambiar);
}
function lupaFoto(){
	$('lupa').style.width = '500px';
	$('lupa').style.height = '500px';
	$('im0').style.width = '350px';
	$('im0').style.cursor = 'crosshair';
	$('im0').on('click',toggleCambio);
	$('lupa').show();
    addEvent(
        t('im0'),
        function(e){
            var al2=css('lupa','height');
            var al=css('lupa','width');
            var pos=getPos(e);
            cambiar(pos,(t('im').width)/this.width,e,al,al2,this.width,this.height);
        },
        'mousemove'
    );
}
function initImg(){
	vgLupa.pathFoto = getPathWeb(vgAjax.params.get('foto'));
	$('lupa').hide();
	$('im0').hide();
	$('im0').src = vgLupa.pathFoto;
}

//------------------------------------------------------------------- Girar una Foto
function girarUnoSolo1(resp){
	debugLog('girarUnoSolo1 '+resp.responseText);
	var ix = vgPag.ix;
	$('divBase').removeChild($('imgS_'+ix));
	var nodo = vgPag.nodos[ix];
	var div = nodo2imgS(nodo,ix);
	showDiv(div,10,10);
}
function girarUnoSolo0(ix,ang){
	debugLog('girarUnoSolo0 '+ix+':'+ang);
	vgPag.ix = ix;
	var nodo = vgPag.nodos[ix];
	var path = nodo.get('etc').split('=')[1];
	path = path.replace('XS_','S_');
	var carga1 = new retoCarga2('img=/var/www'+path+'&ang='+ang,'gira_img.sh',girarUnoSolo1);
	carga1.go();
}
//------------------------------------------------------------------- Zooms
function zoomInFotoKK(){
	var width = t('im').width;
	width = Math.round(parseInt(width)*1.25);
	debugLog(width);
	$('im').style.width = width+'px';
}
function zoomOutFotoKK(){
	var width = t('im').width;
	width = Math.round(parseInt(width)*0.75);
	debugLog(width);
	$('im').style.width = width+'px';
}

function ecoGirarFoto(resp){
	debugLog('girarFoto1 '+resp.responseText);
	$('im0').src = vgLupa.pathFoto+'?'+getId(); // refresca la imagen 'im0
}

function ecoCreaUngleFoto(resp){
	debugLog('crea Ungle '+resp.responseText);
}
function girarFoto0(ang){
	var pathI = t('im').src;
	pathI=pathI.replace('http://localhost','/var/www');
	ajaxGiraImagen(pathI,ang,ecoGirarFoto); // Ajax Gira Imagen
	
   var dirUngles = vgPaths.pathAbs+'/retoDirs/Ungles/';
   var pathUngle = getPathUngle(pathI,dirUngles);
   ajaxCreaUngleFoto(pathI,pathUngle,ecoCreaUngleFoto);  // actualiza su Thumbnail. Revisar esto !!!!!!
}

function ecoCreaCropFoto(resp){
	debugLog('ecoCreaCropFoto: '+resp.responseText);
}

function cropFoto0(i,f,r,pct){
	debugLog('cropFoto0 '+i+':'+f+':'+r);
	ajaxCreaCropImg(i,f,r,pct,ecoCreaCropFoto);
//	var carga1 = new retoCarga2('imgI='+i+'&imgF='+f+'&crop='+r+'&ratio='+pct,'crop_img.sh',cropFoto1);
//	carga1.go();
}


function creaCropFoto(){
	var ratio = vgLupa.sizeFoto/parseInt(t('im').width);
	var wLupa = parseInt($('lupa').getWidth());
	var hLupa = parseInt($('lupa').getHeight());
	var width  = Math.round(wLupa*ratio);//t('lupa').width;
	var height = Math.round(hLupa*ratio); //t('lupa').height;
	var left = Math.round(parseInt(t('im').style.left)*(-1)*ratio);
	var top  = Math.round(parseInt(t('im').style.top )*(-1)*ratio);
	var rect = ''+width+'x'+height+'+'+left+'+'+top;
	var pathI = t('im').src;
	pathI = pathI.replace('http://localhost','/var/www');
	var trozos = pathI.split('/');
	var strFich = trozos[trozos.length-1];
	var	nomCrop = prompt('Fichero?',strFich);
	if ('['+strFich+']' == '[null]') return;
	var pathF = vgPaths.pathAbs+vgPaths.dirCropImg+vgAjax.hSesion.get('proy')+'.'+nomCrop;
	
	debugLog('ratio:path:rect '+ratio+':'+pathF+':'+rect);
	var cropRatio = Math.round(100/ratio);
	cropFoto0(pathI,pathF,rect,cropRatio);
}

function setCropHorizontal0(){
	$('lupa').style.width = '986px';
	$('lupa').style.height = '196px';
} 
function setCropVertical0(){
	$('lupa').style.width = '300px';
	$('lupa').style.height = '500px';
} 
function setCropRetrato0(){
	$('lupa').style.width = '384px';
	$('lupa').style.height = '512px';
} 
function setCropPaisaje0(){
	$('lupa').style.width = '512px';
	$('lupa').style.height = '384px';
} 
//===================================================================
function fotoLupa(){lupaFoto();}
function hookCreaCropFoto(){creaCropFoto();}
function girarFoto(ang){girarFoto0(ang);}
function setCropHorizontal(){setCropHorizontal0();}
function setCropVertical(){setCropVertical0();}
function setCropRetrato(){setCropRetrato0();}
function setCropPaisaje(){setCropPaisaje0();}

