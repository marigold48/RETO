
function creaListaAltaArcos(nodox,grafo,titulo){
   var id0 = nodox.get('id0');

   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Tabla '+nodox.get('tag'));
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Crear claves (<small>Foreign keys</small>)');
               mb.appendChild(p1);
               var form = new Element ('form',{id:'frmListaAltaArcos'});
               mb.appendChild(form);

               var select = new Element('select',{multiple:true,name:'mlista',size:8});
               form.appendChild(select);
               var nodos = grafo.getNodos();

               nodos.each(function(nodo,ix){
                  if (!ix) null;
                  else if (nodo.get('id0') == id0) null;
                  else{
                     var opc = new Element('option');
                     opc.value = nodo.get('id0');
                     opc.text = nodo.get('tag');
                     select.appendChild(opc);
                  }
                 });
               
            var mf = new Element('div',{ className:"modal-footer"}); 
            mc.appendChild(mf);
               var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:addArcosGrafo('+id0+')'}).update('Acepta');
               mf.appendChild(btnOK);
               var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
               mf.appendChild(btnKO);
  
   return md;

}

function creaFormListaRamas(id0,lista){
   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update('Ramas');
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);
               var p1 = new Element('p').update('Lista de Ramas)');
               mb.appendChild(p1);

               var form = new Element ('form',{id:'frmListaRamas'});
               mb.appendChild(form);

               var select = new Element('select',{name:'mlista', className:'form-control',multiple:false,size:8});
               form.appendChild(select);

               lista.each(function(item,ix){
                  var opc = new Element('option');
                  opc.value = item.id0;
                  opc.text = item.nombre;
                  select.appendChild(opc);
                 });
               
            var mf = new Element('div',{ className:"modal-footer"}); 
            mc.appendChild(mf);
               var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:addNodoRama('+id0+')'}).update('Acepta');
               mf.appendChild(btnOK);
               var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
               mf.appendChild(btnKO);
  
   return md;

}
