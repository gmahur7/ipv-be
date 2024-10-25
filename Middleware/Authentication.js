const jwt =require('jsonwebtoken');

exports.generateUserToken = (user)=>{
    return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

// Authorization middleware to protect routes
exports.isAuthenticated = (req, res, next) => {

    const token = req.cookies.auth_token;
  
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, token missing' });
    }
  
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded.userId;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

exports.isAdminAuthenticated = (req, res, next) => {
  const token = req.cookies.auth_admin_token;

  if (!token) {
      return res.status(401).json({ 
          success: false,
          message: 'Authentication required' 
      });
  }

  try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.admin = {
          adminId: decoded.adminId,
          phoneNumber: decoded.phoneNumber
      };
      
      next();
  } catch (error) {
      console.error('Token verification error:', error);
      return res.status(403).json({ 
          success: false,
          message: 'Invalid or expired token' 
      });
  }
};