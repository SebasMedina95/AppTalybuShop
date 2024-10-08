<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# API GATEWAY #
Aplicación de enrutamiento para los diferentes microservicios. Aquí establecemos la comunicación
entre los clientes y los servicios. Recibimos las peticiones, y las enviamos a través de los 
micros correspondientes y devolver una respuesta.

``Nombre del Micro servicio:`` apigw-talybushop

### Desarrollado por: ###
* **Desarrollador de Backend**: Juan Sebastian Medina Toro.
* **Enlaces Comunicación**: [Enlace a Linkedin](https://www.linkedin.com/in/juan-sebastian-medina-toro-887491249/).
* **Portafolio Trabajo**: [Mi Portafolio](https://github.com/SebasMedina95).
* **Enlace Aplicación**: [Talybu Shop](https://github.com/SebasMedina95/AppTalybuShop.git).
* **Asistencias de Desarrollo**: No.
* **Frontend de comunicación**: No.

--------------------------------------------------------------------------------------------
### Despliegue en ambiente de desarrollo:

1. Clonar repositorio.
2. Instalar dependencias con el comando ``npm install``
3. Crear archivo ``.env`` basado en el ``.env.template``
4. Levantar el servidor de NATS (Verificación)
5. Levantar los micro servicios que generan dependencias
6. Levantar este micro usando el comando ``npm run start:dev``

--------------------------------------------------------------------------------------------
### Recordar que el comando de NATS nativo para su uso es:
``NOTA: Para ejecutar este comando debemos estar parados en la carpeta donde esta el archivo de configuración nats.conf para que lo tome.`` El archivo de configuración lo tendremos solamente acá en el gateway para la
ejecución, como punto de consideración importante.
````
docker run -d --name talybushop-nats-server -p 4222:4222 -p 8222:8222 -v "${pwd}/nats.conf:/etc/nats/nats.conf" nats:latest -c /etc/nats/nats.conf
````
Donde con --name generamos el nombre de la imagen y definimos los puertos requeridos, para más detalle podríamos
revisar la documentación en: https://hub.docker.com/_/nats. Vamos a trabajar con los puertos por defecto que nos
dice la documentación -p 4222:4222 -p 8222:8222, estos puertos tendrán la configuración inciial. 

Para verificar que todo esté en orden podemos ingresar
al link: http://localhost:8222/ en el ambiente local del sistema.

--------------------------------------------------------------------------------------------
### Levantar Aplicación / Construir el contenedor y la imagen simultaneamente:
Ejecutemos el siguiente comando para crear la imagen y montar el contenedor:
````
docker-compose --project-name apigw-container-talybu up --build -d
````
En este comando, le colocamos el nombre personalizado al contenedor de ``apigw-container-talybu`` usando --project-name.