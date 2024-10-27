import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import router from './routes/transaccion.routes.js';

const app = express();

// Configuracion
app.set('port', process.env.PORT || 3000);

// Middleware para parsear JSON
app.use(express.json());
app.use(
  cors({
    origin: 'http://localhost:8081',
  })
);
app.use(morgan('dev'));

// Rutas
app.use(router);

export default app;
