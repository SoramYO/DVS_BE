const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(400).json({ message: 'Invalid Token' });
  }
}
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Admin") {
      next();
    } else {
      return res.status(403).json({ message: 'You are not authorized' });
    }
  });
};
const verifyStaff = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role === "Valuation Staff" || req.user.role === "Consulting Staff") {
      next();
    } else {
      return res.status(403).json({ message: 'You are not authorized' });
    }
  });
};
module.exports = {
  verifyToken: verifyToken,
  verifyAdmin: verifyAdmin,
  verifyStaff: verifyStaff
};