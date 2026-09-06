const fs = require('fs');

// Ensure signup.html exists or create a polished version
const signupHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Candidate Registration - CBT Portal</title>
    <style>
        body { background: #0f172a; color: #f8fafc; font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .signup-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 24px; width: 100%; max-width: 360px; box-sizing: border-box; box-shadow: 0 10px 25px rgba(0,0,0,0.3); }
        h2 { color: #38bdf8; font-size: 18px; text-align: center; margin-top: 0; }
        input { width: 100%; padding: 10px; margin-bottom: 12px; background: #0f172a; border: 1px solid #475569; border-radius: 6px; color: #fff; font-size: 13px; box-sizing: border-box; }
        .btn { width: 100%; background: #0284c7; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 14px; }
        .btn:hover { background: #0369a1; }
        .footer-link { text-align: center; margin-top: 15px; font-size: 12px; color: #94a3b8; }
        .footer-link a { color: #38bdf8; text-decoration: none; }
    </style>
</head>
<body>
    <div class="signup-card">
        <h2>Candidate Registration</h2>
        <div id="reg-step-1">
            <input type="text" id="s-name" placeholder="Full Name (e.g. Hope Robert)">
            <input type="email" id="s-email" placeholder="Email Address">
            <input type="password" id="s-pass" placeholder="Create Password">
            <button class="btn" onclick="submitRegistration()">Register & Send OTP</button>
        </div>

        <div id="reg-step-2" style="display:none; text-align:center;">
            <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 15px;">Enter the 6-digit verification code sent to your email.</p>
            <input type="text" id="s-otp" placeholder="Enter 6-Digit OTP" style="text-align:center; letter-spacing: 4px; font-size: 16px;">
            <button class="btn" onclick="verifyOTPCode()">Verify Email</button>
        </div>

        <div class="footer-link">
            Already have an account? <a href="/login.html">Sign In</a>
        </div>
    </div>

    <script>
        async function submitRegistration() {
            let name = document.getElementById('s-name').value;
            let email = document.getElementById('s-email').value;
            let pass = document.getElementById('s-pass').value;

            if (!name || !email || !pass) {
                alert('Please fill in all fields.');
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
                    alert('OTP generated successfully! Check your Termux console for the verification code.');
                    document.getElementById('reg-step-1').style.display = 'none';
                    document.getElementById('reg-step-2').style.display = 'block';
                } else {
                    alert('Registration failed.');
                }
            } catch (e) {
                alert('Connection error.');
            }
        }

        async function verifyOTPCode() {
            let otp = document.getElementById('s-otp').value;
            if (!otp) {
                alert('Please enter the OTP code.');
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
                    alert('Email verified successfully! Redirecting to login...');
                    window.location.href = '/login.html';
                } else {
                    alert('Invalid verification code.');
                }
            } catch (e) {
                alert('Verification error.');
            }
        }
    </script>
</body>
</html>
`;

fs.writeFileSync('public/signup.html', signupHTML);
console.log("signup.html updated successfully!");
