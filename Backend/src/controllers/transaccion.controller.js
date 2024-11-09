import bcrypt from 'bcrypt';
import { getConnection } from '../database/database.js';

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

<<<<<<< HEAD
=======
//Registrar Usuario
>>>>>>> b777f469339796ae746a09af7aa412a5a70cb8da
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
<<<<<<< HEAD
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const result = await connection.query('SELECT numero_cuenta FROM usuarios WHERE numero_cuenta = ?', [
      numero_cuenta,
    ]);
    const cuenta = result[0];

    if (!cuenta) {
      return res.status(404).json({ message: 'Cuenta no encontrada' });
    }

    res.json(cuenta);
=======
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    const result = await connection.query('SELECT numero_cuenta FROM usuarios WHERE numero_cuenta = ?', [
      numero_cuenta,
    ]);
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
    connection = await pool.getConnection();
    const { tipo, monto, numero_cuenta_origen, numero_cuenta_destino } = req.body;

    // Validar los campos requeridos
    if (!tipo || !monto || !numero_cuenta_origen || (tipo.toLowerCase() !== 'retiro' && !numero_cuenta_destino)) {
      return res.status(400).json({ message: 'Tipo, monto y números de cuenta son requeridos' });
    }

    // Validar que el monto sea un número positivo
    if (isNaN(monto) || monto <= 0) {
      return res.status(400).json({ message: 'El monto debe ser un número positivo' });
    }

    // Obtener la cuenta de origen
    const [cuentaOrigen] = await connection.query('SELECT numero_cuenta, saldo FROM usuarios WHERE numero_cuenta = ?', [
      numero_cuenta_origen,
    ]);

    if (cuentaOrigen.length) {
      const saldoOrigen = cuentaOrigen[0].saldo;

      // Validar el tipo de transacción
      const tiposValidos = ['transferencia', 'retiro', 'deposito'];
      if (!tiposValidos.includes(tipo.toLowerCase())) {
        return res.status(400).json({ message: 'Tipo de transacción no válido' });
      }

      // Validar saldo suficiente para transferencias y retiros
      if ((tipo.toLowerCase() === 'transferencia' || tipo.toLowerCase() === 'retiro') && saldoOrigen < monto) {
        return res.status(400).json({ message: 'Saldo insuficiente' });
      }

      await connection.beginTransaction();

      // Insertar la transacción
      const result = await connection.query('INSERT INTO transacciones (numero_cuenta, tipo, monto) VALUES (?, ?, ?)', [
        numero_cuenta_origen,
        tipo,
        monto,
      ]);

      // Actualizar el saldo de la cuenta de origen
      let updateQueryOrigen;
      if (tipo.toLowerCase() === 'transferencia' || tipo.toLowerCase() === 'retiro') {
        updateQueryOrigen = 'UPDATE usuarios SET saldo = saldo - ? WHERE numero_cuenta = ?';
      } else if (tipo.toLowerCase() === 'deposito') {
        updateQueryOrigen = 'UPDATE usuarios SET saldo = saldo - ? WHERE numero_cuenta = ?'; // Cambiado a resta
      }

      await connection.query(updateQueryOrigen, [monto, numero_cuenta_origen]);

      // Si es una transferencia o depósito, actualizar el saldo de la cuenta de destino
      if (tipo.toLowerCase() === 'transferencia' || tipo.toLowerCase() === 'deposito') {
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
    } else {
      return res.status(404).json({ message: 'Cuenta de origen no encontrada' });
    }
>>>>>>> b777f469339796ae746a09af7aa412a5a70cb8da
  } catch (error) {
    console.error('Error al obtener la cuenta:', error);
    res.status(500).send(error.message);
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
    res.json(result[0]);
  } catch (error) {
    res.status(500).send(error.message);
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
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
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
    res.json(result);
  } catch (error) {
    res.status(500).send(error.message);
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
    res.status(500).send(error.message);
  }
};
const getResumenPrestamos = async (req, res) => {
  try {
    const connection = await getConnection();
    const { numero_cuenta } = req.params;

    // Suponiendo que tienes una tabla `prestamos` con una columna `numero_cuenta`
    const [result] = await connection.query(
      'SELECT * FROM prestamos WHERE numero_cuenta = ?',
      [numero_cuenta]
    );

    if (!result.length) {
      return res.status(404).json({ message: 'No se encontraron préstamos para esta cuenta' });
    }

    res.json(result); // Devuelve el resumen de préstamos en formato JSON
  } catch (error) {
    console.error('Error al obtener el resumen de préstamos:', error);
    res.status(500).send(error.message);
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
<<<<<<< HEAD
=======
  postTransaccion,
>>>>>>> b777f469339796ae746a09af7aa412a5a70cb8da
  getCuentaOrigen,
  corsMiddleware,
  getBalance,
  getResumenPrestamos
  
};
