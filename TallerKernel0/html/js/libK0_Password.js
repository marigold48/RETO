var vgPwd = {
	aleph_t   : '',
	ok        : 0,
	filas     : new Array(),
	laFila    :'',
	cabecera  : '',
	usuario   : '',
	users     : '',
	proys     : '',
	roles     : '',
	mkUsrPwd  : 't4UserPwd.cgi',
	cambiaPwd : 't4CambiaPwd.cgi',

}

function ecoGetFilaUsr(resp){
   var filas = new Array();
   var lineas = resp.responseText.split('\n');
   var error = lineas.pop();
   if (!error) var error = lineas.pop();
   console.log(error);
   
   var caps = lineas.splice(0,1)[0];
   
   lineas.each(function(lin,ix){
      var fila = csv2hash(caps,lin);
      filas.push(fila);
   })
   vgPwd.usuario = filas[0];
   var cod = vgPwd.usuario.get('cod');
   var usr = vgPwd.usuario.get('usr');
   var nom = vgPwd.usuario.get('nom');
   console.log('Usuario: '+nom);
   $('nomUsr').update(nom);
}



function cierraSesion(){
   window.location = "login.html";
}

//------------------------------------------------------------------- Crea Usuario/Password

function ajaxCambiaPwd (usr,pwd0,pwd1,eco){
	var params = '';
	params += 'id='+vgComun.idSesion;
	params += '&usr='+usr;
	params += '&pwd0='+pwd0;
	params += '&pwd1='+pwd1;
	var cgi = vgComun.pathCGIs + vgPwd.cambiaPwd;
	retoAjaxPost(params,cgi,eco);
}

function ecoCambiaPassword(resp){
   alert(resp.responseText);
   hideModal();
}

function cambiaPassword1(){
	var frm  = $('frmCambiaPwd');
	var str  = frm.serialize(true);
	var hash = $H(str);
	var user = hash.get('usr');
	var pwd0 = hash.get('pwd0');
	var pwd1 = hash.get('pwd1');
	var pwd2 = hash.get('pwd2');
	console.log(user+':'+pwd0+':'+pwd1+':'+pwd2)
	if (user && pwd0 && pwd1 && pwd2 && (pwd1 == pwd2) && (pwd0 != pwd1)){
		ajaxCambiaPwd (user,pwd0,pwd1,ecoCambiaPassword);	// cambia la entrada encriptada en el FS (retoUsrsPwds.txt) !!!!
	}
	else {alert('DATOS_INCORRECTOS'); }	

	hideModal();

	return false;
}

function cambiaPassword(){
	var usr = vgPwd.usuario.get('usr');
	var frm = creaFormCambiaPwd(usr);
	var modal = new retoModal(frm);
}

function editPwdUser(){
	var frm = $('frmAltaUser');
	var str = frm.serialize(true);
	var hFila = $H(str);
	var usr = hFila.get('usr');
	var frm = creaFormCambiaPwd(usr);
	var modal = new retoModal(frm);

}

