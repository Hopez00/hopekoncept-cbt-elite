const nodemailer = require('nodemailer');
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "your-email@gmail.com",
    pass: process.env.EMAIL_PASS || "your-app-password"
  }
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data store for local testing
const pendingVerifications = {};
const registeredUsers = {}; 
const resetRequests = {};

// Register Route with Duplicate Detection
app.post('/api/register', async (req, res) => {
    const { name, email, pass } = req.body;
    if (!email || !pass) {
        return res.json({ success: false, message: "All fields are required." });
    }

    if (registeredUsers[email]) {
        return res.json({ success: false, message: "Email is already registered. Please sign in or use Forgot Password." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerifications[otp] = { name, email, pass, timestamp: Date.now() };

    console.log("================================");
    console.log(`[REGISTRATION OTP] Code for ${email}: ${otp}`);
    console.log("================================");

    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER || "your-email@gmail.com",
            to: email,
            subject: "Hopekoncept CBT Elite - Verification Code",
            text: "Your verification code is: " + otp
        });
        res.json({ success: true, message: "Verification code sent to your email inbox!" });
    } catch (err) {
        console.error("Mail error:", err);
        res.status(500).json({ success: false, message: "Failed to send email." });
    }
});

// Verify OTP Route
app.post('/api/verify-otp', (req, res) => {
    const { otp } = req.body;
    const userData = pendingVerifications[otp];

    if (!userData) {
        return res.json({ success: false, message: 'Invalid or expired verification code.' });
    }

    registeredUsers[userData.email] = { name: userData.name, pass: userData.pass };
    delete pendingVerifications[otp];

    console.log(`[SUCCESS] User ${userData.email} verified and saved!`);
    res.json({ success: true, message: 'Account verified successfully' });
});

// Login Route
app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    const user = registeredUsers[email];

    if (!user || user.pass !== pass) {
        return res.json({ success: false, message: 'Invalid email or password.' });
    }

    res.json({ success: true, message: 'Login successful' });
});

// Forgot Password Request Route
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    
    if (!registeredUsers[email]) {
        return res.json({ success: false, message: 'Email address not found in our records.' });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    resetRequests[resetOtp] = email;

    console.log("========================================");
    console.log(`[PASSWORD RESET] Code for ${email}: ${resetOtp}`);
    console.log("========================================");

    res.json({ success: true, otp: resetOtp, message: 'Reset code generated' });
});

// Reset Password Confirm Route
app.post('/api/reset-password', (req, res) => {
    const { otp, newPass } = req.body;
    const email = resetRequests[otp];

    if (!email || !registeredUsers[email]) {
        return res.json({ success: false, message: 'Invalid or expired reset code.' });
    }

    registeredUsers[email].pass = newPass;
    delete resetRequests[otp];

    console.log(`[SUCCESS] Password updated for ${email}`);
    res.json({ success: true, message: 'Password updated successfully' });
});

app.listen(PORT, () => {
    console.log(`Server running smoothly on http://localhost:${PORT}`);
});
