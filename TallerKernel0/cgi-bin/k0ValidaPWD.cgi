#!/bin/bash
#[NOM:k0ValidaPWD.cgi][INFO:Extrae lineas usuario|password encriptados, y retorna el num lineas coincidentes]

echo "Content-type: text/plain;charset=utf-8"
echo ""

read params
  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
 usr=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
 pwd=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id0:$id][hora:$ahora][cgi:$0][user:$usr]" >> $path/trazas
tira=$(echo $usr$pwd | md5sum)
cat $path/retoUsrsPwds.txt | grep $tira | wc -l

