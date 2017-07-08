#!/bin/bash
#[NOM:k0GetTreesFS.cgi][INFO:Listado de ficheros para DirFS. Modos DIR|FICH]

echo "Content-type: text/plain;charset=utf-8"
echo ""

read params
  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
 dir=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
modo=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id0:$id][hora:$ahora][cgi:$0][fich:$dir.$modo]" >> $path/trazas

if [ $modo = "DIR" ]
then
  find -L $dir -type d | sort
  
elif [ $modo = "STAT" ]
then
  for D in $( find -L $dir -type d )
  do
  echo $D
  ls $D | wc -l
  done
   
else
  find -L $dir | sort
fi
echo "[error:$?]"
