# Producto 3: Backend con Express y GraphQL

Este proyecto implementa un servicio backend utilizando Express, Apollo Server (GraphQL) y MongoDB para gestionar usuarios y voluntariados, replicando la lógica del Producto 2.

-----

## 🚀 Instalación y Ejecución

1.  **Clonar el repositorio**

    ```bash
    git clone <tu-repo-url>
    cd producto-3
    ```

2.  **Instalar dependencias de Node.js**

    ```bash
    npm install
    ```

3.  **Iniciar la base de datos (Docker)**
    El proyecto utiliza Docker Compose para levantar el contenedor de MongoDB y poblarlo con datos iniciales automáticamente.

    ```bash
    docker-compose up -d
    ```

4.  **Iniciar el servidor de desarrollo**
    El servidor se iniciará en `http://localhost:3000`.

    ```bash
    npm run dev
    ```

-----

## 🐳 Comandos Útiles de Docker

  * **Levantar el contenedor en segundo plano:**

    ```bash
    docker-compose up -d
    ```

  * **Detener y eliminar el contenedor Y el volumen de datos:**
    *(Esto es útil para forzar la reinicialización de los datos de `mongo-init.js`)*

    ```bash
    docker-compose down -v
    ```

-----

## 🍃 Comandos de MongoDB (Verificación)
Pasos para conectarse al shell de MongoDB dentro del contenedor de Docker y verificar que los datos se han cargado correctamente.

1.  **Abrir un shell `bash` dentro del contenedor:**

    ```bash
    docker exec -it mongo-producto3 bash
    ```

2.  **Conectarse al shell de Mongo con credenciales:**

    ```bash
    mongosh -u admin -p pass
    ```

3.  **Una vez dentro, ejecutar los siguientes comandos:**

    ```bash
    # Cambiar a la base de datos correcta
    use producto3

    # Mostrar las colecciones (deberías ver 'users' y 'voluntariados')
    show collections

    # Mostrar todos los usuarios en formato legible
    db.users.find().pretty()

    # Mostrar todos los voluntariados en formato legible
    db.voluntariados.find().pretty()
    ```