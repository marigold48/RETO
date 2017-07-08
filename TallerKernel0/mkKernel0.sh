#!/bin/bash
#--------------------------------------------------------------------
# mkKernel0.sh
# Construye el entorno para la aplicación Kernel0 de Reto
#--------------------------------------------------------------------

usage()
{
cat << EOF
Uso: [sudo] $0 options

Construye el entorno de desarrollo para la aplicación Kernel0 de Reto

OPTIONS:
   -h		Muestra este mensaje
   -a		All: resetea PATHS y regenera todo. EJECUTAR con 'sudo' !!!!
   -b		BORRA: Borra todos los paths. EJECUTAR con 'sudo' !!!!
   -c		CLEAR: ficheros seguridad (*~)
   -d		DIRS: Regenera Paths
   -l		LIB:  actualiza libs javascript
   -m		MODEL:  Crea los contenidos iniciales
   -x		CGI:  actualiza sólo scripts CGI
   -v		VERBOSE : Muestra los paths
   -w		WEB:  actualiza sólo Web (html, js, css, etc). Es el más usado
   
EOF
}

ALL=
BORRA=
CLEAR=
DIRS=
LIBS=
MODEL=
CGI=
VERBOSE=
WEB=

while getopts “habcdlmxvw” OPTION
do
	case $OPTION in
		h)
			usage
			exit
			;;
		a)
			ALL=1
			;;
		b)
			BORRA=1
			;;
		c)
			CLEAR=1
			;;
		d)
			DIRS=1
			;;
		l)
			LIBS=1
			;;
		m)
			MODEL=1
			;;
		x)
			CGI=1
			;;
		v)
			VERBOSE=1
			;;
		w)
			WEB=1
			;;
		?)
			usage
			exit 1
			;;
	esac
done

# Establecer Paths --------------------------------------------------

	dirBase="/home/reto/RETO/TallerKernel0"
	dirModel="/home/reto/Apps/Kernel0"
	dirWeb="/var/www/html/Kernel0"
	dirCGI="/usr/lib/cgi-bin/Kernel0"

# Imprimir Paths ----------------------------------------------------
if [[ $VERBOSE ]]
then
	echo $dirBase
	echo $dirModel
	echo $dirWeb
	echo $dirCGI
fi

# Borra todo ---------------------------------------------------
if [[ $BORRA ]] 
then
# Eliminar directorios Web y CGI
	if [ -d $dirWEb ]
	then 
		rm -rf $dirWeb
	fi

	if [ -d $dirModel ]
	then 
		rm -rf $dirModel
	fi
	if [ -d $dirCGI ]
	then 
		rm -rf $dirCGI
	fi
	echo "Borrar PATHS"
fi

# Regenerar Paths ---------------------------------------------------
if [[ $DIRS ]] 
then

# Recrear Directorios WEB
	mkdir $dirWeb
	mkdir $dirWeb/js 
	mkdir $dirWeb/lib 

	mkdir $dirModel
	mkdir $dirModel/temp
	mkdir $dirModel/admin


# Recrear Directorios CGI
	mkdir $dirCGI
	echo "Regenerar PATHS"
fi



if [[ $CLEAR ]]
then
	find $dirBase/html -iname "*~" -exec rm '{}' \;
	find $dirBase/cgi-bin -iname "*~" -exec rm '{}' \;
fi

# Copiar librerias Javascript ----------------------------------------
if [[ $LIBS ]]
then
	cp $dirBase/lib/* $dirWeb/lib -R
	chown -R www-data:www-data $dirWeb
	chmod -R 777 $dirWeb/*
	echo "Librerias copiadas"
fi

# Copiar ficheros Web -----------------------------------------------
if [[ $WEB ]]
then
	cp $dirBase/html/*.html $dirWeb
#	cp html/*.pdf $dirWeb
	cp $dirBase/html/js/*.js $dirWeb/js
#	cp html/css/*.css $dirWeb/css

	chown -R www-data:www-data $dirWeb
	chmod -R 777 $dirWeb/*
	echo "Ficheros Web copiados"
fi


# Copiar ficheros CGI -----------------------------------------------
if [[ $CGI ]]||[[ $ALL ]]
then
	cp $dirBase/cgi-bin/*.cgi $dirCGI
	cp $dirBase/cgi-bin/*.sh $dirCGI
	cp $dirBase/cgi-bin/*.py $dirCGI
	chmod +x $dirCGI/*
	chown -R www-data:www-data $dirCGI
	echo "Ficheros CGI copiados"
fi

date +%X

