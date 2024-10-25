const jwt = require('jsonwebtoken');
const Admin = require('../Models/AdminModel');
const secretKey = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Controller for admin login
exports.adminLogin = async (req, res) => {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
        return res.status(400).json({ 
            success:false,
            message: 'Phone number and password are required'
        });
    }

    try {
        const admin = await Admin.findOne({ phoneNumber });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        if(password!==admin.password){
            return res.status(401).json({ message: 'Invalid phone number or password' });
        }

        const token = jwt.sign({ adminId: admin._id, phoneNumber: admin.phoneNumber }, secretKey, {
            expiresIn: '1d',
        });

        res.cookie('auth_admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 3600000 * 24,
        });

        return res.status(200).json({ 
            success:true,
            message: 'Login successful', 
            token 
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
