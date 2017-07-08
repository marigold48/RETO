var vgUsers = {
   aleph_t   : '',
   accion    : '',
   ok        : 0,
   filas     : new Array(),
   laFila    :'',
   cabecera  : '',
   usuario   : '',
   users     : '',
   proys     : '',
   roles     : '',
   mkUsrPwd  : 'k0UserPwd.cgi',
   cambiaPwd : 'k0CambiaPwd.cgi',
   dbase : '',
   dbpath : ''
}

//------------------------------------------------------------------- Crea Usuario/Password
function ajaxCreaUsrPwd (usr,pwd,eco){
   var params = '';
   params += 'id='+vgComun.idSesion;
   params += '&usr='+usr;
   params += '&pwd='+pwd;
   params += '&path='+vgComun.pathApp;
   var cgi = vgComun.pathCGIs + vgUsers.mkUsrPwd;
   retoAjaxPost(params,cgi,eco);
}

function ajaxCambiaPwd (usr,pwd0,pwd1,eco){
   var params = '';
   params += 'id='+vgComun.idSesion;
   params += '&usr='+usr;
   params += '&pwd0='+pwd0;
   params += '&pwd1='+pwd1;
   params += '&path='+vgComun.pathApp;
   var cgi = vgComun.pathCGIs + vgUsers.cambiaPwd;
   retoAjaxPost(params,cgi,eco);
}

//------------------------------------------------------------------- Check inputs
//  textbox.scrollIntoView(); ???
function checkTBoxAleph(ev){
   var elem = ev.element();
   if (elem.value.length <5) {elem.style.color = 'red'; elem.focus();}
   else elem.style.color = 'black';
}
//------------------------------------------------------------------- Show Filas Aleph
function showFilasAleph(caps,filas){
   var th,tr,td,icon,a;
   var tabla = new Element('table',{className:'table table-stripped'});
   caps.split('|').each(function(tag,ix){
         if (tag == 'id0') tag = 'Edit';
         th = new Element('th').update(tag);
         tabla.appendChild(th);
      })
   var tbody = new Element('tbody');
   tabla.appendChild(tbody);

   filas.each(function(fila,iFila){
      tr = new Element('tr');
      tbody.appendChild(tr);
      caps.split('|').each(function(clau,ix){
         if (clau == 'id0') {
            icon = new Element('i',{className:'fa fa-pencil'})
            a = new Element('a',{href:'javascript:editFilaAleph('+iFila+')'}).update(icon);
            td = new Element('td').update(a);
            tr.appendChild(td);
            }
         else {
            td = new Element('td').update(fila.get(clau));
            tr.appendChild(td);
            }
         })
      })
   var frmBtns = creaFormCRUD();
   frmBtns.style.marginLeft ='30px';
   tabla.style.marginLeft ='30px';
   $(vgComun.divBase).update(frmBtns);
   $(vgComun.divBase).appendChild(tabla);
}

//------------------------------------------------------------------- Query Aleph
function generaFilasAleph(lineas){
   var filas = new Array();
   var error = lineas.pop();
   if (!error) var error = lineas.pop();
   console.log(error);
   
   var caps = lineas.splice(0,1)[0];
   console.log('Caps genera: '+caps);
   lineas.each(function(lin,ix){
         var fila = csv2hash(caps,lin);
         filas.push(fila);
   })
   
   vgUsers.filas = filas;
   vgUsers.cabecera = caps;
   showFilasAleph(caps,filas);
}

function ecoQueryAleph(resp){
   console.log(resp.responseText);
   var lineas = resp.responseText.split('\n');
   
   if (lineas.length > 2) generaFilasAleph(lineas);
}

// Llamada AJAX SQL Users
function ajaxUsersSQL(sqlStmt,eco){
   var id = vgComun.hSesion.get('id0');
   ajaxQuerySQLite(id,vgComun.dbaseUsr,sqlStmt,vgComun.pathApp,eco);

}

