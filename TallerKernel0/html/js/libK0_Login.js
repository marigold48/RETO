var vgLogin = {
	pagHome : '',
	ligas : new Array(),
	filas : new Array(),
	usr : '',
	passwdOK : 'k0ValidaPWD.cgi',
	initSess : 'k0CreaSesion.cgi',
}


function creaFormInitSesion(){
   var filas = vgLogin.filas;
   
   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Iniciar sesión');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
            if (!filas.length){
               var p1 = new Element('p').update('Este usuario no tiene Roles asignados en ningún Proyecto');
               p1.style.color = 'red';
            }
			else var p1 = new Element('p').update('Seleccionar una de las siguientes opciones');
            mb.appendChild(p1);

	            var tmplt = new Template('Como  <b>#{NOMROL}</b> en proyecto : #{NOMPROY}');
            	filas.each(function(fila,ix){
            	   var p = new Element('p');
                  var a = new Element('a',{href:'javascript:inicioSesion('+ix+')'});
	               var str = tmplt.evaluate(fila);
	               console.log(str);
                  a.update(str);
                  p.appendChild(a);
                  mb.appendChild(p);
               	})

		var mf = new Element('div',{ className:"modal-footer"}); 
        mc.appendChild(mf);

        var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
        mf.appendChild(btnKO);
	
   return md;

}



//------------------------------------------------------------------- Valida Usuario/Password
function ajaxValidaPassword (usr,pwd,eco,path){
	var params = '';
	params += 'id=1234567'; // + vgComun.idSesion;
	params += '&usr='+usr;
	params += '&pwd='+pwd;
	params += '&path='+path;
	var cgi = vgComun.pathCGIs + vgLogin.passwdOK;
	retoAjaxPost(params,cgi,eco); // comun.js
}
//------------------------------------------------------------------- Inicia Sesion
function ecoInicioSesion(resp){
    document.location = vgLogin.pagHome+'?id='+vgComun.idSesion;
/*
	var pag = window.open(vgLogin.pagHome+'?id='+vgAjax.idSesion);
   if (!guay(pag))  alert('Desactiva pop-ups !!');
*/
}


function ajaxIniciaSesion (tira,eco){
	var params = '';
	params += 'id='+ vgComun.idSesion;
	params += '&tira='+tira;
	params += '&path='+ vgComun.pathApp;
	var cgi = vgComun.pathCGIs + vgLogin.initSess;
	retoAjaxPost(params,cgi,eco);
}



function inicioSesion(ix){
	var liga = vgLogin.filas[ix];
	var tmplt = new Template('[usr:#{USR}][proy:#{PROY}][rol:#{ROL}]');
	strLiga = tmplt.evaluate(liga);
	console.log('inicioSesion: '+strLiga);
	ajaxIniciaSesion(strLiga,ecoInicioSesion);
}

function showFormLigas(){
   if (vgLogin.filas.length == 1) inicioSesion(0);
   else {
	   var frm = creaFormInitSesion();
	   var modal = new retoModal(frm);
	   }

}

// Un mismo usuario puede tener varios roles en diferentes proyectos.
function ecoQueryLigas(resp){
	vgLogin.filas = new Array();
   
	var lineas = resp.responseText.split('\n');
	var error = lineas.pop();
	if (!error) var error = lineas.pop();
	console.log(error);
	var caps = lineas.splice(0,1)[0];
	console.log(caps);
	lineas.each(function(lin,ix){
		var fila = csv2hash(caps,lin);
		vgLogin.filas.push(fila);
	})
	console.log('Query devuelve '+vgLogin.filas.length+' filas');
	showFormLigas();
}

function ecoValidaPWD(resp){
	var str = resp.responseText;
	var n = parseInt(str);
	if (!n){ alert('Login erróneo !'); return false;}
	else if ( n === 1 ) {
		vgComun.idSesion = getId(9,1);
		var sqlStmt = 'select l.kusr USR,p.cod PROY,p.nom NOMPROY,r.cod ROL, r.nom NOMROL from proyectos p,roles r, ligas l where p.cod = l.proy and r.cod = l.krol '
		sqlStmt += ' and l.kusr in (select cod from usuarios where usr=\''+vgLogin.usr+'\');';
		console.log(sqlStmt);
		ajaxQuerySQLite(vgComun.idSesion,vgComun.dbaseUsr,sqlStmt,vgComun.pathApp,ecoQueryLigas);
		}
	else { alert('Usr/Pwd duplicados !'); return false;}
}

// pendiente de buscar un método de validación seguro con https
//	var tira = md5(usr+pwd);
//	alert(tira);
function validaPWD(){
	var usr = $('frmLogin')['USR'].value;
	var pwd = $('frmLogin')['PWD'].value;
	vgLogin.usr = usr;
   ajaxValidaPassword(usr,pwd,ecoValidaPWD,vgComun.pathApp);
}

