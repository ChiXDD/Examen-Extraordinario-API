const express = require('express');
const app = express();
const routes = require('./routes/routes');
const dotenv = require('dotenv');

//Configura DotEnv
dotenv.config();

// Middleware para parsear JSON
app.use(express.json());

// Rutas generales
app.use('/', routes);

// Puerto en el que escucha el servidor
const PORT = 3002;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}/`);
});