var vgSess = {
   usuario   : '',
   idSesion  : '',
	pathCGIs  : '/cgi-bin/Kernel0/',
	pathApps  : '',
	esOkSess  : 'k0EsOkSesion.cgi',
	updtSess  : 'k0UpdtSesion.cgi',
	mkUsrPwd  : 'k0UserPwd.cgi',
	cambiaPwd : 'k0CambiaPwd.cgi',
	passwdOK  : 'k0ValidaPWD.cgi',
	initSess  : 'k0CreaSesion.cgi',

}

function creaFormCambiaPwd(usr){
   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Cambio de password');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Entrar password actual, y el nuevo password 2 veces');
               mb.appendChild(p1);
				var form = new Element('form',{id:'frmCambiaPwd'});
			    mb.appendChild(form);
				var lblPwd0 = new Element('label',{id:'pwd0'}).update('Password actual');
				var lblPwd1 = new Element('label',{id:'pwd1'}).update('Password nuevo');
				var lblPwd2 = new Element('label',{id:'pwd2'}).update('Password nuevo');
				var txtUser = new Element('input',{type:'hidden',name:'usr',className:'form-control'});
				var txtPwd0 = new Element('input',{type:'password',name:'pwd0',className:'form-control'});
				var txtPwd1 = new Element('input',{type:'password',name:'pwd1',className:'form-control'});
				var txtPwd2 = new Element('input',{type:'password',name:'pwd2',className:'form-control'});

				txtUser.value = usr;
			   
				form.appendChild(txtUser);

				form.appendChild(lblPwd0);
				form.appendChild(txtPwd0);
				form.appendChild(lblPwd1);
				form.appendChild(txtPwd1);
				form.appendChild(lblPwd2);
				form.appendChild(txtPwd2);
               
		var mf = new Element('div',{ className:"modal-footer"}); 
        mc.appendChild(mf);

        var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:cambiaPassword1()'}).update('Acepta');
        mf.appendChild(btnOK);
        var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
        mf.appendChild(btnKO);
  
   return md;

}

//------------------------------------------------------------------- Inicia Sesion
function ajaxUpdateSesion (tira,eco){
	var params = '';
	params += 'id='+vgSess.idSesion;
	params += '&tira='+tira;
	var cgi = vgSess.pathCGIs + vgSess.updtSess;
	retoAjaxPost(params,cgi,eco);
}


//------------------------------------------------------------------- Cambiar Password

function ecoCambiaPassword(resp){
   alert(resp.responseText);
   hideModal();
}

function ajaxCambiaPwd (id,usr,pwd0,pwd1,path,eco){
	var params = '';
	params += 'id='+id;
	params += '&usr='+usr;
	params += '&pwd0='+pwd0;
	params += '&pwd1='+pwd1;
	params += '&path='+path;
	var cgi = vgSess.pathCGIs + vgSess.cambiaPwd;
	retoAjaxPost(params,cgi,eco);
}



function cambiaPassword1(){
	var frm  = $('frmCambiaPwd');
	var str  = frm.serialize(true);
	var hash = $H(str);
	var user = hash.get('usr');
	var pwd0 = hash.get('pwd0');
	var pwd1 = hash.get('pwd1');
	var pwd2 = hash.get('pwd2');
	var id = vgComun.hSesion.get('id');
	console.log(user+':'+pwd0+':'+pwd1+':'+pwd2)
	if (user && pwd0 && pwd1 && pwd2 && (pwd1 == pwd2) && (pwd0 != pwd1)){
		ajaxCambiaPwd (id,user,pwd0,pwd1,vgSess.pathApps,ecoCambiaPassword);	// cambia la entrada encriptada en el FS (retoUsrsPwds.txt) !!!!
	}
	else {alert('DATOS_INCORRECTOS'); }	

	hideModal();

	return false;
}

function cambiaPassword(pathApps){
	vgSess.pathApps = pathApps;
	var usr = vgSess.usuario.get('usr');
	var frm = creaFormCambiaPwd(usr);
	var modal = new retoModal(frm);
}


//------------------------------------------------------------------- Valida Sesion
function abortaSesion(){
   alert('SESION_ABORTADA');
   return false;
}

//------------------------------------------------------------------- Valida Sesion

function ajaxValidaSesion (id,path,eco){
	var params = '';
	params += 'id='+id;
	params += '&path='+path;
	var cgi = vgSess.pathCGIs + vgSess.esOkSess;
	retoAjaxPost(params,cgi,eco);
}

function validaSesion(path,eco){

	var params = getParamsHTML();
	vgSess.idSesion = params.get('id');
	console.log('id sess:' + vgSess.idSesion);
	vgSess.params = params;
	  if (!vgSess.idSesion) abortaSesion();
	else { ajaxValidaSesion(vgSess.idSesion,path,eco); return false;}
} 

