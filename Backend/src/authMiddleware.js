// middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const autenticarUsuario = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado' });
  }

  try {
    const verified = jwt.verify(token, 'your_jwt_secret_key'); // Reemplaza con tu clave secreta
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Token no válido' });
  }
};

export default autenticarUsuario;
