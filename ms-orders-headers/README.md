<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>


# API ORDERS HEADERS #
Aplicación para manejar los productos, categorías, subcategorías y proveedores de productos en la aplicación en generalidad.
La aplicación tiene implementada el adjunto de archivos para las imágenes y el esquema relacional respectivo.

``Nombre del Micro servicio:`` ms-orders-headers

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
4. Levantar los micro servicios que generan dependencias
5. Levantar el servidor de NATS (Verificación)
6. Levantar la base de datos con ``docker-compose up -d``
7. Levantar este micro usando el comando ``npm run start:dev``