#!/bin/bash
#[NOM:k0CambiaPwd.cgi][INFO:Cambia usuario|password encriptados]

echo "Content-type: text/plain;charset=utf-8"
echo ""
read params
  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
 usr=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
pwd0=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
pwd1=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f5 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id0:$id][hora:$ahora][cgi:$0][user:$usr]" >> $path/trazas

tira=$(echo $usr$pwd0 | md5sum)

cat $path/retoUsrsPwds.txt | grep -v $tira > $path/../temp/"aux1$id"

echo $usr$pwd1 | md5sum >>  $path/../temp/"aux1$id"

cat $path/../temp/"aux1$id" > $path/retoUsrsPwds.txt

echo "[error:$?]"
