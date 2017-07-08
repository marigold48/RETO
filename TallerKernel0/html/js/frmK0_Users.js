function creaFormCRUD(){
	var frm = new Element('form');
	var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:saveFilasAleph()'}).update('Acepta');
	frm.appendChild(btnOK);
	var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
	frm.appendChild(btnKO);
	var nuevo = new Element('button',{type:"button", className:"btn btn-default",onclick:'javascript:altaFilaAleph()'}).update('Nuevo');
	frm.appendChild(nuevo);
	return frm;
}

function creaFormAltaProy(fila,ixP){
   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Proyectos');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Modificar campos del proyecto');
               mb.appendChild(p1);
				var form = new Element('form',{id:'frmAltaProy'});
			    mb.appendChild(form);

				var lblClau = new Element('label',{id:'lblCod'}).update('Código');
				var lblName = new Element('label',{id:'lblNom'}).update('Nombre');
				var lblInfo = new Element('label',{id:'lblInfo'}).update('Descripción');
				var lblAlta = new Element('label',{id:'lblAlta'}).update('Fecha');
				var txtClau = new Element('input',{type:'text',name:'cod',className:'form-control'});
				var txtName = new Element('input',{type:'text',name:'nom',className:'form-control'});
				var txtAlta = new Element('input',{type:'text',name:'alta',className:'form-control'});
				var txtInfo = new Element('input',{type:'text',name:'info',className:'form-control'});

				form.appendChild(lblClau);
				form.appendChild(txtClau);
//				form.appendChild(new Element('br'));
				

				form.appendChild(lblName);
				form.appendChild(txtName);
//				form.appendChild(new Element('br'));

				form.appendChild(lblAlta);
				form.appendChild(txtAlta);

				form.appendChild(lblInfo);
				form.appendChild(txtInfo);
//				form.appendChild(new Element('br'));

			    if (!fila){
			    	var id0 = new Element('input',{type:'text',name:'id0',value:getId(7,1)});
				   form.appendChild(id0);

			    } 
			   	else {
			      var id0 = new Element('input',{type:'text',name:'id0',value:fila.get('id0')});
				   form.appendChild(id0);

			      txtClau.value = fila.get('cod');
			      txtName.value = fila.get('nom');
			      txtAlta.value = fila.get('alta');
			      txtInfo.value = fila.get('info');
			      }
               
            var mf = new Element('div',{ className:"modal-footer"}); 
            mc.appendChild(mf);
               var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:editFilaProys('+ixP+')'}).update('Acepta');
               mf.appendChild(btnOK);
               var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
               mf.appendChild(btnKO);
  
   return md;

}

function creaFormAltaRole(fila,ixP){
   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Roles');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Modificar campos del Rol');
               mb.appendChild(p1);
				var form = new Element('form',{id:'frmAltaRole'});
			    mb.appendChild(form);

				var lblClau = new Element('label',{id:'lblCod'}).update('Código');
				var lblName = new Element('label',{id:'lblNom'}).update('Nombre');
				var txtClau = new Element('input',{type:'text',name:'cod',className:'form-control'});
				var txtName = new Element('input',{type:'text',name:'nom',className:'form-control'});

				form.appendChild(lblClau);
				form.appendChild(txtClau);
				

				form.appendChild(lblName);
				form.appendChild(txtName);


			    if (!fila){
			    	var id0 = new Element('input',{type:'text',name:'id0',value:getId(7,1)});
				   form.appendChild(id0);

			    } 
			   	else {
			      var id0 = new Element('input',{type:'text',name:'id0',value:fila.get('id0')});
				   form.appendChild(id0);

			      txtClau.value = fila.get('cod');
			      txtName.value = fila.get('nom');
			      }
               
            var mf = new Element('div',{ className:"modal-footer"}); 
            mc.appendChild(mf);
               var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:updtFilaRoles('+ixP+')'}).update('Acepta');
               mf.appendChild(btnOK);
               var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
               mf.appendChild(btnKO);
  
   return md;

}

