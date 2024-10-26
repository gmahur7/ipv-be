const { generateUserToken } = require('../Middleware/Authentication');
const User = require('../Models/UserModel');

const genCode = (user) => {
    const username = user.split("").filter((value) => value !== " ").join("");
    const randomStr = "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const len = 8;

    let str = ""

    for (let i = 0; i < len; i++) {
        str += randomStr[Math.floor(Math.random() * randomStr.length)];
    }

    let output = username + "_" + str;

    return output
}

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, phoneNumber, email, password, pincode, district, state, zone, country } = req.body;

        let user = await User.findOne({ phoneNumber });
        if (user) {
            return res.status(400).json({ success:false,message: 'User already exists' });
        }

        const shareCode = genCode(name);

        user = new User({ 
            name, 
            phoneNumber,
            email,
            password,
            pincode,
            district,
            state,
            zone,
            country,
            shareInfo:{
                code:shareCode,
            }
        });
        await user.save();

        const token = generateUserToken(user)

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({ success:true,message: 'User registered successfully', user,token });
    } catch (error) {
        res.status(500).json({ success:false,message: 'Server error', error });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(400).json({ success:false,message: 'Invalid phone number or password' });
        }

        if (user.password !== password) {
            return res.status(400).json({ success:false,message: 'Invalid phone number or password' });
        }

        const token = generateUserToken(user)

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success:true,message: 'Login successful', user,token });
    } catch (error) {
        res.status(500).json({ success:false,message: 'Server error', error });
    }
};

// Logout a user
exports.logoutUser = (req, res) => {
    res.cookie('auth_token', '', { maxAge: 1 });
    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

//fetch all users 
exports.fetchAllUsers = async (req,res) => {
    try {
        const users = await User.find()
        console.log(users)
        if (!users) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        };

        return res.status(200).json({
            success: true,
            data: users
        });

    } catch (error) {
        console.log("error in fetching users" + error)
        return res.status(404).json({
            success: false,
            message: "Server error" + error
        });
    }
}

// get user profile
exports.userProfile = async (req,res) => {
    const currentUser = req.user;
    
    try {
        const user = await User.findById(currentUser)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        };

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        console.log("error in updating user clicks and points" + error)
        return res.status(404).json({
            success: false,
            message: "Server error" + error
        });
    }
}


exports.updateUserClick = async (req,res) => {
    const { share } = req.body;
    try {
        const user = await User.findOne({ "shareInfo.code": share });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            });
        };

        user.shareInfo.points += 10;
        user.shareInfo.clicks += 1;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "User Updated Successfully"
        });

    } catch (error) {
        console.log("error in updating user clicks and points" + error)
        return res.status(404).json({
            success: false,
            message: "Server error" + error
        });
    }
}



