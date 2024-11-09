import bcrypt from 'bcrypt';
import { getConnection } from '../database/database.js';
import { pool } from '../database/database.js';


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


const loginUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { email } = req.body;

    const result = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = result[0][0];

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Inicio de sesión exitoso', userId: user.id, accountNumber: user.numero_cuenta });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send(error.message);
  }
};


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


const getTransacciones = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM transacciones');
    res.json(result[0]);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getTransaccionesHistory = async (req, res) => {
  try {
    const connection = await getConnection();
    const [result] = await connection.query(`
      SELECT id, fecha AS date, tipo AS type, COALESCE(monto, 0) AS amount 
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
    const { usuario_id } = req.params; 

    
    if (!usuario_id) {
      return res.status(400).json({ message: 'El ID del usuario es requerido' });
    }

    
    const [result] = await connection.query(
      'SELECT * FROM prestamos WHERE usuario_id = ?',
      [usuario_id]
    );

    
    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron préstamos para este usuario' });
    }

    
    res.json(result);
  } catch (error) {
    console.error('Error al obtener los préstamos:', error);
    res.status(500).json({ message: 'Error al obtener los préstamos', error: error.message });
  }
};


const postPrestamo = async (req, res) => {
  try {
    const connection = await getConnection();
    const { usuario_id, monto, plazo } = req.body; // Cambiamos numero_cuenta por usuario_id

    if (!usuario_id || !monto || !plazo) {
      return res.status(400).json({ message: 'Usuario ID, monto y plazo son requeridos' });
    }

    const result = await connection.query(
      'INSERT INTO prestamos (usuario_id, monto, plazo, estado, fecha_solicitud) VALUES (?, ?, ?, "pendiente", NOW())',
      [usuario_id, monto, plazo]
    );

    res.json({ message: 'Préstamo solicitado exitosamente', prestamoId: result.insertId });
  } catch (error) {
    console.error('Error al crear el préstamo:', error);
    res.status(500).send(error.message);
  }
};





const getCuenta = async (req, res) => {
  try {
    const { numero_cuenta } = req.params;
    console.log('Número de cuenta:', numero_cuenta); // Agrega esto para depuración

    const connection = await getConnection();
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

export const getCuentaOrigen = async (req, res) => {
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const result = await connection.query(
      'SELECT numero_cuenta FROM usuarios WHERE numero_cuenta = ?', 
      [numero_cuenta]
    );
    
    const cuenta = result[0];

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json(cuenta);
  } catch (error) {
    console.error('Error al obtener la cuenta:', error);
    res.status(500).send(error.message);
  }
};

const postTransaccion = async (req, res) => {
  let connection;
  try {
    const { tipo, monto, numero_cuenta } = req.body;

    // Validación de datos
    if (!tipo || !monto || !numero_cuenta) {
      return res.status(400).json({ message: 'Tipo, monto y número de cuenta son requeridos' });
    }

    
    connection = await pool.getConnection();

    
    const result = await connection.query(
      'INSERT INTO transacciones (numero_cuenta, tipo, monto, fecha) VALUES (?, ?, ?, NOW())',
      [numero_cuenta, tipo, monto]
    );

    
    res.status(201).json({ message: 'Transacción creada exitosamente', transaccionId: result[0].insertId });
  } catch (error) {
    console.error('Error al crear la transacción:', error);
    res.status(500).json({ message: 'Error al crear la transacción', error: error.message });
  } finally {
    if (connection) connection.release();
  }
};


const getIngresosEgresos = async (req, res) => {
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const [result] = await connection.query(`
      SELECT 
        SUM(CASE WHEN tipo = 'deposito' THEN monto ELSE 0 END) AS ingresos,
        SUM(CASE WHEN tipo IN ('retiro', 'transferencia') THEN monto ELSE 0 END) AS egresos
      FROM transacciones
      WHERE numero_cuenta = ? AND fecha >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
    `, [numero_cuenta]);

    res.json(result[0] || {});
  } catch (error) {
    console.error('Error al obtener ingresos y egresos:', error);
    res.status(500).json({ message: 'Error al obtener ingresos y egresos', error: error.message });
  }
};

const getResumenTransacciones = async (req, res) => {
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const [result] = await connection.query(`
      SELECT tipo, COUNT(*) AS cantidad, SUM(monto) AS total
      FROM transacciones
      WHERE numero_cuenta = ? AND fecha >= DATE_SUB(NOW(), INTERVAL 1 MONTH)
      GROUP BY tipo
    `, [numero_cuenta]);

    res.json(result || []);
  } catch (error) {
    console.error('Error al obtener el resumen de transacciones:', error);
    res.status(500).json({ message: 'Error al obtener el resumen de transacciones', error: error.message });
  }
};

const getEstadisticasMensuales = async (req, res) => {
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const [result] = await connection.query(`
      SELECT 
        DATE_FORMAT(fecha, '%Y-%m') AS mes,
        SUM(CASE WHEN tipo = 'deposito' THEN monto ELSE 0 END) AS ingresos,
        SUM(CASE WHEN tipo IN ('retiro', 'transferencia') THEN monto ELSE 0 END) AS egresos
      FROM transacciones
      WHERE numero_cuenta = ? AND fecha >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
      GROUP BY mes
      ORDER BY mes
    `, [numero_cuenta]);

    res.json(result || []);
  } catch (error) {
    console.error('Error al obtener estadísticas mensuales:', error);
    res.status(500).json({ message: 'Error al obtener estadísticas mensuales', error: error.message });
  }
};

const getBalance = async (req, res) => {
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const [result] = await connection.query(
      'SELECT saldo FROM usuarios WHERE numero_cuenta = ?',
      [numero_cuenta]
    );

    if (!result.length) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json({ saldo: result[0].saldo });
  } catch (error) {
    console.error('Error al obtener el balance:', error);
    res.status(500).json({ message: 'Error al obtener el balance', error: error.message });
  }
};

const getResumenPrestamos = async (req, res) => {
  try {
    const connection = await getConnection();
    const { usuario_id } = req.params;

    const [result] = await connection.query(
      'SELECT * FROM prestamos WHERE usuario_id = ?',
      [usuario_id]
    );

    if (!result.length) {
      return res.status(404).json({ message: 'No se encontraron préstamos para este usuario' });
    }

    res.json(result);
  } catch (error) {
    console.error('Error al obtener el resumen de préstamos:', error);
    res.status(500).json({ message: 'Error al obtener el resumen de préstamos', error: error.message });
  }
};








export const metodosTransaccion = {
  loginUsuario,
  postRegistrar,
  getTransacciones,
  getTransaccionesHistory,
  getIngresosEgresos,
  getResumenTransacciones,
  getEstadisticasMensuales,
  getPrincipal,
  getUsuarios,
  getPrestamos,
  getCuenta,
  postPrestamo,
  putPerfilUsuario,
  getPerfilUsuario,

  postTransaccion,

  getCuentaOrigen,
  corsMiddleware,
  getBalance,
  getResumenPrestamos
  
};