function creaFormAltaUser(fila,ixP){
	var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Usuarios');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Modificar campos del usuario');
               mb.appendChild(p1);
				var form = new Element('form',{id:'frmAltaUser'});
			    mb.appendChild(form);

	         var lblClau = new Element('label',{id:'clau'}).update('Codigo');
	         var lblUser = new Element('label',{id:'user'}).update('Usuario');
	         var lblName = new Element('label',{id:'name'}).update('Nombre');
	         var lblMail = new Element('label',{id:'mail'}).update('e-mail');
	         var lblPwd1 = new Element('label',{id:'pwd1'}).update('Password');
	         var lblPwd2 = new Element('label',{id:'pwd2'}).update('Password');
	         var txtClau = new Element('input',{type:'text',name:'cod',className:'form-control'});
	         var txtUser = new Element('input',{type:'text',name:'usr',className:'form-control'});
	         var txtName = new Element('input',{type:'text',name:'nom',className:'form-control'});
	         var txtMail = new Element('input',{type:'text',name:'mail',className:'form-control'});
	         var txtPwd1 = new Element('input',{type:'password',name:'pwd1',className:'form-control'});
	         var txtPwd2 = new Element('input',{type:'password',name:'pwd2',className:'form-control'});

            
	         form.appendChild(lblClau);
	         form.appendChild(txtClau);
	
	         form.appendChild(lblUser);
	         form.appendChild(txtUser);

	         form.appendChild(lblName);
	         form.appendChild(txtName);

	         form.appendChild(lblMail);
	         form.appendChild(txtMail);

	
 
             if (!fila){
             	var id0 = new Element('input',{type:'text',name:'id0',value:getId(7,1)});
		         form.appendChild(lblPwd1);
		         form.appendChild(txtPwd1);
		         form.appendChild(lblPwd2);
		         form.appendChild(txtPwd2);
		         form.appendChild(id0);
	             } 
            	else {
	             var id0 = new Element('input',{type:'text',name:'id0',value:fila.get('id0')});
		         form.appendChild(id0);

		         txtClau.value = fila.get('cod');
		         txtUser.value = fila.get('usr');
		         txtName.value = fila.get('nom');
		         txtMail.value = fila.get('mail');
		         }
               
		var mf = new Element('div',{ className:"modal-footer"}); 
        mc.appendChild(mf);
        if (fila){
        	var bRole = new Element('button',{type:"button", className:"btn btn-default",onclick:'javascript:editLigasUser('+ixP+')'}).update('Roles');
        	mf.appendChild(bRole);
        	var btPwd = new Element('button',{type:"button", className:"btn btn-default",onclick:'javascript:editPwdUser('+ixP+')'}).update('Password');
        	mf.appendChild(btPwd);
        }

        var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:updtFilaUsers('+ixP+')'}).update('Acepta');
        mf.appendChild(btnOK);
        var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
        mf.appendChild(btnKO);
  
   return md;

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

