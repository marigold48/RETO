#!/bin/bash
#[NOM:k0GrabaFich.cgi][INFO:Reemplaza el texto de un fichero]

echo "Content-type: text/plain;charset=utf-8"
echo ""

read params
  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
fich=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
info=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id0:$id][hora:$ahora][cgi:$0][fich:$fich]" >> $path/trazas

echo $info > $path/../temp/"aux1_$id.txt"
. base64.sh -a decode -f $path/../temp/"aux1_$id.txt" > $path/$fich

echo "[error:$?]"