//------------------------------------------------------------------------------------ Get Filas

function getFilasLigas(){
   var sqlStmt = 'select * from ligas order by kusr,proy,krol;';
   ajaxUsersSQL(sqlStmt,ecoQueryAleph);
}

function getFilasProys(){
   var sqlStmt = 'select * from proyectos;';
   ajaxUsersSQL(sqlStmt,ecoQueryAleph);
}

function getFilasRoles(){
   var id = vgComun.hSesion.get('id0');
   var sqlStmt = 'select * from roles;';
   ajaxQuerySQLite(id,vgComun.dbaseUsr,sqlStmt,vgComun.pathApp,ecoQueryAleph);
}

function getFilasUsers(){
  var sqlStmt = 'select * from usuarios;';
   ajaxUsersSQL(sqlStmt,ecoQueryAleph);
}

//------------------------------------------------------------------- Eco Alta Filas
function ecoEditFilaAleph(){
   null;
}
function ecoAltaFilasAleph(resp){
   switch(vgUsers.aleph_t){
      case 'LIGA' : getFilasLigas(); break;
      case 'PROY' : getFilasProys(); break;
      case 'USER' : getFilasUsers(); break;
      case 'ROLE' : getFilasRoles(); break;
   }
}

//------------------------------------------------------------------- Ligas Usr-Proy-Rol
function bajaFilaLigas(){
   var frm = $('formAltaLiga');
   var str = frm.serialize(true);
   var hash = $H(str);
   var id0 = hash.get('id0');
   var sqlStmt = 'delete from ligas where id0='+id0+';'
   ajaxUsersSQL(sqlStmt,ecoAltaFilasAleph);
   hideModal();
}

function updtFilaLigas(ixF){
   var frm = $('formAltaLiga');
   var str = frm.serialize(true);
   var hFila = $H(str);
   if (ixF == -1) vgUsers.filas.push(hFila);
   else vgUsers.filas[ixF] = hFila;
   console.log('Cap: '+vgUsers.cabecera);
   showFilasAleph(vgUsers.cabecera,vgUsers.filas);
   hideModal();
}

function saveFilasLigas(){
   var template = new Template("#{id0}, '#{kusr}','#{proy}', '#{krol}', '#{bloq}'");
   var arr = new Array();
   vgUsers.filas.each(function(fila){
      var valores = template.evaluate(fila);
      var sqlStmt = 'insert or replace into ligas (id0,kusr,proy,krol,bloq)values ('+valores+');';
         arr.push(sqlStmt)
      })
   var strTotal =  arr.join('\n');
   console.log(strTotal);
   ajaxUsersSQL(strTotal,ecoAltaFilasAleph);

   return false;
}




function editFilaLigas(ix){
   var frm = creaFormAltaLiga(vgUsers.laFila,ix);
   var modal = new retoModal(frm);
}

function altaFilaLigas(){
   var frm = creaFormAltaLiga(null,-1);
   var modal = new retoModal(frm);
}

//------------------------------------------------------------------- Proyectos
function borraFilaProy(){
   vgUtils.debug = true;
   var frm = $('frmAltaProy');

   var str = frm.serialize(true);
   var hash = $H(str);
   var id0 = hash.get('id0');
   var sqlStmt = 'delete from proyectos where id0='+id0+';'
   ajaxUsersSQL(sqlStmt,ecoAltaFilaAleph);
   hideModal();
}

function updtFilaProys(ixF){
    var color, aborta = false;
   var frm = $('frmAltaProy');


   var str = frm.serialize(true);
   var hFila = $H(str);
   
   if (ixF == -1){
      vgUsers.filas.push(hFila);
      var pur = new Hash();  // proy-usr-rol
      pur.set('tabla','PROYS');
      pur.set('cod',hFila.get('cod'));
      pur.set('nom',hFila.get('nom'));
      vgUsers.proys.push(pur);

   } 
   else vgUsers.filas[ixF] = hFila;
   showFilasAleph(vgUsers.cabecera,vgUsers.filas);
   hideModal();
}

