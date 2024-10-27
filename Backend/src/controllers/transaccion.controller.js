import bcrypt from 'bcrypt';
import { getConnection } from '../database/database.js';

const corsMiddleware = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
};

const loginUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { email, contrasena } = req.body;

    const result = await connection.query('SELECT * FROM usuarios WHERE email = ?', [email]);
    const user = result[0][0];

    if (!user) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' });
    }

    console.log('Contraseña ingresada:', contrasena);
    console.log('Contraseña en DB:', user.contrasena);

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
    res.status(500);
    res.send(error.message);
  }
};

const getUsuarios = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM usuarios');
    res.json(result[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getPrestamos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM prestamos');
    res.json(result[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

const getReportes = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query('SELECT * FROM reportes');
    res.json(result[0]);
  } catch (error) {
    res.status(500);
    res.send(error.message);
  }
};

export const metodosTransaccion = {
  postRegistrar,
  loginUsuario,
  getTransacciones,
  getUsuarios,
  getPrestamos,
  getReportes,
  corsMiddleware,
};
