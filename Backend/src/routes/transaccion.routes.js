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
  '/transacciones',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getTransacciones
);

router.get(
  '/transaccioneshistory',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getTransaccionesHistory
);

router.post(
  '/transaccion',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.postTransaccion
);

router.get(
  '/usuarios',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getUsuarios
);

router.post(
  '/prestamos',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.postPrestamo
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

router.get(
  '/cuenta/:numero_cuenta',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getCuenta
);

router.put(
  '/editarUsuario/:userId',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.putPerfilUsuario
);

router.get(
  '/perfilUsuario/:userId',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getPerfilUsuario
);

router.get(
  '/principal/:userId',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getPrincipal
);

export default router;
