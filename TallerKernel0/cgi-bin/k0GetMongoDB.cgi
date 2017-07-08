#!/bin/bash
#[NOM:t4GetMongoDB.cgi][INFO:Ejecuta la sentencia SQL en mongod]

echo "Content-type: text/plain;charset=utf-8"
echo ""

read params

  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
  bd=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
stmt=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id:$id][hora:$ahora][cgi:$0][fich:$bd]" >> $path/trazas


#echo ".headers ON" > temp/"stmt_$id.sql"
echo $stmt > $path/../temp/"b64_$id.txt"
. base64.sh -a decode -f $path/../temp/"b64_$id.txt" > $path/../temp/"mongo_$id.txt"

cat $path/../temp/"mongo_$id.txt" | mongo $bd

echo "[error:$?]"

