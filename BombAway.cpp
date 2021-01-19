#include <iostream>
#include <stdlib.h>

int main()
{
printf("env\\Scripts\\activate.bat");
system("cd env\\Scripts");
system("activate.bat");
system("main.py");
return 0;
}