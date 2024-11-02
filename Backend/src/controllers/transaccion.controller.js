import bcrypt from 'bcrypt';
import { getConnection } from '../database/database.js';
import cors from 'cors';
import { Router } from 'express';

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

// Login de usuario
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


const postRegistrar = async (req, res) => {
  try {
    const connection = await getConnection();
    const { name, email, hashedPassword, accountNumber, accountType } = req.body;

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
    
    
    const result = await connection.query(
      'INSERT INTO prestamos (monto, plazo) VALUES (?, ?)',
      [monto, plazo]
    );

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

const editarPerfilUsuario = async (req, res) => {
  try {
    const connection = await getConnection();
    const { userId } = req.params;
    const { name, email, accountType } = req.body;

    const result = await connection.query('UPDATE usuarios SET nombre = ?, email = ?, tipo_cuenta = ?, WHERE id = ?', [
      name,
      email,
      accountType,
      userId,
    ]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json({ message: 'Perfil actualizado exitosamente' });
  } catch (error) {
    console.error('Error al editar el perfil del usuario:', error);
    res.status(500).send(error.message);
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
  corsMiddleware,
  getTransaccionesHistory,
  postPrestamo, 
  editarPerfilUsuario,
  
};