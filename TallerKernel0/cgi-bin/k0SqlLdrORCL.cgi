#!/bin/bash
#[NOM:k0SqlLdrORCL.cgi][INFO:Carga datos con SqlLoader en una tabla Oracle ]

echo "Content-type: text/plain;charset=utf-8"
echo ""

read params

  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
  bd=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
  SO=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
stmt=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f5 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)

conn=$(echo $bd | cut -d'@' -f2)
echo "[id:$id][hora:$ahora][cgi:$0][conn:$conn]" >> $path/trazas

echo $stmt > $path/../temp/"b64_$id.txt"
. base64.sh -a decode -f $path/../temp/"b64_$id.txt" > $path/../temp/"load_$id.ctl"

if [ $SO = CENTOS ]
then
	export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe
	export ORACLE_SID=XE
	export PATH=$PATH:$ORACLE_HOME/bin/
else
	export ORACLE_HOME=/usr/lib/oracle/xe/app/oracle/product/10.2.0/server
	export ORACLE_SID=XE
	export PATH=$PATH:$ORACLE_HOME/bin/
fi

sqlldr $bd control=$path/../temp/"load_$id.ctl"

echo "[error:$?]"