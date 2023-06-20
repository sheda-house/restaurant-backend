const jwt = require('jsonwebtoken');

const signJwt = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

const verifyToken = (req, res, next) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
      return res.status(400).json({ message: 'Invalid authorization header' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const vendor = jwt.verify(token, process.env.JWT_SECRET);
    req.user = vendor;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = {
  signJwt,
  verifyToken,
};
