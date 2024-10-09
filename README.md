<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# APLICACIÓN DE COMERCIO ELECTRÓNICO TALYBU SHOP #

### Desarrollado por: ###
* **Desarrollador de Backend**: Juan Sebastian Medina Toro.
* **Enlaces Comunicación**: [Enlace a Linkedin](https://www.linkedin.com/in/juan-sebastian-medina-toro-887491249/).
* **Portafolio Trabajo**: [Mi Portafolio](https://github.com/SebasMedina95).
* **Enlace Aplicación**: [Talybu Shop](https://github.com/SebasMedina95/AppTalybuShop.git).
* **Asistencias de Desarrollo**: No.
* **Frontend de comunicación**: No.

-------------------------------------------------------------------------------------------

Aplicación de comercio de electrónico donde se realizará la venta de prodcutos
y se realizarán procesos de pagos según condiciones establecidas, así mismo, la
aplicación constará desde el adjunto de imágenes para los productos así como 
también el envío de correos electrónicos para las facturas así como registro de
usuarios y también conexión a pasarelas de pago. Hay varios temas que se estarán 
considerando sobre el desarrollo y se irá escalando cada tema según vayan 
ocurriendo con diferentes soluciones

Esta aplicación esta desarrollada en NestJS y se encuentra basada en una 
arquitectura de Microservicios, se manejarán bases de datos independientes 
por micros y usaremos contenedores de Docker para el manejo de estás, así 
como también, serán bases de datos PostgreSQL y también el ORM de Prisma
nos permitirá el manejo de las consultas.

Para la conectividad entre los micros, usaremos el Brocker de mensajería de
NATS y configuraremos el proyecto para este tema. Se implementará el sistema
de autenticación así como autorización para la simulación no solo del proceso
transaccional de ventas, sino también para el manejo de un administrador de
contenido para la gestión de los productos, categorías, subcategorías, ordenes
entre otras funcionalidades que habrán embebidas.

Es importante destacar que esta aplicación, su manejo de versiones y micros
se hará a partir de un Mono Repo, para el mejor manejo de versionamiento y
para que la revisión del mismo no sea tan complejo en caso de que un reclutador
desee revisar el tema.

### Comando de limpieza del caché de GIT para nuevos proyectos

Este comando fue requerido para el manejo del mono repo. Para ello estaremos disponiendo
del comando:
````
git rm -r --cached ms-products/ ms-orders-headers/ ms-orders-details ms-payments/ ms-supplies/
````
Donde tenemos que ms-products/ ms-orders-headers/ ms-orders-details ms-payments/ ms-supplies/
son los proyectos, la idea es que, al eliminar el .git que tiene cada carpeta para contenerlo
dentro del monorepo para facilidad de desarrollo pueda reconocer los commits generales de aplicación
desde mi monorepo.

# Micro Servicios
A continuación presentamos una tabla de contenido con los micros que vamos a trabajar en este
proyecto:

| Micros        | Estado          | Proyecto           | Descripción                              |
|---------------|--------------------------------------|------------------------------------------|-|
| Gateway       | `En_Proceso`    | apigw-talybushop   | Enrutador de las peticiones              |-|
| Productos     | `Finalizado`    | ms-products        | Productos, categorías y subcategorías    |-|
| Ordenes       | `Finalizado`    | ms-orders-headers  | Ordenes de Pago y Ordenes de Provisión   |-|
| Pagos         | `Sin_Empezar`   | ms-payments        | Gestionar los pagos de las ordenes       |-|
| Auth          | `Sin_Empezar`   | -                  | Autenticación y Autorización             |-|
| Envíos        | `Sin_Empezar`   | -                  | Envíos de emails y futuramente de SMS    |-|
| Garantías     | `Sin_Empezar`   | -                  | Manejo de garantías de las ordenes       |-|
| Testimoniales | `Sin_Empezar`   | -                  | Opiniones de productos por clientes      |-|
| Informes      | `Sin_Empezar`   | -                  | Reportería de los productos              |-|

### Comandos para despliegue en desarrollo.
Ubicados en cada microservicio levantamos el docker-compose que corresponda, cada micro tiene su docker-compose
excepto el el API GATEWAY, este tiene dos, uno que es el propio del micro y otro que viene siendo para NATS, el
cual tiene una configuración específica para operar. En este orden de ideas, lo primero es levantar/crear la red
en la que estarán funcionando los micros, para ello, podemos usar los comandos:

* Para listar las redes y verificar: ``docker network ls``
* Para crear la red si no está: ``docker network create talybu_network``
* Para inspeccionar que los contenedores estén en la misma red: ``docker network inspect talybu_network``

Ahora, para el tema de los contenedores, lo harémos por micro servicios:
1. **API GATEWAY (apigw-talybushop)**
* Primero levantamos el contenedor de NATS usando el comando:

``docker-compose -f docker-compose-nats.yml --project-name nats-container-talybu up --build -d``

* Segundo levantamos el gateway para la comunicación con los micros:

``docker-compose -f docker-compose.yml --project-name apigw-container-talybu up --build -d``


2. **MICRO SERVICIO DE PRODUCTOS (ms-products)**
* Ejecutamos el comando:

``docker-compose -f docker-compose.yml --project-name products-container-talybu up --build -d``

3. **MICRO SERVICIO DE ORDENES (ms-orders-headers)**

``docker-compose -f docker-compose.yml --project-name orders-container-talybu up --build -d``


Al ejecutar el de cada micro servicio, por medio de Docker Desktop o por medio de la terminal de comandos debemos
verificar el estado de los contenedores, que no exista ningún problema. Si todo funciona bien, los puertos estarán
adecuadamente conectados para tomar la información y conectarnos externamente a la base de datos. A continuación
proporcionamos un ejemplo de conexión:


| Configuración         | Valor                     | |
|-----------------------|---------------------------|-|
| **HOST**              | localhost                 |-|
| **PORT**              | 25001                     |-|
| **BASE DE DATOS**     | talybushop-products-db    |-|
| **NOMBRE DE USUARIO** | user-products-talybushop  |-|
| **CONTRASEÑA**        | talybushop-products-12345 |-|
