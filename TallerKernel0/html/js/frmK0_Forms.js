function pickItemList(){
   
}
function creaFormLista(titulo,lista,fn){
   var md = new Element('div',{ className:"modal-dialog"}); 
         var mc = new Element('div',{ className:"modal-content"}); 
         md.appendChild(mc);
            var mh = new Element('div',{ className:"modal-header"}); 
            mc.appendChild(mh);
               var btn1 = new Element('button',{type:"button", className:"close", onclick:'javascript:hideModal()'}).update('&times;');
               mh.appendChild(btn1);
               var h4 = new Element('h4',{className:"modal-title"}).update(titulo);
               mh.appendChild(h4);
               
            var mb = new Element('div',{ className:"modal-body"}); 
            mc.appendChild(mb);

               var form = new Element ('form',{id:'frmLista'});
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
               var btnOK = new Element('button',{type:"button", className:"btn btn-success",onclick:'javascript:pickItemList()'}).update('Acepta');
               mf.appendChild(btnOK);
               var btnKO = new Element('button',{type:"button", className:"btn btn-danger",onclick:'javascript:hideModal()'}).update('Cancela');
               mf.appendChild(btnKO);
  
   return md;

}
