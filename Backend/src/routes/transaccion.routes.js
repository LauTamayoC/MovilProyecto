import cors from 'cors';
import { Router } from 'express';
import { metodosTransaccion } from '../controllers/transaccion.controller.js';

const router = Router();

const corsOptions = {
  origin: 'http://localhost:8081',
};

router.use(cors(corsOptions));


router.post('/login', metodosTransaccion.loginUsuario);
router.post('/registrar', metodosTransaccion.postRegistrar);


router.get(
  '/transaccion/:numero_cuenta',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.getCuentaOrigen
);

router.post(
  '/transaccion',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.postTransaccion
);


router.get('/transacciones', metodosTransaccion.getTransacciones);
router.get('/transaccioneshistory', metodosTransaccion.getTransaccionesHistory);
router.get('/transaccion/:numero_cuenta', metodosTransaccion.getCuentaOrigen);


router.get('/usuarios', metodosTransaccion.getUsuarios);
router.get('/cuenta/:numero_cuenta', metodosTransaccion.getCuenta);
router.put('/editarUsuario/:userId', metodosTransaccion.putPerfilUsuario);
router.get('/perfilUsuario/:userId', metodosTransaccion.getPerfilUsuario);
router.get('/principal/:userId', metodosTransaccion.getPrincipal);


router.post(
  '/prestamos',
  cors({
    origin: 'http://localhost:8081',
  }),
  metodosTransaccion.postPrestamo
);


router.get('/reportes/prestamos/:usuario_id', metodosTransaccion.getPrestamos);




router.get('/reportes/ingresos-egresos/:numero_cuenta', metodosTransaccion.getIngresosEgresos);
router.get('/reportes/transacciones/:numero_cuenta', metodosTransaccion.getResumenTransacciones);
router.get('/reportes/estadisticas-mensuales/:numero_cuenta', metodosTransaccion.getEstadisticasMensuales);
router.get('/reportes/balance/:numero_cuenta', metodosTransaccion.getBalance);
router.get('/reportes/prestamos/:usuario_id', metodosTransaccion.getPrestamos);




export default router;
