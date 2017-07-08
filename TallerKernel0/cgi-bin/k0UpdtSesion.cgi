#!/bin/bash
#[NOM:t2UpdtSesion.cgi][INFO:Actualiza la Sesion que contiene el IdSesion]

echo "Content-type: text/plain;charset=utf-8"
echo ""
read params
  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
tira=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id0:$id][hora:$ahora][cgi:$0][fich:NdN]" >> retoSYS/trazas


cat retoSYS/retoSesiones.txt | grep -v $id > temp/"aux1_$id.txt" 
cat temp/"aux1_$id.txt" >  retoSYS/retoSesiones.txt
echo $tira >> retoSYS/retoSesiones.txt

echo "[error:$?]"
