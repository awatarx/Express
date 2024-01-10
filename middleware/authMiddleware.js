// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Secret Key
const SECRET_KEY = "Awatar"

// const authMiddleware = (req, res, next) => {
//   const token = req.header('Authorization');

//   if (!token) {
//     return res.status(401).json({ message: 'Unauthorized' });
//   }
//   try {
//     const decoded = jwt.verify(token, SECRET_KEY);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     console.error(error);
//     res.status(401).json({ message: 'Invalid token' });
//   }
// };


const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: Missing token' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user information to the request object
    next(); // Move on to the next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

module.exports = authMiddleware;
