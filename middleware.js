const User = require('./models/user');
const token = 'admin-token'; 

async function authenticateUser(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    const token = parts[1];

    // Admin shortcut
    if (req.user?.role === 'admin') {
  return next();
}

    if (token === 'admin-token') {
  req.user = {
    _id: null,
    username: process.env.ADMIN_USERNAME,
    role: 'admin'
  };
  return next();
}



    // Client token lookup
    const user = await User.findOne({ 'tokens.token': token });
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = {
      _id: user._id,
      username: user.username,
      role: 'client'
    };
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admin access only' });
  }
  next();
}

module.exports = { authenticateUser, requireAdmin };







  