const fs = require('fs');

// Create a polished login.html with Forgot Password and duplicate sensitivity
const loginHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elite Candidate Portal - Sign In</title>
    <style>
        body {
            margin: 0; padding: 0; height: 100vh;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            display: flex; justify-content: center; align-items: center;
            overflow: hidden; position: relative; background: #0f172a;
        }
        .bg-slide {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background-size: cover; background-position: center; opacity: 0; z-index: -2;
            animation: kenburns 24s infinite;
        }
        .bg-slide:nth-child(1) { background-image: url('https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80'); animation-delay: 0s; }
        .bg-slide:nth-child(2) { background-image: url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80'); animation-delay: 8s; }
        .bg-slide:nth-child(3) { background-image: url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80'); animation-delay: 16s; }
        @keyframes kenburns {
            0% { opacity: 0; transform: scale(1); }
            8% { opacity: 1; }
            33% { opacity: 1; transform: scale(1.08); }
            41% { opacity: 0; transform: scale(1.1); }
            100% { opacity: 0; }
        }
        .overlay {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.85));
            z-index: -1;
        }
        .auth-card {
            background: rgba(30, 41, 59, 0.75);
            backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 16px;
            padding: 28px; width: 100%; max-width: 380px; box-sizing: border-box;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5); color: #f8fafc; text-align: center;
        }
        .logo-badge {
            display: inline-flex; align-items: center; justify-content: center;
            width: 55px; height: 55px; background: linear-gradient(135deg, #0284c7, #38bdf8);
            border-radius: 50%; box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
            font-size: 24px; font-weight: bold; color: #fff; margin-bottom: 8px;
        }
        .brand-title { font-size: 16px; font-weight: 700; letter-spacing: 1px; color: #38bdf8; text-transform: uppercase; }
        .brand-subtitle { font-size: 10px; color: #94a3b8; letter-spacing: 0.5px; margin-bottom: 20px; }
        input {
            width: 100%; padding: 12px; margin-bottom: 14px;
            background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(100, 116, 139, 0.6);
            border-radius: 8px; color: #fff; font-size: 13px; box-sizing: border-box;
        }
        input:focus { outline: none; border-color: #38bdf8; box-shadow: 0 0 8px rgba(56, 189, 248, 0.4); }
        .btn {
            width: 100%; background: linear-gradient(135deg, #0284c7, #0369a1);
            color: #fff; border: none; padding: 12px; border-radius: 8px;
            font-weight: 600; cursor: pointer; font-size: 14px;
            box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4); margin-top: 5px;
        }
        .btn:hover { background: linear-gradient(135deg, #0369a1, #075985); }
        .footer-link { margin-top: 15px; font-size: 12px; color: #94a3b8; }
        .footer-link a { color: #38bdf8; text-decoration: none; font-weight: 600; cursor: pointer; }
    </style>
</head>
<body>
    <div class="bg-slide"></div>
    <div class="bg-slide"></div>
    <div class="bg-slide"></div>
    <div class="overlay"></div>

    <div class="auth-card">
        <div class="logo-badge">HK</div>
        <div class="brand-title">Hopekoncept CBT Elite</div>
        <div class="brand-subtitle" id="form-subtitle">Candidate Portal Authentication</div>

        <!-- Login Form -->
        <div id="section-login">
            <input type="email" id="l-email" placeholder="Registered Email Address">
            <input type="password" id="l-pass" placeholder="Password">
            <button class="btn" onclick="submitLogin()">Sign In to Portal</button>
            <div style="margin-top: 10px; text-align: right;">
                <a onclick="showForgot()" style="font-size: 11px; color: #38bdf8; cursor: pointer;">Forgot Password?</a>
            </div>
            <div class="footer-link">
                Don't have an account? <a href="/signup.html">Register</a>
            </div>
        </div>

        <!-- Forgot Password Step 1: Request Code -->
        <div id="section-forgot-1" style="display:none;">
            <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 15px;">Enter your registered email to receive a password reset code.</p>
            <input type="email" id="f-email" placeholder="Your Registered Email">
            <button class="btn" onclick="requestResetCode()">Send Reset Code</button>
            <div class="footer-link">
                Remember your password? <a onclick="showLogin()">Sign In</a>
            </div>
        </div>

        <!-- Forgot Password Step 2: Enter OTP & New Password -->
        <div id="section-forgot-2" style="display:none;">
            <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 15px;">Enter the reset code and choose a new password.</p>
            <input type="text" id="f-otp" placeholder="6-Digit Reset Code" style="text-align:center; letter-spacing: 4px;">
            <input type="password" id="f-newpass" placeholder="New Password">
            <button class="btn" onclick="confirmResetPassword()">Update Password</button>
        </div>
    </div>

    <script>
        function showForgot() {
            document.getElementById('section-login').style.display = 'none';
            document.getElementById('section-forgot-1').style.display = 'block';
            document.getElementById('form-subtitle').innerText = 'Account Password Recovery';
        }

        function showLogin() {
            document.getElementById('section-forgot-1').style.display = 'none';
            document.getElementById('section-forgot-2').style.display = 'none';
            document.getElementById('section-login').style.display = 'block';
            document.getElementById('form-subtitle').innerText = 'Candidate Portal Authentication';
        }

        async function submitLogin() {
            let email = document.getElementById('l-email').value;
            let pass = document.getElementById('l-pass').value;
            if (!email || !pass) { alert('Please fill in all fields'); return; }

            try {
                let res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, pass })
                });
                let data = await res.json();
                if (data.success) {
                    alert('Login successful! Redirecting to exam center...');
                    window.location.href = '/exam.html';
                } else {
                    alert(data.message || 'Invalid email or password.');
                }
            } catch (e) { alert('Connection error.'); }
        }

        async function requestResetCode() {
            let email = document.getElementById('f-email').value;
            if (!email) { alert('Please enter your registered email.'); return; }

            try {
                let res = await fetch('/api/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                let data = await res.json();
                if (data.success) {
                    alert('Password Reset Code Generated: ' + data.otp);
                    document.getElementById('section-forgot-1').style.display = 'none';
                    document.getElementById('section-forgot-2').style.display = 'block';
                } else {
                    alert(data.message || 'Email not found.');
                }
            } catch (e) { alert('Connection error.'); }
        }

        async function confirmResetPassword() {
            let otp = document.getElementById('f-otp').value;
            let newPass = document.getElementById('f-newpass').value;
            if (!otp || !newPass) { alert('Please enter the code and your new password.'); return; }

            try {
                let res = await fetch('/api/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ otp, newPass })
                });
                let data = await res.json();
                if (data.success) {
                    alert('Password updated successfully! Please sign in.');
                    showLogin();
                } else {
                    alert(data.message || 'Invalid or expired code.');
                }
            } catch (e) { alert('Connection error.'); }
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('public/login.html', loginHTML);
console.log("login.html updated with Forgot Password flow!");
