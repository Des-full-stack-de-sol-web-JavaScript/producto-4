# Producto 4: FullStack con Backend con Express y GraphQL y FrontEnd con Vanilla JS

Este proyecto implementa un servicio backend utilizando Express, Apollo Server (GraphQL) y MongoDB para gestionar usuarios y voluntariados, replicando la lógica del Producto 2.

---

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

3.  **Configurar Variables de Entorno**
    Crea un archivo llamado `.env` en la raíz del proyecto y añade la cadena de conexión a la base de datos:

    ```env
    MONGO_URI=mongodb://admin:pass@localhost:27017/producto3?authSource=admin
    ```

4.  **Iniciar la base de datos (Docker)**
    Levanta el contenedor de MongoDB utilizando Docker Compose.

    ```bash
    docker-compose up -d
    ```

5.  **Carga de Datos (Seed)**
    Ejecuta el script de "semilla" para **limpiar la base de datos y cargar los datos iniciales**.
    *Nota: Este script encripta automáticamente las contraseñas y resetea las colecciones.*

    ```bash
    npm run seed
    ```

6.  **Iniciar el servidor de desarrollo**
    El servidor se iniciará en `https://localhost:3000`.

    ```bash
    npm run dev
    ```

---

## 🐳 Comandos Útiles de Docker

* **Levantar el contenedor en segundo plano:**

    ```bash
    docker-compose up -d
    ```

* **Detener y eliminar el contenedor Y el volumen de datos:**
    *(Útil si quieres eliminar la persistencia de la base de datos completamente)*

    ```bash
    docker-compose down -v
    ```

---

## 🍃 Comandos de MongoDB (Verificación)

Pasos para conectarse al shell de MongoDB dentro del contenedor de Docker y verificar que los datos se han cargado correctamente tras ejecutar el seed.

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