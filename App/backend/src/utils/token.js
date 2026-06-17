import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET no está definido en las variables de entorno');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Token inválido o expirado');
  }
}

export function decodeToken(token) {
  return jwt.decode(token);
}

export { JWT_SECRET, JWT_EXPIRES_IN };
