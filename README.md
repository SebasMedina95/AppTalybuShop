# APLICACIÓN DE COMERCIO ELECTRÓNICO TALYBU SHOP

### Comando de limpieza del caché de GIT para nuevos proyectos
Usando el comando:
````dockerfile
git rm -r --cached ms-products/ ms-orders-headers/ ms-orders-details ms-payments/ ms-supplies/
````
Donde tenemos que ms-products/ ms-orders-headers/ ms-orders-details ms-payments/ ms-supplies/
son los proyectos, la idea es que, al eliminar el .git que tiene cada carpeta para contenerlo
dentro del monorepo para facilidad de desarrollo pueda reconocer los commits generales de aplicación
desde mi monorepo.