function saveFilasProys(){
   var template = new Template("#{id0}, '#{cod}', '#{nom}','#{alta}','#{info}'");
   var arr = new Array();
   vgUsers.filas.each(function(fila){
      var valores = template.evaluate(fila);
         var sqlStmt = 'insert or replace into proyectos (id0,cod,nom,alta,info) values ('+valores+');';
         arr.push(sqlStmt)
      })
   var strTotal =  arr.join('\n');
   console.log(strTotal);
   ajaxUsersSQL(strTotal,ecoAltaFilasAleph);

   return false;
}

function editFilaProys(ix){
   var frm = creaFormAltaProy(vgUsers.laFila,ix);
   var modal = new retoModal(frm);
}

function altaFilaProys(){
   var frm = creaFormAltaProy(null,-1);
   var modal = new retoModal(frm);
}


//------------------------------------------------------------------- Roles / Proyecto
function borraFilaRole(){
   vgUtils.debug = true;
   var frm = $('frmAltaRole');

   var str = frm.serialize(true);
   var hash = $H(str);
   var id0 = hash.get('id0');
   var sqlStmt = 'delete from proyectos where id0='+id0+';'
   ajaxUsersSQL(sqlStmt,ecoAltaFilaAleph);
   hideModal();
}

function updtFilaRoles(ixF){
    var color, aborta = false;
   var frm = $('frmAltaRole');


   var str = frm.serialize(true);
   var hFila = $H(str);
   
   if (ixF == -1){
      vgUsers.filas.push(hFila);
      var hRol = new Hash(); 
      hRol.set('tabla','ROLES');
      hRol.set('proy',hFila.get('proy'));
      hRol.set('cod',hFila.get('cod'));
      hRol.set('nom',hFila.get('nom'));
      hRol.set('url',hFila.get('url'));
      vgUsers.roles.push(hRol);

   } 
   else vgUsers.filas[ixF] = hFila;
   showFilasAleph(vgUsers.cabecera,vgUsers.filas);
   hideModal();
}

function saveFilasRoles(){
   var template = new Template("#{id0}, '#{cod}', '#{nom}'");
   var arr = new Array();
   vgUsers.filas.each(function(fila){
      var valores = template.evaluate(fila);
         var sqlStmt = 'insert or replace into roles (id0,cod,nom) values ('+valores+');';
         arr.push(sqlStmt)
      })
   var strTotal =  arr.join('\n');
   console.log(strTotal);
   ajaxUsersSQL(strTotal,ecoAltaFilasAleph);

   return false;
}

function actualizaListaRoles(ev){
   var elem = ev.element();
   var kproy = elem.value;
   var lista = $('listaRoles');
   lista.update();
   vgUsers.roles.each(function(role){
    if (role.get('proy') == kproy){
      opt = new Element('option');
      opt.value = role.get('cod');
      opt.text  = role.get('nom');
      lista.appendChild(opt);
      }
    })

}

function editFilaRoles(ix){
   var frm = creaFormAltaRole(vgUsers.laFila,ix);
   var modal = new retoModal(frm);
}

function altaFilaRoles(){
   var frm = creaFormAltaRole(null,-1);
   var modal = new retoModal(frm);
}




//------------------------------------------------------------------- Usuarios
function ecoCreaUserPwd(resp){
   console.log('ecoCreaUserPwd: '+resp.responseText);
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
      ajaxCambiaPwd (user,pwd0,pwd1,ecoCreaUserPwd);  // cambia la entrada encriptada en el FS (retoUsrsPwds.txt) !!!!
   }
   else {alert('DATOS_INCORRECTOS'); } 

   hideModal();

   return false;
}

function cambiaPassword(){
   var usr = vgUsers.usuario.get('usr');
   var frm = creaFormCambiaPwd(usr);
   var modal = new retoModal(frm);
}

