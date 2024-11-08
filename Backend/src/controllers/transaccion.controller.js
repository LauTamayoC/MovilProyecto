import bcrypt from 'bcrypt';
import { getConnection, pool } from '../database/database.js';

// Middleware para CORS
const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
};

const getPrincipal = async (req, res) => {
  try {
    const connection = await getConnection();
    const { userId } = req.params;

    const result = await connection.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    const user = result[0][0];

    if (!user) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json({
      numero_cuenta: user.numero_cuenta,
      tipo_cuenta: user.tipo_cuenta,
      saldo: user.saldo,
    });
  } catch (error) {
    console.error('Error al obtener la información de la cuenta del usuario:', error);
    res.status(500).send(error.message);
  }
};

// Login de Usuario
const loginUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { email, contrasena } = req.body;

    const result = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = result[0][0];

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (!isMatch) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    res.json({ message: 'Inicio de sesión exitoso', userId: user.id });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send(error.message);
  }
};
//Registrar Usuario
const postRegistrar = async (req, res) => {
  try {
    const connection = await getConnection();
    const { name, email, password, accountNumber, accountType } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await connection.query(
      'INSERT INTO usuarios (nombre, email, contrasena, numero_cuenta, tipo_cuenta) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, accountNumber, accountType]
    );

    res.json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

// Obtener transacciones
const getTransacciones = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM transacciones');
    res.json(result[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// Historial de transacciones
const getTransaccionesHistory = async (req, res) => {
  try {
    const connection = await getConnection();
    const [result] = await connection.query(`
      SELECT id, fecha AS date, tipo AS type, 
      COALESCE(monto, 0) AS amount 
      FROM transacciones
    `);
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getUsuarios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM usuarios');
    res.json(result[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getPrestamos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM prestamos');
    res.json(result[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const postPrestamo = async (req, res) => {
  try {
    const connection = await getConnection();
    const { monto, plazo } = req.body;

    if (!monto || !plazo) {
      return res.status(400).json({ message: 'Monto y plazo son requeridos' });
    }

    const result = await connection.query('INSERT INTO prestamos (monto, plazo) VALUES (?, ?)', [monto, plazo]);

    res.json({ message: 'Préstamo solicitado exitosamente', prestamoId: result.insertId });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getReportes = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM reportes');
    res.json(result[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getCuenta = async (req, res) => {
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const result = await connection.query('SELECT * FROM usuarios WHERE numero_cuenta = ?', [numero_cuenta]);

    if (result[0].length === 0) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json(result[0][0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const putPerfilUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { userId } = req.params;
    const { nombre, email, tipo_cuenta } = req.body;

    const result = await connection.query('UPDATE usuarios SET nombre = ?, email = ?, tipo_cuenta = ? WHERE id = ?', [
      nombre,
      email,
      tipo_cuenta,
      userId,
    ]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error al editar el perfil del usuario:', error);
    res.status(500).json({ message: 'Error al editar el perfil del usuario', error: error.message });
  }
};

const getPerfilUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { userId } = req.params;

    const result = await connection.query('SELECT * FROM usuarios WHERE id = ?', [userId]);
    const user = result[0][0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({
      id: user.id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      numero_cuenta: user.numero_cuenta,
      tipo_cuenta: user.tipo_cuenta,
    });
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).send(error.message);
  }
};

const postTransaccion = async (req, res) => {
  let connection;
  try {
    if (!req.user || !req.user.numero_cuenta) {
      return res.status(401).json({ message: 'Usuario no autenticado' });
    }

    connection = await pool.getConnection();
    const { tipo, monto, numero_cuenta_destino } = req.body;
    const numero_cuenta_origen = req.user.numero_cuenta;

    if (
      !tipo ||
      !monto ||
      !numero_cuenta_origen ||
      (tipo.toLowerCase() === 'transferencia' && !numero_cuenta_destino)
    ) {
      return res.status(400).json({ message: 'Tipo, monto y número de cuenta son requeridos' });
    }

    if (isNaN(monto) || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser un número positivo' });
    }

    const [cuentaOrigen] = await connection.query('SELECT numero_cuenta, saldo FROM usuarios WHERE numero_cuenta = ?', [
      numero_cuenta_origen,
    ]);
    if (!cuentaOrigen.length) {
      return res.status(404).json({ message: 'Cuenta de origen no encontrada' });
    }

    const saldoOrigen = cuentaOrigen[0].saldo;

    const tiposValidos = ['transferencia', 'retiro', 'deposito'];
    if (!tiposValidos.includes(tipo.toLowerCase())) {
      return res.status(400).json({ message: 'Tipo de transacción no válido' });
    }

    if ((tipo.toLowerCase() === 'transferencia' || tipo.toLowerCase() === 'retiro') && saldoOrigen < monto) {
      return res.status(400).json({ message: 'Saldo insuficiente' });
    }

    await connection.beginTransaction();

    const result = await connection.query('INSERT INTO transacciones (numero_cuenta, tipo, monto) VALUES (?, ?, ?)', [
      numero_cuenta_origen,
      tipo,
      monto,
    ]);

    let updateQueryOrigen;
    if (tipo.toLowerCase() === 'transferencia' || tipo.toLowerCase() === 'retiro') {
      updateQueryOrigen = 'UPDATE usuarios SET saldo = saldo - ? WHERE numero_cuenta = ?';
    } else if (tipo.toLowerCase() === 'deposito') {
      updateQueryOrigen = 'UPDATE usuarios SET saldo = saldo + ? WHERE numero_cuenta = ?';
    }

    await connection.query(updateQueryOrigen, [monto, numero_cuenta_origen]);

    if (tipo.toLowerCase() === 'transferencia') {
      const [cuentaDestino] = await connection.query(
        'SELECT numero_cuenta, saldo FROM usuarios WHERE numero_cuenta = ?',
        [numero_cuenta_destino]
      );
      if (!cuentaDestino.length) {
        await connection.rollback();
        return res.status(404).json({ message: 'Cuenta de destino no encontrada' });
      }

      const updateQueryDestino = 'UPDATE usuarios SET saldo = saldo + ? WHERE numero_cuenta = ?';
      await connection.query(updateQueryDestino, [monto, numero_cuenta_destino]);
    }

    await connection.commit();

    res.json({ message: 'Transacción creada exitosamente', transaccionId: result.insertId });
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    if (connection) await connection.rollback();
    res.status(500).send(error.message);
  } finally {
    if (connection) connection.release();
  }
};

export const metodosTransaccion = {
  postRegistrar,
  loginUsuario,
  getTransacciones,
  getUsuarios,
  getPrestamos,
  getReportes,
  getCuenta,
  getTransaccionesHistory,
  postPrestamo,
  putPerfilUsuario,
  getPerfilUsuario,
  postTransaccion,
  corsMiddleware,
  getPrincipal,
};
