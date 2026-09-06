const fs = require('fs');

// Create a professional result slip HTML
const resultHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hopekoncept CBT Elite - Examination Result Slip</title>
    <style>
        body {
            margin: 0; padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh;
        }
        .slip-card {
            background: rgba(30, 41, 59, 0.85); backdrop-filter: blur(12px);
            border: 1px solid rgba(56, 189, 248, 0.4); border-radius: 16px;
            padding: 30px; width: 100%; max-width: 600px; box-shadow: 0 20px 40px rgba(0,0,0,0.6);
        }
        .header { text-align: center; border-bottom: 2px solid rgba(56, 189, 248, 0.3); padding-bottom: 15px; margin-bottom: 20px; }
        .logo-badge { font-size: 22px; font-weight: bold; color: #38bdf8; }
        .title { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; margin-top: 5px; }
        .score-box { background: rgba(2, 132, 199, 0.15); border: 1px solid #0284c7; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px; }
        .score-val { font-size: 42px; font-weight: bold; color: #38bdf8; }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; font-size: 14px; }
        .detail-item { background: rgba(15, 23, 42, 0.6); padding: 10px 15px; border-radius: 8px; border: 1px solid rgba(100, 116, 139, 0.3); }
        .btn {
            width: 100%; background: linear-gradient(135deg, #0284c7, #0369a1); color: #fff; border: none;
            padding: 12px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; text-align: center;
        }
        .btn:hover { background: linear-gradient(135deg, #0369a1, #075985); }
    </style>
</head>
<body>
    <div class="slip-card">
        <div class="header">
            <div class="logo-badge">HOPEKONCEPT CBT ELITE</div>
            <div class="title">Official JAMB & WAEC Examination Slip</div>
        </div>

        <div class="score-box">
            <div style="font-size: 12px; color: #94a3b8; text-transform: uppercase;">Total Composite Score</div>
            <div class="score-val" id="total-score">284 / 400</div>
            <div style="font-size: 12px; color: #34d399; margin-top: 5px;">Status: PASSED (Institution Eligible)</div>
        </div>

        <div class="details-grid">
            <div class="detail-item"><strong>Candidate:</strong> Hope Akpan Robert</div>
            <div class="detail-item"><strong>Registration No:</strong> HK/CBT/2026/001</div>
            <div class="detail-item"><strong>Exam Type:</strong> JAMB / UTME</div>
            <div class="detail-item"><strong>Date:</strong> September 6, 2026</div>
        </div>

        <button class="btn" onclick="window.print()">Print / Save PDF Slip</button>
        <div style="text-align: center; margin-top: 15px;">
            <a href="/login.html" style="color: #38bdf8; font-size: 12px; text-decoration: none;">Log Out of Portal</a>
        </div>
    </div>
</body>
</html>
`;

fs.writeFileSync('public/result.html', resultHTML);
console.log("result.html created successfully!");
