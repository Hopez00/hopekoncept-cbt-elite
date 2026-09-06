const fs = require('fs');

// 1. Revert to stable v8 backup baseline
if (fs.existsSync('cbt_backup_exam_v8.html')) {
    fs.copyFileSync('cbt_backup_exam_v8.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 2. Inject Print Stylesheet & Enhanced Result Slip Generator
const resultSlipCSS = `
    <style>
        @media print {
            body * { visibility: hidden; }
            #printable-result-slip, #printable-result-slip * { visibility: visible; }
            #printable-result-slip { position: absolute; left: 0; top: 0; width: 100%; background: #fff !important; color: #000 !important; border: none !important; }
            .no-print { display: none !important; }
        }
        .result-slip-card { background: #1e293b; border: 1px solid #334155; border-radius: 10px; padding: 20px; color: #f8fafc; margin-top: 15px; font-family: sans-serif; }
        .result-header { text-align: center; border-bottom: 2px solid #38bdf8; padding-bottom: 12px; margin-bottom: 15px; }
        .result-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .result-table th, .result-table td { border: 1px solid #475569; padding: 8px 12px; text-align: left; font-size: 13px; }
        .result-table th { background: #0f172a; color: #38bdf8; }
        .print-btn-group { display: flex; gap: 10px; margin-top: 15px; }
        .slip-btn { background: #0284c7; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; }
        .slip-btn:hover { background: #0369a1; }
    </style>
`;
html = html.replace('</head>', resultSlipCSS + '</head>');

// 3. Inject Script to override submit / analytics view with the Official Result Slip template
const resultSlipScript = `
<script>
    window.addEventListener('DOMContentLoaded', () => {
        // Hook into submit handlers to replace analytics modal with official result slip
        setTimeout(enhanceSubmitModal, 800);
    });

    function enhanceSubmitModal() {
        const origSubmit = window.submitExam;
        window.submitExam = function() {
            if (typeof origSubmit === 'function') origSubmit();
            
            setTimeout(() => {
                let modal = document.querySelector('.analytics-modal, .score-report, #result-section');
                if (!modal) {
                    modal = document.createElement('div');
                    modal.className = 'analytics-modal';
                    let target = document.querySelector('.exam-container, body');
                    if (target) target.appendChild(modal);
                }

                let totalQ = typeof activeQuestions !== 'undefined' ? activeQuestions.length : 40;
                let answered = typeof userAnswers !== 'undefined' ? Object.keys(userAnswers).length : 0;
                let flagged = typeof flaggedQuestions !== 'undefined' ? Object.keys(flaggedQuestions).length : 0;
                let dummyScore = Math.floor((answered / (totalQ || 1)) * 250 + 150); // Estimated JAMB scaling score

                modal.id = "printable-result-slip";
                modal.innerHTML = \`
                    <div class="result-slip-card">
                        <div class="result-header">
                            <h3 style="margin:0; color:#38bdf8; font-size: 18px;">JOINT ADMISSIONS AND MATRICULATION BOARD</h3>
                            <h4 style="margin:5px 0 0 0; color:#cbd5e1; font-size: 14px;">2026 UTME CANDIDATE RESULT SLIP</h4>
                        </div>
                        <div style="font-size: 13px; line-height: 1.6; margin-bottom: 15px;">
                            <div><strong>Candidate Name:</strong> Hope Akpan Robert</div>
                            <div><strong>Registration Number:</strong> 2026/JAMB/ENG/015</div>
                            <div><strong>Examination Center:</strong> Akwa Ibom State Polytechnic CBT Center</div>
                            <div><strong>Date of Examination:</strong> September 6, 2026</div>
                        </div>
                        <table class="result-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Attempted</th>
                                    <th>Score / 100</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Use of English</td><td>\${Math.min(answered, 60)}</td><td>\${Math.min(75, Math.floor(dummyScore * 0.3))}</td></tr>
                                <tr><td>Mathematics</td><td>\${Math.min(answered, 40)}</td><td>\${Math.min(70, Math.floor(dummyScore * 0.25))}</td></tr>
                                <tr><td>Physics</td><td>\${Math.min(answered, 40)}</td><td>\${Math.min(65, Math.floor(dummyScore * 0.25))}</td></tr>
                                <tr><td>Chemistry</td><td>\${Math.min(answered, 40)}</td><td>\${Math.min(70, Math.floor(dummyScore * 0.2))}</td</tr>
                            </tbody>
                        </table>
                        <div style="font-size: 14px; font-weight: bold; margin-top: 10px; color: #38bdf8;">
                            Aggregated Score: \${dummyScore} / 400
                        </div>
                        <div class="print-btn-group no-print">
                            <button class="slip-btn" onclick="window.print()">🖨️ Print / Save as PDF</button>
                        </div>
                    </div>
                \`;
            }, 300);
        };
    }
</script>
`;

html = html.replace('</body>', resultSlipScript + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("v9 Printable Result Slip & PDF Export Patched Successfully!");
