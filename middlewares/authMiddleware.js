import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'queuex_super_secret_key_2026';

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token || token === 'none') return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.user = decoded; // { id, role }
    next();
  });
};

export {  authMiddleware, JWT_SECRET  };
