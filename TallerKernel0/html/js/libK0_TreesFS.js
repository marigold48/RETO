var vgTree = {
	nodos : new Array(),
	arbol : '',
	mask  : 'jpg',
	triggerPostArbolDir :'',
	triggerPostArbolFich :''
	getTrees : 'k0GetTreesFS.cgi',
}

//------------------------------------------------------------------- Get Tree Dirs
function ajaxGetTreeFS(dir,modo,eco){
	var params = '';
	params += 'id=123456789';
	params += '&dir='+dir;
	params += '&modo='+modo;
	var cgi = vgComun.pathCGIs + vgTree.getTrees;
	retoAjaxPost(params,cgi,eco);
}


function showArbolFichs(){
	debugLog('Hay '+vgTree.nodos.length+' nodos');
	vgTree.arbol = new retoArbol(vgTree.nodos);
	vgTree.arbol.show();
}

function showArbolDirs(){
	debugLog('Hay '+vgTree.nodos.length+' nodos');
	vgTree.arbol = new retoArbol(vgTree.nodos,'divBase','NdN');
	vgTree.arbol.show();
}

function buscaDirPadre(padre){
	var nodoP;
	vgTree.nodos.each(function(nodo){
		if (nodo.get('etc') == padre) nodoP = nodo.get('id0');
	})
	return nodoP;
}

function creaNodoDir(dir){
	var nodo = getNodoNuevo();
	nodo.set('cod','DIR');
	nodo.set('etc',dir);

	var niveles = dir.split('/');
	var tag = niveles.pop();
	var padre = niveles.join('/');

	if (!tag){
		nodo.set('tag','Raiz');
		nodo.set('etc',padre);
		}
	else{
		nodo.set('id1',buscaDirPadre(padre,tag));
		nodo.set('tag',tag);
		}
	return nodo;
}

function ecoGetTreeDir(resp){
try{
	var nodo;
	var dirs = resp.responseText.split('\n');
	debugLog(dirs.length+' dirs');
	dirs.each(function(dir){
		nodo = creaNodoDir(dir);
		vgTree.nodos.push(nodo);
	})
	showArbolDirs();
}catch(e){alert(e.message);}
}

function ecoGetTreeFich(resp){
try{
	var nodo;
	var fichs = resp.responseText.split('\n');
	debugLog(fichs.length+' fichs');
	fichs.each(function(fich){
		nodo = creaNodoDir(fich);
		vgTree.nodos.push(nodo);
	})
	showArbolFichs();
}catch(e){alert(e.message);}
}

function getTreeDirs(root){
	vgTree.nodos = new Array();
	ajaxGetTreeFS(root,'DIR',ecoGetTreeDir);
}

function getTreeFichs(root){
	vgTree.nodos = new Array();
	ajaxGetTreeFS(root,'FICH',ecoGetTreeDir);
}
function editDirStd(ix){
   vgArbol.arbol4edit = vgTree.arbol; // no clone!!!
	var nodo = vgTree.arbol.getNodoByIx(ix);
	var frm = creaEdNodoArbol(ix,nodo);
	modal = new retoModal(frm);
	modal.show();	
}

function editDirStd(){
   vgTree.arbol.setEditor('editDirStd(IXNODO)');
   vgTree.arbol.show('EDIT');
}
