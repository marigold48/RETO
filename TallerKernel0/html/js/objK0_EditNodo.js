
function getNodoMask(id0,id1,num,geo,tau,cod,tag,etc,txt){
   var mask = getNodoStd(cod,tag,etc,txt);
   mask.set('id0',id0);
   mask.set('id1',id1);
   mask.set('num',num);
   mask.set('geo',geo);
   mask.set('tau',tau);
   return mask;
}

function clickBtnEditNodo(boton){
	var nodo = frm2nodo('frmEdNodo',true);
	var topol = boton.get('topol');
	var func = boton.get('func');
	func(nodo,topol);
}

function frm2nodo(frmId,reset){
	var nodo = getNodoStd();
	var frm = $(frmId);

	nodo.set('id0',frm.id0.value);
	nodo.set('id1',frm.id1.value);
	nodo.set('num',frm.num.value);
	nodo.set('geo',frm.geo.value);
	nodo.set('tau',frm.tau.value);
	nodo.set('cod',frm.cod.value || 'NdN');
	nodo.set('tag',frm.tag.value || 'NdN');
	nodo.set('etc',frm.etc.value || 'NdN');
	nodo.set('txt',frm.txt.value || 'NdN');

	if (reset) hideModal();

	return nodo;
}

function nodo2frm(frmId,nodo){
	var frm = $(frmId);
	frm.id0.value = nodo.get('id0');
	frm.id1.value = nodo.get('id1');
	frm.num.value = nodo.get('num');
	frm.geo.value = nodo.get('geo');
	frm.tau.value = nodo.get('tau');
	frm.cod.value = (nodo.get('cod') == 'NdN') ? '' : nodo.get('cod');
	frm.tag.value = (nodo.get('tag') == 'NdN') ? '' : nodo.get('tag');
	frm.etc.value = (nodo.get('etc') == 'NdN') ? '' : nodo.get('etc');
	frm.txt.value = (nodo.get('txt') == 'NdN') ? '' : nodo.get('txt');
}

//=================================================================== Editor Nodos
var retoEditNodo = Class.create({
initialize : function(titulo,nodo,mask,botones,topol){
	this.titulo = titulo;
	this.nodo = nodo;
	this.mask = mask;
	this.botones = botones;
	this.dialog = '';
	this.topol = topol;
	this.creaCampos();
},
creaHeader : function(mh){
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update(this.titulo);
               mh.appendChild(h4);
},
creaBody : function(mb){
   var mskId0 = parseInt(this.mask.get('id0'));
   var mskId1 = parseInt(this.mask.get('id1'));
   var mskNum = parseInt(this.mask.get('num'));
   var mskGeo = this.mask.get('geo');
   var mskTau = this.mask.get('tau');
   var mskCod = this.mask.get('cod');
   var mskTag = this.mask.get('tag');
   var mskEtc = this.mask.get('etc');
   var mskTxt = this.mask.get('txt');
   
	var frm = new Element('form',{id:'frmEdNodo'});
	if (mskId0)	var iId0 = new Element('input',{name:'id0',type:'text',placeholder:'Id0', className:'form-control'});
   else var iId0 = new Element('input',{name:'id0',type:'hidden'});

	if (mskId1)	var iId1 = new Element('input',{name:'id1',type:'text',placeholder:'Id1', className:'form-control'});
   else var iId1 = new Element('input',{name:'id1',type:'hidden'});

	if (mskNum)	var iNum = new Element('input',{name:'num',type:'text',placeholder:'Num', className:'form-control'});
   else	var iNum = new Element('input',{name:'num',type:'hidden'});
   
	if (mskGeo != 'NdN')	var iGeo = new Element('input',{name:'geo',type:'text',placeholder:mskGeo, className:'form-control'});
   else	var iGeo = new Element('input',{name:'geo',type:'hidden'});

	if (mskTau != 'NdN')	var iTau = new Element('input',{name:'tau',type:'text',placeholder:mskTau, className:'form-control'});
   else	var iTau = new Element('input',{name:'tau',type:'hidden'});

	if (mskCod != 'NdN')	var iCod = new Element('input',{name:'cod',type:'text',placeholder:mskCod, className:'form-control'});
   else	var iCod = new Element('input',{name:'cod',type:'hidden'});

	if (mskTag != 'NdN')	var iTag = new Element('input',{name:'tag',type:'text',placeholder:mskTag, className:'form-control'});
   else var iTag = new Element('input',{name:'tag',type:'hidden'});

	if (mskEtc != 'NdN')	var iEtc = new Element('input',{name:'etc',type:'text',placeholder:mskEtc, className:'form-control'});
   else	var iEtc = new Element('input',{name:'etc',type:'hidden'});

	if (mskTxt != 'NdN') var iTxt = new Element('textarea',{name:'txt', rows:'5',placeholder:mskTxt,className:'form-control'});
   else	var iTxt = new Element('input',{name:'txt',type:'hidden'});

	frm.appendChild(iId0);
	frm.appendChild(iId1);
	frm.appendChild(iNum);
	frm.appendChild(iGeo);
	frm.appendChild(iTau);
	frm.appendChild(iCod);
	frm.appendChild(iCod);
	frm.appendChild(iTag);
	frm.appendChild(iEtc);
	frm.appendChild(iTxt); 

	frm.id0.value = this.nodo.get('id0');
	frm.id1.value = this.nodo.get('id1');
	frm.num.value = this.nodo.get('num');
	frm.geo.value = this.nodo.get('geo');
	frm.tau.value = this.nodo.get('tau');
	frm.cod.value = (this.nodo.get('cod') == 'NdN') ? '' : this.nodo.get('cod');
	frm.tag.value = (this.nodo.get('tag') == 'NdN') ? '' : this.nodo.get('tag');
	frm.etc.value = (this.nodo.get('etc') == 'NdN') ? '' : this.nodo.get('etc');
	frm.txt.value = (this.nodo.get('txt') == 'NdN') ? '' : this.nodo.get('txt');

    mb.appendChild(frm);

},
creaFooter : function(mf){
	this.botones.each(function(boton){
		var i = new Element('i',{className : boton.get('icoFA')});
		var btn = new Element('button',{className : boton.get('clase')}).update(i);
		btn.observe('click',function(){clickBtnEditNodo(boton);})
		mf.appendChild(btn);
	})
},
creaCampos : function(){
	this.dialog = new Element('div',{className :'modal-dialog'});
	var mc = new Element('div',{className:'modal-content'});
	var mh = new Element('div',{className:'modal-header'}); this.creaHeader(mh);
	var mb = new Element('div',{className:'modal-body'});this.creaBody(mb);
	var mf = new Element('div',{className:'modal-footer'});this.creaFooter(mf);
	mc.appendChild(mh);
	mc.appendChild(mb);
	mc.appendChild(mf);
	this.dialog.appendChild(mc);

},
show : function(){
	return this.dialog;
}
})

