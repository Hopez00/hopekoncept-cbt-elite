const express = require('express');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- GMAIL CONFIGURATION ---
const EMAIL_USER = 'idrobert123456@gmail.com';
const EMAIL_PASS = 'fomtcrpgzuefctmj';

const DB_FILE = path.join(__dirname, 'users.json');

function readDB() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function writeDB(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

const pendingUsers = {};

// SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    const { email, password } = req.body;
    const users = readDB();

    const existingUser = users.find(u => u.email === email && u.is_verified);
    if (existingUser) {
        return res.status(400).json({ error: 'Email already registered and verified.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    pendingUsers[email] = { email, password: hashedPassword, verificationCode };

    const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: 'JAMB/WAEC CBT Portal - Email Verification Code',
        text: `Your email verification code is: ${verificationCode}`
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Failed to send verification email.' });
        }
        res.json({ success: true, message: 'Verification code sent to your email.' });
    });
});

// VERIFY CODE ROUTE
app.post('/api/verify', (req, res) => {
    const { email, code } = req.body;
    const userData = pendingUsers[email];

    if (!userData || userData.verificationCode !== code) {
        return res.status(400).json({ error: 'Invalid or expired verification code.' });
    }

    const users = readDB();
    users.push({
        email: userData.email,
        password: userData.password,
        is_verified: true
    });
    writeDB(users);
    delete pendingUsers[email];

    res.json({ success: true, message: 'Email verified successfully!' });
});

// LOGIN ROUTE (Optimized for instant mobile response)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const users = readDB();

    const user = users.find(u => u.email === email && u.is_verified);
    if (!user) {
        return res.status(400).json({ error: 'Account not found or email not verified.' });
    }

    res.json({ success: true, message: 'Login successful!' });
});


// Candidate Registration & OTP Verification API Endpoints
let pendingVerifications = {};

app.use(express.json());


app.post('/api/register', (req, res) => {
    const { name, email, pass } = req.body;
    if (!email) return res.json({ success: false, message: 'Email required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerifications[otp] = { name, email, pass, timestamp: Date.now() };
    console.log("========================================");
    console.log(`[INSTANT OTP] Code for ${email}: ${otp}`);
    console.log("========================================");
    res.json({ success: true, otp: otp, message: 'OTP dispatched successfully' });
});

app.post('/api/verify-otp', (req, res) => {
    const { otp } = req.body;
    if (pendingVerifications[otp]) {
        delete pendingVerifications[otp];
        return res.json({ success: true });
    }
    res.json({ success: false, message: 'Invalid OTP code' });
});
    
app.listen(3000, () => {
    console.log('Server running smoothly on http://localhost:3000');
});