function creaFormAltaLiga(fila,ixL){
   var users = vgUsers.users;
   var proys = vgUsers.proys;
   var roles = vgUsers.roles;
   var opt;

   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Roles de usuario');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Seleccionar las opciones adecuadas');
               mb.appendChild(p1);
				var form = new Element('form',{id:'formAltaLiga'});
			    mb.appendChild(form);

	var lblUser = new Element('label',{id:'user',className:'etiq'}).update('Usuario');
	var lblProy = new Element('label',{id:'proy',className:'etiq'}).update('Proyecto');
	var lblRole = new Element('label',{id:'role',className:'etiq'}).update('Rol');
	var lblBloq = new Element('label',{id:'bloq',className:'etiq'}).update('Acceso');
	
	var selUser = new Element ('select',{name:'kusr',className:'form-control'});
	users.each(function(user){
		opt = new Element('option');
		opt.value = user.get('cod');
		opt.text  = user.get('nom');
		selUser.appendChild(opt);
	})
	
	var selProy = new Element ('select',{name:'proy',className:'form-control'});
	proys.each(function(proy){
		opt = new Element('option');
		opt.value = proy.get('cod');
		opt.text  = proy.get('nom');
		selProy.appendChild(opt);
	})
	
	var selRole = new Element ('select',{name:'krol',className:'form-control'});
	roles.each(function(role){
		opt = new Element('option');
		opt.value = role.get('cod');
		opt.text  = role.get('nom');
		selRole.appendChild(opt);
	})

	var selBloq = new Element ('select',{name:'bloq',className:'form-control'});
		opt = new Element('option');
		opt.value = 'OK';
		opt.text  = 'Permitido';
		selBloq.appendChild(opt);
		opt = new Element('option');
		opt.value = 'KO';
		opt.text  = 'Bloqueado';
		selBloq.appendChild(opt);
               
	form.appendChild(lblUser);
	form.appendChild(selUser);
	form.appendChild(new Element('br'));
	form.appendChild(lblProy);
	form.appendChild(selProy);
	form.appendChild(new Element('br'));
	form.appendChild(lblRole);
	form.appendChild(selRole);
	form.appendChild(new Element('br'));
	form.appendChild(lblBloq);
	form.appendChild(selBloq);
	form.appendChild(new Element('br'));

   if (fila){
      var id0 = new Element('input',{type:'hidden',name:'id0',value:fila.get('id0')});
	  form.appendChild(id0);

      selUser.value = fila.get('kusr');
      selProy.value = fila.get('proy');
      selRole.value = fila.get('krol');
      selBloq.value = fila.get('bloq');
      }
      else {
      var id0 = new Element('input',{type:'hidden',name:'id0',value:getId(7,1)});
	  form.appendChild(id0);

      }

		var mf = new Element('div',{ className:"modal-footer"}); 
        mc.appendChild(mf);
        var icon = new Element('i',{className:'fa fa-trash'});
        var bBaja = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:bajaFilaLigas('+ixL+')'}).update(icon);
        mf.appendChild(bBaja);
         var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:updtFilaLigas('+ixL+')'}).update('Acepta');
        mf.appendChild(btnOK);
        var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
        mf.appendChild(btnKO);
  
   return md;

}


function creaFormPutCSV(campos,rows){
   var nodoI,nodoF,nodoC;
   
   var md = new Element('div',{id:"divEdTemas", className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Eliminar temas');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Entrar la info para generar un CSV.');
               mb.appendChild(p1);
               var malla = new retoEdCSV();
               malla.setTagsCols('1:A|2:B|3:C');
               malla.setTagsRows('1:1|2:2|3:3');
               var tabla = malla.show();
               mb.appendChild(tabla);
               
            var mf = new Element('div',{ className:"modal-footer"}); 
            mc.appendChild(mf);
               var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:generaTextoCSV()'}).update('Acepta');
               mf.appendChild(btnOK);
               var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
               mf.appendChild(btnKO);
  
   return md;

}


function creaFormGetCSV(campos,rows){
   var nodoI,nodoF,nodoC;
   
   var md = new Element('div',{id:"divEdTemas", className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Eliminar temas');
               mh.appendChild(h4);
               
               var mb = new Element('div',{ className:"modal-body"}); 
               mc.appendChild(mb);
            
               var p1 = new Element('p').update('Copia el CSV y pega en el área de Texto.');
               mb.appendChild(p1);
               var p1 = new Element('p').update('Formato: '+campos);
               mb.appendChild(p1);

               var form = new Element ('form',{id:'frmGetCSV'});
               mb.appendChild(form);
               var ta = new Element('textarea',{name:'txtCSV',className:'form-control'});
               form.appendChild(ta);
               
            var mf = new Element('div',{ className:"modal-footer"}); 
            mc.appendChild(mf);
               var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:generaFilasCSV()'}).update('Acepta');
               mf.appendChild(btnOK);
               var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
               mf.appendChild(btnKO);
  
   return md;

}

