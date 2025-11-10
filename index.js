// app.js

// 1. Importa el módulo Express
const express = require('express');

// 2. Crea una instancia de la aplicación Express
const app = express();
const port = 3000; // Define el puerto del servidor

// 3. Define una ruta básica (Endpoint)
app.get('/', (req, res) => {
  res.send('¡Hola Mundo desde Express!');
});

// 4. Inicia el servidor para escuchar peticiones
app.listen(port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${port}`);
});