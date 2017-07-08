#!/bin/bash
#----------------------------------------------------------
# TallerHotel.sh
# hace una copia en el servidor 1AND1
# de Hotel
#----------------------------------------------------------

dirSrcLocal="/home/reto/RETO/TallerKernel0"
dirSrcRemoto="/home/reto/"
ahora=$(date +%y%m%d-%H)
mins=$(date +%M)

#segs=$(date +%s)
#let orig=$segs-3153600
#let granos=$orig/300
let "granos = mins - (mins % 15)"
zip -r Zips/Hotel_$ahora$granos.zip TallerKernel0/html/* TallerKernel0/cgi-bin/* 

cp rbackupKernel0.sh TallerKernel0

rsync -a -v $dirSrcLocal reto@reto-labs.es:$dirSrcRemoto

