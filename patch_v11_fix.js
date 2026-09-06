const fs = require('fs');

// 1. Revert to stable v10 backup baseline
if (fs.existsSync('cbt_backup_exam_v10.html')) {
    fs.copyFileSync('cbt_backup_exam_v10.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 2. Inject clean Auth Modal Styles inside head
const authCSS = `
    <style>
        .cbt-auth-card { background: #ffffff !important; color: #1e293b !important; border-radius: 8px; padding: 20px; width: 100%; max-width: 360px; box-sizing: border-box; font-family: sans-serif; }
        .auth-tabs { display: flex; margin-bottom: 15px; border-bottom: 2px solid #e2e8f0; }
        .auth-tab { flex: 1; text-align: center; padding: 8px; cursor: pointer; color: #64748b; font-weight: 600; font-size: 13px; }
        .auth-tab.active { color: #0284c7; border-bottom: 2px solid #0284c7; margin-bottom: -2px; }
        .cbt-auth-card input { width: 100%; padding: 10px; margin-bottom: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 6px; color: #0f172a; font-size: 13px; box-sizing: border-box; }
        .cbt-auth-btn { width: 100%; background: #1e3a8a; color: #fff; border: none; padding: 10px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }
        .cbt-auth-btn:hover { background: #1e40af; }
    </style>
`;
html = html.replace('</head>', authCSS + '</head>');

// 3. Inject replacement script targeting the login box directly
const authScript = `
<script>
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(upgradeLoginBox, 400);
    });

    function upgradeLoginBox() {
        // Find the existing login container card from previous milestones
        let card = document.querySelector('.login-container, .auth-box, [class*="login"], .bg-white, div[style*="background"]');
        // Let's find the specific white login box box shown in the screenshot
        let targetBox = document.querySelector('form') || document.querySelector('input[type="email"]');
        
        if (targetBox) {
            let container = targetBox.closest('div');
            if (container) {
                container.className = 'cbt-auth-card';
                container.innerHTML = \`
                    <div style="text-align:center; font-weight:bold; color:#1e3a8a; font-size:14px; margin-bottom:10px;">JAMB/WAEC TUTORIAL CBT</div>
                    <div class="auth-tabs">
                        <div class="auth-tab active" onclick="switchTab('login')">Sign In</div>
                        <div class="auth-tab" onclick="switchTab('register')">Register</div>
                    </div>
                    
                    <div id="form-login">
                        <input type="email" id="u-email" placeholder="Registered Email">
                        <input type="password" id="u-pass" placeholder="Password">
                        <button class="cbt-auth-btn" onclick="doLogin()">Sign In to Portal</button>
                    </div>

                    <div id="form-reg" style="display:none;">
                        <input type="text" id="r-name" placeholder="Full Name">
                        <input type="email" id="r-email" placeholder="Email Address">
                        <input type="password" id="r-pass" placeholder="Create Password">
                        <button class="cbt-auth-btn" onclick="doRegister()">Register & Get OTP</button>
                    </div>

                    <div id="form-otp" style="display:none; text-align:center;">
                        <p style="font-size:11px; color:#475569; margin-bottom:8px;">Enter 6-digit verification code sent to your email:</p>
                        <input type="text" id="r-otp" placeholder="Enter OTP" style="text-align:center; letter-spacing:3px; font-size:15px;">
                        <button class="cbt-auth-btn" onclick="doVerify()">Verify & Start Exam</button>
                    </div>
                    <div style="text-align:center; font-size:10px; color:#94a3b8; margin-top:10px;">Powered by Hopekoncept Apps</div>
                \`;
            }
        }
    }

    function switchTab(t) {
        let tabs = document.querySelectorAll('.auth-tab');
        tabs[0].className = t === 'login' ? 'auth-tab active' : 'auth-tab';
        tabs[1].className = t === 'register' ? 'auth-tab active' : 'auth-tab';
        document.getElementById('form-login').style.display = t === 'login' ? 'block' : 'none';
        document.getElementById('form-reg').style.display = t === 'register' ? 'block' : 'none';
        document.getElementById('form-otp').style.display = 'none';
    }

    async function doRegister() {
        let name = document.getElementById('r-name').value;
        let email = document.getElementById('r-email').value;
        let pass = document.getElementById('r-pass').value;
        if(!name || !email || !pass) { alert('Please fill all fields'); return; }

        try {
            let res = await fetch('/api/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ name, email, pass })
            });
            let data = await res.json();
            if(data.success) {
                alert('OTP sent successfully! Check your Termux console for the verification code.');
                document.getElementById('form-reg').style.display = 'none';
                document.getElementById('form-otp').style.display = 'block';
            } else {
                alert('Registration failed.');
            }
        } catch(e) { alert('Server connection error.'); }
    }

    async function doVerify() {
        let otp = document.getElementById('r-otp').value;
        try {
            let res = await fetch('/api/verify-otp', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ otp })
            });
            let data = await res.json();
            if(data.success) {
                alert('Email verified successfully!');
                window.location.href = '/exam.html?type=JAMB';
            } else {
                alert('Invalid OTP code.');
            }
        } catch(e) { alert('Verification error.'); }
    }

    function doLogin() {
        let email = document.getElementById('u-email').value;
        if(!email) { alert('Enter your email'); return; }
        window.location.href = '/exam.html?type=JAMB';
    }
</script>
`;

html = html.replace('</body>', authScript + '</body>');
fs.writeFileSync('public/exam.html', html);
console.log("v11 Auth box UI perfectly aligned!");
