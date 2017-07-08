#!/bin/bash
#[NOM:t2UserPwd.cgi][INFO:Graba usuario|password encriptados]

echo "Content-type: text/plain;charset=utf-8"
echo ""
read params
  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
 usr=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
 pwd=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id0:$id][hora:$ahora][cgi:$0][user:$usr]" >> $path/trazas

echo "Usuario:$usr" | md5sum >> $path/retoUsrsPwds.txt
echo $usr$pwd | md5sum >> $path/retoUsrsPwds.txt

echo "[error:$?]"