function updtPwdUser(){
   var frm = $('frmAltaUser');
   var str = frm.serialize(true);
   var hFila = $H(str);
   var usr = hFila.get('usr');
   var frm = creaFormCambiaPwd(usr);
   var modal = new retoModal(frm);

}

function saveFilasUsers(){
   var template = new Template("#{id0}, '#{cod}','#{usr}', '#{nom}','#{mail}'");
   var arr = new Array();
   vgUsers.filas.each(function(fila){
      var valores = template.evaluate(fila);
         var sqlStmt = 'insert or replace into usuarios (id0,cod,usr,nom,mail) values ('+valores+');';
         arr.push(sqlStmt)
      })
   var strTotal =  arr.join('\n');
   console.log(strTotal);
   var id = vgComun.hSesion.get('id0');
   ajaxUsersSQL(strTotal,ecoAltaFilasAleph);

   return false;
}

function updtFilaUsers(ixF){
   var frm = $('frmAltaUser');
   var str = frm.serialize(true);
   var hFila = $H(str);

   if (ixF == -1){
      var pwd1 = hFila.unset('pwd1');
      var pwd2 = hFila.unset('pwd2');
      var user = hFila.get('usr');
      if (pwd1 == pwd2)  ajaxCreaUsrPwd (user,pwd1,ecoCreaUserPwd);;
      vgUsers.filas.push(hFila); 
      saveFilasUsers();
      var pur = new Hash();  // proy-usr-rol
      pur.set('tabla','USERS');
      pur.set('cod',hFila.get('cod'));
      pur.set('nom',hFila.get('nom'));
      vgUsers.users.push(pur);
   }
   else {
      vgUsers.filas[ixF] = hFila;
      showFilasAleph(vgUsers.cabecera,vgUsers.filas);
   }
   hideModal();
}

function editFilaUsers(ix){
   var frm = creaFormAltaUser(vgUsers.laFila,ix);
   var modal = new retoModal(frm);
}

function altaFilaUsers(){
   var frm = creaFormAltaUser(null,-1);
   var modal = new retoModal(frm);
}

//------------------------------------------------------------------- Get Filas Aleph
function getFilasAleph(){
   switch(vgUsers.aleph_t){
      case 'LIGA' : getFilasLigas(); break;
      case 'PROY' : getFilasProys(); break;
      case 'USER' : getFilasUsers(); break;
      case 'ROLE' : getFilasRoles(); break;
   }
}
//------------------------------------------------------------------- Edit Filas Aleph
function editFilaAleph(ix){
   vgUsers.laFila = vgUsers.filas[ix];
   switch(vgUsers.aleph_t){
      case 'LIGA' : editFilaLigas(ix); break;
      case 'PROY' : editFilaProys(ix); break;
      case 'USER' : editFilaUsers(ix); break;
      case 'ROLE' : editFilaRoles(ix); break;
  }
}

//------------------------------------------------------------------- Alta Filas Aleph
function altaFilaAleph(){
   switch(vgUsers.aleph_t){
      case 'LIGA' : altaFilaLigas(); break;
      case 'PROY' : altaFilaProys(); break;
      case 'USER' : altaFilaUsers(); break;
      case 'ROLE' : altaFilaRoles(); break;
   }
}

//------------------------------------------------------------------- Alta Filas Aleph
function saveFilasAleph(){
   switch(vgUsers.aleph_t){
      case 'LIGA' : saveFilasLigas(); break;
      case 'PROY' : saveFilasProys(); break;
      case 'USER' : saveFilasUsers(); break;
      case 'ROLE' : saveFilasRoles(); break;
   }
}

//------------------------------------------------------------------- Administración
function adminProys(){
   var rol = vgComun.hSesion.get('rol');
   if (rol == 'ADMIN'){
    vgUsers.aleph_t = 'PROY'; 
   getFilasAleph();
   $('nbBrand').update('Proyectos');
   }
   else alert('Usuario no autorizado');
}

