#!/bin/bash
#----------------------------------------------------------
# deployKernel0.sh
# Construye el entorno para el proyecto Taller de Reto
# en el servidor 1AND1
#----------------------------------------------------------

dirWebLocal="/var/www/html/Kernel0"
dirAppLocal="/home/reto/Apps/Kernel0"
dirCGILocal="/usr/lib/cgi-bin/Kernel0"

dirWebRemota="/var/www/vhosts/reto-labs.es/httpdocs"
dirAppRemota="/home/reto/Apps"
dirCGIRemota="/var/www/cgi-bin"

sudo chmod 777 $dirCGILocal/* -R
#sudo rm $dirCGILocal/temp/*

usage()
{
cat << EOF
Uso: [sudo] $0 options

Construye el entorno de desarrollo para la aplicación Taller2 de Reto

OPTIONS:
   -h		Muestra este mensaje
   -a		ALL:  actualiza todo (WEB+CGI)
   -w		WEB:  actualiza sólo Web (html, js, css, etc). Es el más usado
   -x		CGI:  actualiza sólo scripts CGI
   -v		VERBOSE : Muestra los paths
   

EOF
}

ALL=
APP=
WEB=
CGI=
VERBOSE=

while getopts “hamwx” OPTION
do
	case $OPTION in
		h)
			usage
			exit
			;;
		a)
			ALL=1
			;;
		m)
			APP=1
			;;
		w)
			WEB=1
			;;
		x)
			CGI=1
			;;
		v)
			VERBOSE=1
			;;
		?)
			usage
			exit 1
			;;
	esac
done


# Imprimir Paths ----------------------------------------------------
if [[ $VERBOSE ]]
then
	echo $dirWebLocal
	echo $dirCGILocal
	echo $dirWebRemota
	echo $dirCGIRemota
fi



# Copiar ficheros Web -----------------------------------------------
if [[ $WEB ]]||[[ $ALL ]]
then
	rsync -a -v $dirWebLocal root@reto-labs.es:$dirWebRemota
	echo "Ficheros Web copiados"
fi

# Copiar ficheros App -----------------------------------------------
if [[ $APP ]]||[[ $ALL ]]
then
	rsync -a -v $dirAppLocal root@reto-labs.es:$dirAppRemota
	echo "Ficheros App copiados"
fi

# Copiar ficheros CGI -----------------------------------------------
if [[ $CGI ]]||[[ $ALL ]]
then
	rsync -a -v $dirCGILocal root@reto-labs.es:$dirCGIRemota
	echo "Ficheros CGI copiados"
fi


date +%X


#rsync -a -v $dirWebLocal root@reto-labs.es:$dirWebRemota
#rsync -a -v $dirCGILocal root@reto-labs.es:$dirCGIRemota

