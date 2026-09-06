const fs = require('fs');

// 1. Update server.js with duplicate checking & password reset routes
let serverCode = fs.readFileSync('server.js', 'utf8');

// Add a mock user database registry check if not present
if (!serverCode.includes("registeredUsers")) {
    serverCode = serverCode.replace(
        "const pendingVerifications = {};",
        "const pendingVerifications = {};\nconst registeredUsers = {}; // stores email -> pass/name\nconst resetRequests = {};"
    );
}

// Update the /api/register route to check for existing users
const newRegisterRoute = `
app.post('/api/register', (req, res) => {
    const { name, email, pass } = req.body;
    if (!email || !pass) return res.json({ success: false, message: 'All fields required' });

    // Check if already registered
    if (registeredUsers[email]) {
        return res.json({ success: false, message: 'Email is already registered. Please sign in or use Forgot Password.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerifications[otp] = { name, email, pass, timestamp: Date.now() };

    console.log("========================================");
    console.log(\`[REGISTRATION OTP] Code for \${email}: \${otp}\`);
    console.log("========================================");

    res.json({ success: true, otp: otp, message: 'OTP generated successfully' });
});
`;

// Update verify-otp to permanently save user to registeredUsers
const newVerifyRoute = `
app.post('/api/verify-otp', (req, res) => {
    const { otp } = req.body;
    const userData = pendingVerifications[otp];

    if (!userData) {
        return res.json({ success: false, message: 'Invalid or expired verification code' });
    }

    // Save user permanently
    registeredUsers[userData.email] = { name: userData.name, pass: userData.pass };
    delete pendingVerifications[otp];

    console.log(\`[SUCCESS] User \${userData.email} verified and registered!\`);
    res.json({ success: true, message: 'Account verified successfully' });
});
`;

// Add login check route
const newLoginRoute = `
app.post('/api/login', (req, res) => {
    const { email, pass } = req.body;
    const user = registeredUsers[email];

    if (!user || user.pass !== pass) {
        return res.json({ success: false, message: 'Invalid email or password' });
    }

    res.json({ success: true, message: 'Login successful' });
});
`;

// Add forgot password route
const newForgotRoute = `
app.post('/api/forgot-password', (req, res) => {
    const { email } = req.body;
    if (!registeredUsers[email]) {
        return res.json({ success: false, message: 'Email address not found in our records.' });
    }

    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    resetRequests[resetOtp] = email;

    console.log("========================================");
    console.log(\`[PASSWORD RESET] Code for \${email}: \${resetOtp}\`);
    console.log("========================================");

    res.json({ success: true, otp: resetOtp, message: 'Reset code generated' });
});

app.post('/api/reset-password', (req, res) => {
    const { otp, newPass } = req.body;
    const email = resetRequests[otp];

    if (!email || !registeredUsers[email]) {
        return res.json({ success: false, message: 'Invalid or expired reset code.' });
    }

    registeredUsers[email].pass = newPass;
    delete resetRequests[otp];

    res.json({ success: true, message: 'Password updated successfully' });
});
`;

// Append or replace in server.js
serverCode += "\n" + newLoginRoute + "\n" + newForgotRoute;
fs.writeFileSync('server.js', serverCode);
console.log("Backend security & password reset logic updated!");
