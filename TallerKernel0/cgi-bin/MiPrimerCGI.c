//MiPrimerCGI.c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void main(void){
	printf("Content‐type:text/html\n\n");
	printf("<HTML>\n<HEAD>\n<TITLE>CGI.c</TITLE>\n</HEAD>\n");
	printf("<BODY BGCOLOR=\"#FFFFFF\">\n<P ALIGN=CENTER>\n");
	printf("<BR>SERVER_NAME=%s\n",getenv("SERVER_NAME"));
	printf("<BR>SERVER_SOFTWARE=%s\n",getenv("SERVER_SOFTWARE"));
	printf("<BR>REQUEST_METHOD=%s\n",getenv("REQUEST_METHOD"));
	printf("<BR>HTTP_REFERED=%s\n",getenv("HTTP_REFERED"));
	printf("<BR>SCRIPT_NAME=%s\n",getenv("SCRIPT_NAME"));
	printf("<BR>QUERY_STRING=%s\n",getenv("QUERY_STRING"));
	printf("<BR>REMOTE_HOST=%s\n",getenv("REMOTE_HOST"));
	printf("</P>\n</BODY>\n</HTML>");
}