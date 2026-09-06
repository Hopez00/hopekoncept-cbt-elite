const fs = require('fs');

// 1. Update server.js to return OTP in the API response for instant testing
let serverCode = fs.readFileSync('server.js', 'utf8');

// Replace the register route to send the otp back in json
const oldRoutePattern = /app\.post\('\/api\/register'[\s\S]*?\}\);\s*app\.post\('\/api\/verify-otp'/;

const newRoutes = `
app.post('/api/register', (req, res) => {
    const { name, email, pass } = req.body;
    if (!email) return res.json({ success: false, message: 'Email required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerifications[otp] = { name, email, pass, timestamp: Date.now() };

    console.log("========================================");
    console.log(\`[INSTANT OTP] Code for \${email}: \${otp}\`);
    console.log("========================================");

    // Send OTP back in response so it displays instantly for testing
    res.json({ success: true, otp: otp, message: 'OTP generated successfully' });
});

app.post('/api/verify-otp'`;

if (serverCode.includes("pendingVerifications")) {
    // Simple replacement of the register block
    serverCode = serverCode.replace(/app\.post\('\/api\/register'[\s\S]*?res\.json\(\{ success: true[^}]+\}\);\s*\}\);/, `
app.post('/api/register', (req, res) => {
    const { name, email, pass } = req.body;
    if (!email) return res.json({ success: false, message: 'Email required' });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerifications[otp] = { name, email, pass, timestamp: Date.now() };
    console.log("========================================");
    console.log(\`[INSTANT OTP] Code for \${email}: \${otp}\`);
    console.log("========================================");
    res.json({ success: true, otp: otp, message: 'OTP dispatched successfully' });
});`);
    fs.writeFileSync('server.js', serverCode);
}

// 2. Update signup.html to display the OTP in the alert box instantly
let signupHTML = fs.readFileSync('public/signup.html', 'utf8');
signupHTML = signupHTML.replace(
    `alert('OTP generated successfully! Check your Termux console for the verification code.');`,
    `alert('Your Verification Code is: ' + data.otp + ' (In production, this is sent to your email)');`
);
fs.writeFileSync('public/signup.html', signupHTML);

console.log("Instant OTP display patched successfully!");
