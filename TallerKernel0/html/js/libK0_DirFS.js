var vgDirFS = {
	nodos : new Array(),
	Arbol : '',
   getTrees : 'k0GetTreesFS.cgi',
   fShow : showNodosArbolSTD,
	triggerPostArbolDir :'',
	triggerPostArbolFich :''
}
//------------------------------------------------------------------- Get Tree Dirs
function ajaxGetTreeFS(dir,modo,eco){
   var params = '';
   params += 'id=1234567'; //+vgAjax.idSesion;
   params += '&dir='+dir;
   params += '&modo='+modo;
   params += '&path=/home/reto/Apps/Stock/admin';
   var cgi = vgComun.pathCGIs + vgDirFS.getTrees;
   retoAjaxPost(params,cgi,eco);
}



//------------------------------------------------------------------- Show Arbol Fichs
function showArbolFichs(){
   console.log('Hay '+vgDirFS.nodos.length+' nodos 1');
   vgDirFS.nodos[0].set('cod','_nodo0');
   var nodosOK = optimizaNodosArbol(vgDirFS.nodos);
   console.log('Hay '+nodosOK.length+' nodos 2');
   vgDirFS.Arbol = new retoArbol(nodosOK,vgDirFS.fShow);
//   vgDirFS.Arbol.expandAll();
   vgDirFS.Arbol.show('divBase');
   vgArbol.alias = vgDirFS.Arbol;
}

function showArbolDirs(){
   console.log('Hay '+vgDirFS.nodos.length+' nodos 1');
   vgDirFS.nodos[0].set('cod','_nodo0');
   var nodosOK = optimizaNodosArbol(vgDirFS.nodos);
   console.log('Hay '+nodosOK.length+' nodos 2');
   vgDirFS.Arbol = new retoArbol(nodosOK,vgDirFS.fShow);
//   vgDirFS.Arbol.expandAll();
   vgDirFS.Arbol.show('divBase');
   vgArbol.alias = vgDirFS.Arbol;
}

//=================================================================== Get Dirs/Fichs
function buscaDirPadre(padre){
	var id1;
	vgDirFS.nodos.each(function(nodo){
		if (nodo.get('etc') == padre) id1 = nodo.get('id0');
	})
	return id1;
}

function creaNodoFich(dir){
//   console.log('creaNodoDir 1 '+dir);
   var nodo = '';
	var niveles = dir.split('/');
   
	var tag = niveles.pop();
	var padre = niveles.join('/');
   
//   console.log('creaNodoDir 2'+iRaiz+' '+tema);
	if (!tag || dir.match(/error:0/)) null;
	else{
	   nodo = getNodoNuevo();
	   nodo.set('etc',dir);
		nodo.set('id1',buscaDirPadre(padre)||0);
		nodo.set('tag',tag);
		tag = tag.toLowerCase();
		
      nodo.set('cod','_dirfs');

		}
	return nodo;

}

function creaNodoDir(dir){
   //vgUtils.debug = false;
   
//   console.log('creaNodoDir 1 '+dir);
   var nodo = '';
	var niveles = dir.split('/');
   
	var tag = niveles.pop();
	var padre = niveles.join('/');
   
//   console.log('creaNodoDir 2'+iRaiz+' '+tema);
	if (!tag || dir.match(/error:0/)) null;
	else{
	   nodo = getNodoNuevo();
	   nodo.set('etc',dir);
		nodo.set('id1',buscaDirPadre(padre)||0);
		nodo.set('tag',tag);
		tag = tag.toLowerCase();
		nodo.set('cod','_dirfs');
		}
	return nodo;
}

//------------------------------------------------------------------- Get Tree Fich
function ecoGetTreeFich(resp){
	var nodo;
	
	var fichs = resp.responseText.split('\n');
	console.log(fichs.length+' fichs');
	fichs.each(function(fich){
		nodo = creaNodoFich(fich);
		if (nodo) vgDirFS.nodos.push(nodo);
	})
	showArbolFichs();
}

function getTreeFichs(root){
	vgDirFS.nodos = new Array();
	ajaxGetTreeFS(root,'FICH',ecoGetTreeFich);
}

//------------------------------------------------------------------- Get Tree Dirs
function ecoGetTreeDir(resp){
	var nodo;
	var dirs = resp.responseText.split('\n');
	console.log(dirs.length+' dirs');
	dirs.each(function(dir){
		nodo = creaNodoDir(dir);
		if (nodo) vgDirFS.nodos.push(nodo);
	})
	showArbolDirs();
}

function getTreeDirs(root){
	vgDirFS.nodos = new Array();
	ajaxGetTreeFS(root,'DIR',ecoGetTreeDir);
}

