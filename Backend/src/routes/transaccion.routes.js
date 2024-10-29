import cors from 'cors';
import { Router } from 'express';
import { metodosTransaccion } from '../controllers/transaccion.controller.js';

const router = Router();

router.post(
  '/login',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.loginUsuario
);

router.post(
  '/registrar',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.postRegistrar
);

router.get(
  '/  ',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getTransacciones
);

router.get(
  '/usuarios',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getUsuarios
);

router.get(
  '/prestamos',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getPrestamos
);

router.get(
  '/reportes',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getReportes
);

export default router;
