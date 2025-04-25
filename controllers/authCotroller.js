const db = require("../config/db");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Helper function to generate JWT token
const generateToken = (userId,name,email,role="customer") => {
    return jwt.sign({ id: userId, username:name, email, role }, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

// Signup Controller
const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user already exists
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (user.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        // Generate token
        const token = generateToken(result.insertId,name,email);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure in production
            maxAge: 3600000, // 1 hour
            sameSite: 'strict'
        });

        res.status(201).redirect("/auth/signin")

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Signin Controller
const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const token = generateToken(user.id,user.name,user.email,user.role);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
            sameSite: 'strict'
        });
        
        if(user.role == "admin"){
            return res.status(200).redirect("/admin/dashboard");
        }else{
            res.status(200).redirect("/");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Signout Controller
const signout = (req, res) => {
    res.clearCookie('token');
    res.status(200).redirect("/auth/signin");
};

module.exports = { signup, signin, signout };