function adminLigas(){
   var rol = vgComun.hSesion.get('rol');
   if (rol == 'ADMIN'){
   vgUsers.cabecera = 'id0|kusr|proy|krol|bloq';
   vgUsers.aleph_t = 'LIGA'; 
   getFilasAleph();
   $('nbBrand').update('Ligas');
   }
   else alert('Usuario no autorizado');
}

function adminUsers(){
   var rol = vgComun.hSesion.get('rol');
   if (rol == 'ADMIN'){
      vgUsers.aleph_t = 'USER'; 
      getFilasAleph();
   }
   else alert('Usuario no autorizado');
}

function adminRoles(){
   var rol = vgComun.hSesion.get('rol');
   if (rol == 'ADMIN'){
   vgUsers.aleph_t = 'ROLE'; 
   getFilasAleph();
   $('nbBrand').update('Roles / Proyecto');
   }
   else alert('Usuario no autorizado');
}


//------------------------------------------------------------------- Carga texto CSV 
function generaFilasCSV(){
	var frm = $('frmGetCSV');
	var str = frm.serialize(true);
	var hash = $H(str);
	var text = hash.get('txtCSV');
	var lineas = text.split('\n');
	lineas.each(function(lin,ix){
	   id0 = getId(7,1);
	   fila = csv2hash(vgUsers.cabecera,id0+'|'+lin);
	   vgUsers.filas.push(fila);
	})
	hideModal();
	showFilasAleph(vgUsers.cabecera,vgUsers.filas);

}

function cargaCSV(){
   vgUsers.aleph_t = 'USER';
   vgUsers.filas = new Array();
   vgUsers.cabecera = 'id0|cod|usr|nom|mail';
   var frm = creaFormGetCSV('cod|usr|nom|mail',null);
   var modal = new retoModal(frm);
}
//------------------------------------------------------------------- Genera CSV mediante Tabla editable
function muestraTablaCSV(){
var table = document.getElementById("retoEdCSV");
for (var i = 0, row; row = table.rows[i]; i++) {
   for (var j = 0, col; col = row.cells[j]; j++) {
     console.log(i+','+j+' = '+col.innerHTML);
   }  
}
}


function generaCSV(){
   $('btnSalva').on('click', muestraTablaCSV);
   var malla = new retoEdCSV();
   malla.setTagsCols('1:A|2:B|3:C');
   malla.setTagsRows('1:1|2:2|3:3');
   var tabla = malla.show();
   $('divBase').update(tabla);
}



//------------------------------------------------------------------- I N I C I A L I Z A C I O N

// ------------------------------------------------------------------ Init Usr,Proy,Roles
function separaFilasLigas(resp){
   var filas = new Array();
   vgUsers.users = new Array();
   vgUsers.roles = new Array();
   vgUsers.proys = new Array();
   
   var lineas = resp.responseText.split('\n');
   var error = lineas.pop();
   if (!error) var error = lineas.pop();
   console.log(error);
   
   var caps = lineas.splice(0,1)[0];
   
   lineas.each(function(lin,ix){
         var fila = csv2hash(caps,lin);
         filas.push(fila);
   })

   var tabla;
   
   filas.each(function(fila,ix){
      tabla = fila.get('tabla');
      switch (tabla){
         case 'USERS' : vgUsers.users.push(fila); break;
         case 'PROYS' : vgUsers.proys.push(fila); break;
         case 'ROLES' : vgUsers.roles.push(fila); break;
         }
      })


}

function getUsrProyRols(){
   var id  = vgComun.hSesion.get('id0');

   var sqlStmt = '';
   sqlStmt += 'select \'USERS\' tabla,cod,nom from usuarios '
   sqlStmt += ' union ';
   sqlStmt += 'select \'PROYS\' tabla,cod,nom from proyectos '
   sqlStmt += ' union ';
   sqlStmt += 'select \'ROLES\' tabla,cod,nom from roles;'
   console.log(sqlStmt);
   ajaxUsersSQL(sqlStmt,separaFilasLigas);
}



