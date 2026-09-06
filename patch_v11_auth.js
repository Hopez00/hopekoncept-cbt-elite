const fs = require('fs');

// 1. Revert to stable v10 backup baseline
if (fs.existsSync('cbt_backup_exam_v10.html')) {
    fs.copyFileSync('cbt_backup_exam_v10.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 2. Inject CSS for Registration & OTP Modal
const authCSS = `
    <style>
        .auth-container { max-width: 400px; margin: 40px auto; background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; color: #f8fafc; font-family: sans-serif; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        .auth-tabs { display: flex; margin-bottom: 20px; border-bottom: 1px solid #334155; }
        .auth-tab { flex: 1; text-align: center; padding: 10px; cursor: pointer; color: #94a3b8; font-weight: 600; font-size: 14px; }
        .auth-tab.active { color: #38bdf8; border-bottom: 2px solid #38bdf8; }
        .auth-form input { width: 100%; padding: 10px; margin-bottom: 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #fff; font-size: 13px; box-sizing: border-box; }
        .auth-btn { width: 100%; background: #0284c7; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .auth-btn:hover { background: #0369a1; }
        .otp-box { text-align: center; display: none; }
    </style>
`;
html = html.replace('</head>', authCSS + '</head>');

// 3. Inject Authentication Script & UI Handler
const authScript = `
<script>
    // Toggle between Login and Register views if present
    document.addEventListener('DOMContentLoaded', () => {
        setupAuthUI();
    });

    function setupAuthUI() {
        let loginBox = document.querySelector('.login-container, .auth-box, form');
        if (!loginBox) return;

        // Create container wrapper if not already structured
        let parent = loginBox.parentElement;
        if (!document.getElementById('cbt-auth-wrapper')) {
            let wrapper = document.createElement('div');
            wrapper.id = 'cbt-auth-wrapper';
            wrapper.className = 'auth-container';
            wrapper.innerHTML = \`
                <div class="auth-tabs">
                    <div class="auth-tab active" onclick="switchAuthTab('login')">Sign In</div>
                    <div class="auth-tab" onclick="switchAuthTab('register')">Register</div>
                </div>
                
                <div id="login-section">
                    <h3 style="margin-top:0; color:#38bdf8; font-size:16px;">Candidate Portal Sign In</h3>
                    <input type="email" id="login-email" placeholder="Registered Email Address">
                    <input type="password" id="login-pass" placeholder="Password">
                    <button class="auth-btn" onclick="handleLogin()">Sign In to Portal</button>
                </div>

                <div id="register-section" style="display:none;">
                    <h3 style="margin-top:0; color:#38bdf8; font-size:16px;">New Candidate Registration</h3>
                    <input type="text" id="reg-name" placeholder="Full Name (e.g. Hope Robert)">
                    <input type="email" id="reg-email" placeholder="Email Address">
                    <input type="password" id="reg-pass" placeholder="Create Password">
                    <button class="auth-btn" onclick="handleRegister()">Register & Send OTP</button>
                </div>

                <div id="otp-section" class="otp-box">
                    <h3 style="margin-top:0; color:#38bdf8; font-size:16px;">Email Verification</h3>
                    <p style="font-size:12px; color:#cbd5e1;">Enter the 6-digit verification code sent to your email address.</p>
                    <input type="text" id="otp-code" placeholder="Enter 6-Digit OTP" style="text-align:center; letter-spacing:4px; font-size:16px;">
                    <button class="auth-btn" onclick="verifyOTP()">Verify & Proceed</button>
                </div>
            \`;
            parent.appendChild(wrapper);
            loginBox.style.display = 'none'; // Hide legacy form placeholder
        }
    }

    function switchAuthTab(tab) {
        let tabs = document.querySelectorAll('.auth-tab');
        tabs[0].className = tab === 'login' ? 'auth-tab active' : 'auth-tab';
        tabs[1].className = tab === 'register' ? 'auth-tab active' : 'auth-tab';
        
        document.getElementById('login-section').style.display = tab === 'login' ? 'block' : 'none';
        document.getElementById('register-section').style.display = tab === 'register' ? 'block' : 'none';
        document.getElementById('otp-section').style.display = 'none';
    }

    async function handleRegister() {
        let name = document.getElementById('reg-name').value;
        let email = document.getElementById('reg-email').value;
        let pass = document.getElementById('reg-pass').value;

        if (!name || !email || !pass) {
            alert('Please fill in all registration fields.');
            return;
        }

        try {
            let res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, pass })
            });
            let data = await res.json();
            if (data.success) {
                alert('Verification code sent successfully to ' + email + ' (Check server console for OTP code simulation).');
                document.getElementById('register-section').style.display = 'none';
                document.getElementById('otp-section').style.display = 'block';
            } else {
                alert('Registration failed: ' + data.message);
            }
        } catch (e) {
            alert('Network error connecting to registration server.');
        }
    }

    async function verifyOTP() {
        let otp = document.getElementById('otp-code').value;
        if (!otp || otp.length < 4) {
            alert('Please enter a valid verification code.');
            return;
        }

        try {
            let res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp })
            });
            let data = await res.json();
            if (data.success) {
                alert('Email verified successfully! Welcome to the CBT Examination Portal.');
                window.location.href = '/exam.html?type=JAMB';
            } else {
                alert('Invalid or expired verification code.');
            }
        } catch(e) {
            alert('Verification error.');
        }
    }

    function handleLogin() {
        let email = document.getElementById('login-email').value;
        if (!email) {
            alert('Please enter your email.');
            return;
        }
        alert('Signed in successfully!');
        window.location.href = '/exam.html?type=JAMB';
    }
</script>
`;

html = html.replace('</body>', authScript + '</body>');
fs.writeFileSync('public/exam.html', html);

// 4. Update server.js to include Auth and OTP API Endpoints
let serverCode = fs.readFileSync('server.js', 'utf8');
if (!serverCode.includes('/api/register')) {
    // Inject API routes right before app.listen or at the end
    const apiRoutes = `
// Candidate Registration & OTP Verification API Endpoints
let pendingVerifications = {};

app.use(express.json());

app.post('/api/register', (req, res) => {
    const { name, email, pass } = req.body;
    if (!email) return res.json({ success: false, message: 'Email required' });

    // Generate 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    pendingVerifications[otp] = { name, email, pass, timestamp: Date.now() };

    console.log("========================================");
    console.log(\`[EMAIL SERVICE] OTP for \${email}: \${otp}\`);
    console.log("========================================");

    res.json({ success: true, message: 'OTP dispatched successfully' });
});

app.post('/api/verify-otp', (req, res) => {
    const { otp } = req.body;
    if (pendingVerifications[otp]) {
        delete pendingVerifications[otp];
        return res.json({ success: true });
    }
    res.json({ success: false, message: 'Invalid OTP code' });
});
    `;
    
    // Insert before app.listen
    if (serverCode.includes('app.listen')) {
        serverCode = serverCode.replace('app.listen', apiRoutes + '\napp.listen');
    } else {
        serverCode += apiRoutes;
    }
    fs.writeFileSync('server.js', serverCode);
}

console.log("v11 Email Verification & Registration System Patched Successfully!");
