#!/bin/bash
#[NOM:k0GetQryORCL.cgi][INFO:Ejecuta la sentencia SQL en Oracle]

echo "Content-type: text/plain;charset=utf-8"
echo ""

read params

  id=$(echo $params |cut -d'&' -f1 | cut -d'=' -f2)
  bd=$(echo $params |cut -d'&' -f2 | cut -d'=' -f2)
path=$(echo $params |cut -d'&' -f3 | cut -d'=' -f2)
stmt=$(echo $params |cut -d'&' -f4 | cut -d'=' -f2)

ahora=$(date +%Y%m%d-%H%M%S)
echo "[id:$id][hora:$ahora][cgi:$0][fich:$bd]" >> $path/trazas
temp=$path/../temp

NL=$'\n'
echo "connect $bd$NL" > "$temp/stmt_$id.sql"
echo "spool $temp/ORA_$id.log$NL" >> "$temp/stmt_$id.sql"
echo "set linesize 1500$NL" >> "$temp/stmt_$id.sql"
echo "set pagesize 1000$NL" >> "$temp/stmt_$id.sql"
echo "set colsep |$NL" >> "$temp/stmt_$id.sql"
echo "set underline off$NL" >> "$temp/stmt_$id.sql"
echo "set trimspool ON$NL" >> "$temp/stmt_$id.sql"

echo $stmt > "$temp/aux1_$id.txt"
. base64.sh -a decode -f "$temp/aux1_$id.txt" >> "$temp/stmt_$id.sql"

echo "$NL" >> "$temp/stmt_$id.sql"
echo "spool off$NL" >> "$temp/stmt_$id.sql"

sop=$(cat /etc/issue | head -n 1 | cut -d' ' -f1)

if [ $sop = "CentOS" ]
then
	export ORACLE_HOME=/u01/app/oracle/product/11.2.0/xe
	export ORACLE_SID=XE
	export PATH=$PATH:$ORACLE_HOME/bin/
else
	export ORACLE_HOME=/usr/lib/oracle/xe/app/oracle/product/10.2.0/server
	export ORACLE_SID=XE
	export PATH=$PATH:$ORACLE_HOME/bin/
fi

sqlplus /nolog @"$temp/stmt_$id.sql" > "$temp/nada"
echo $sop >> "$temp/nada"
# Para eliminar los espacios junto a |
cat "$temp/ORA_$id.log" | sed 's/  //g' | sed 's/ |/|/g' | sed 's/| /|/g' | sed '/./!d'

