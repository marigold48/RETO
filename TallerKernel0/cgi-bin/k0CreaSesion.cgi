#!/bin/bash
#[NOM:k0CreaSesion.cgi][INFO:Genera una Sesion RETO]
echo "Content-type: text/plain;charset=utf-8"
echo ""
read params
  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
tira=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
sop=$(cat /etc/issue | head -1)
echo "[id0:$id][hora:$ahora][cgi:$0][fich:NdN]" >> $path/trazas
echo "[id0:$id][hora:$ahora][SO:$sop]$tira" >> $path/retoSesiones.txt

echo "[error:$?]"

