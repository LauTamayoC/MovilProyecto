import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import transaccionRouter from './routes/transaccion.routes.js';

const app = express();

// Configuración
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
app.use('/api', transaccionRouter);

export default app;