//------------------------------------------------------------------- Generación Botones Editor
function getBtnTxt(tag,clase,func,topol){
	var btn = getNodoStd('TEXTO',tag,clase,'javascript:'+ func);
	btn.set('topol',topol)
	return btn;
}
function getBtnIcon(cod,clase,func,topol){
	var btn = getNodoStd('fa fa-'+cod,cod,clase,'javascript:'+ func);
	btn.set('topol',topol)
	return btn;
}

function getBtnFA(ico,clase,func,topol){
	var btn = new Hash();
	btn.set('icoFA','fa fa-'+ico);
	btn.set('clase',clase);
	btn.set('func',func);
	btn.set('topol',topol)
	return btn;
}

function getBtnFA_OK(fn,topol){var btn = getBtnFA('check','btn btn-success',fn,topol); return btn;}
function getBtnFA_KO(fn,topol){var btn = getBtnFA('close','btn btn-warning',fn,topol); return btn;}
function getBtnFA_Hijo(fn,topol){var btn = getBtnFA('child','btn btn-info',fn,topol); return btn;}
function getBtnFA_Borra(fn,topol){var btn = getBtnFA('trash','btn btn-info',fn,topol); return btn;}
function getBtnFA_Sube(fn,topol){var btn = getBtnFA('arrow-up','btn btn-info',fn,topol); return btn;}
function getBtnFA_Baja(fn,topol){var btn = getBtnFA('arrow-down','btn btn-info',fn,topol); return btn;}
function getBtnFA_Tree(fn,topol){var btn = getBtnFA('tree','btn btn-info',fn,topol); return btn;}
function getBtnFA_Link(fn,topol){var btn = getBtnFA('link','btn btn-info',fn,topol); return btn;}

function getBtnsFA_OK_KO(fOK,topol){
	var nodos = new Array();
	var ok = getBtnFA_OK(fOK,topol);
	var ko = getBtnFA_KO('hideModal()',topol);
	nodos.push(ok);
	nodos.push(ko);
	return nodos;
}

//------------------------------------------------------------------- Sets de Botones STD
function getBtns_OK_KO(icono,fOK,topol){
	var nodos = new Array();
	if (icono){
		var ok = getBtnIcon('check','btn btn-success',fOK,topol);
		var ko = getBtnIcon('close','btn btn-warning','hideModal()',topol);
	}
	else {
		var ok = getBtnTxt('OK','btn btn-success',fOK);
		var ko = getBtnTxt('KO','btn btn-danger','hideModal()');
	}
	nodos.push(ok);
	nodos.push(ko);
	return nodos;
}

function getBtnsArbolStd(topol){
	var nodos = new Array();
	var borra = getBtnIcon('trash','btn btn-danger','borraNodoArbol("frmEdNodo")',topol);
	var sube =  getBtnIcon('arrow-up','btn btn-info','subeNodoArbol("frmEdNodo")',topol);
	var baja =  getBtnIcon('arrow-down','btn btn-info','bajaNodoArbol("frmEdNodo")',topol);
	var hijo =  getBtnIcon('child','btn btn-info','hijoNodoArbol("frmEdNodo")');

	var copia =  getBtnIcon('tree'  ,'btn btn-primary','copyRamaNodo("frmEdNodo")',topol);
	var pegar =  getBtnIcon('chain' ,'btn btn-primary','pegaRamaNodo("frmEdNodo")',topol);
	var ancla =  getBtnIcon('anchor','btn btn-primary','creaNodoAncla("frmEdNodo")',topol);
	nodos.push(copia);
	nodos.push(pegar);
	nodos.push(ancla);

	nodos.push(borra);
	nodos.push(sube);
	nodos.push(baja);
	nodos.push(hijo);
	var OKKO = getBtns_OK_KO(true,'grabaNodoArbol("frmEdNodo")',topol)
	var todo = nodos.concat(OKKO);
	return todo;
}

function getBtnsRamaArbol(){
	var nodos = new Array();
	var copia =  getBtnIcon('tree'  ,'btn btn-primary','copyRamaNodo("frmEdNodo")');
	var pegar =  getBtnIcon('chain' ,'btn btn-primary','pegaRamaNodo("frmEdNodo")');
	var ancla =  getBtnIcon('anchor','btn btn-primary','creaNodoAncla("frmEdNodo")');
	nodos.push(copia);
	nodos.push(pegar);
	nodos.push(ancla);
	var OKKO = getBtns_OK_KO(true,'grabaNodoArbol("frmEdNodo")')
	var todo = nodos.concat(OKKO);
	return todo;
}
