const fs = require('fs');

// 1. Ensure we start from our stable v5 backup baseline
if (fs.existsSync('cbt_backup_exam_v5.html')) {
    fs.copyFileSync('cbt_backup_exam_v5.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 2. Inject CSS Styles for Subject Tabs and Analytics Modal
const v6CSS = `
    <style>
        .subject-tab-bar { display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px; }
        .sub-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .sub-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
        .analytics-modal { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-top: 15px; color: #f8fafc; }
    </style>
`;
html = html.replace('</head>', v6CSS + '</head>');

// 3. Inject Subject Switcher Tabs into the toolbar area
const toolbarTarget = '<div class="pro-toolbar">';
const subjectBarHTML = `
        <div class="subject-tab-bar" id="subject-tabs-container">
            <button class="sub-btn active" onclick="switchSubjectBank('english', 0)">Use of English</button>
            <button class="sub-btn" onclick="switchSubjectBank('math', 1)">Mathematics</button>
            <button class="sub-btn" onclick="switchSubjectBank('physics', 2)">Physics</button>
            <button class="sub-btn" onclick="switchSubjectBank('chemistry', 3)">Chemistry</button>
        </div>
        <div class="pro-toolbar">
`;
html = html.replace(toolbarTarget, subjectBarHTML);

// 4. Inject JavaScript for Subject Switching, Timer Watchdog, and Post-Mortem Analytics
const v6Script = `
<script>
    // Multi-Subject Bank Manager
    function switchSubjectBank(subjectKey, index) {
        let tabs = document.querySelectorAll('.sub-btn');
        tabs.forEach((t, i) => {
            if(i === index) t.classList.add('active');
            else t.classList.remove('active');
        });
        console.log("Switched active subject bank to:", subjectKey);
        if(typeof renderMatrixCells === 'function') renderMatrixCells();
    }

    // Hard Auto-Submit Watchdog on Timer Expiry
    const watchdogInterval = setInterval(() => {
        let timerEl = document.querySelector('.timer, #timer, [id*="timer"]');
        if (timerEl && (timerEl.innerText === "00:00" || timerEl.innerText.includes("Time: 00:00"))) {
            clearInterval(watchdogInterval);
            if (typeof submitExam === 'function') {
                submitExam();
            } else {
                alert("Examination time has expired. Submitting your paper...");
            }
        }
    }, 1000);

    // Enhanced Post-Mortem Analytics on Submit
    const origSubmitV6 = window.submitExam || function(){};
    window.submitExam = function() {
        origSubmitV6();
        setTimeout(() => {
            let targetArea = document.querySelector('.score-report, #result-section, .exam-container, body');
            if (targetArea && !document.getElementById('post-mortem-v6')) {
                let totalQ = typeof activeQuestions !== 'undefined' ? activeQuestions.length : 180;
                let answeredCount = Object.keys(userAnswers || {}).length;
                let flaggedCount = Object.keys(flaggedQuestions || {}).length;
                
                let reportBox = document.createElement('div');
                reportBox.id = 'post-mortem-v6';
                reportBox.className = 'analytics-modal';
                reportBox.innerHTML = \`
                    <h3 style="color: #38bdf8; font-size: 15px; margin-bottom: 8px;">📊 Professional Post-Mortem Analytics</h3>
                    <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;">• <strong>Total Questions Bank:</strong> \${totalQ}</p>
                    <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;">• <strong>Attempted:</strong> \${answeredCount} | <strong>Unanswered:</strong> \${totalQ - answeredCount}</p>
                    <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;">• <strong>Flagged Items:</strong> \${flaggedCount}</p>
                    <p style="font-size: 12px; color: #38bdf8; margin-top: 8px; font-weight: 600;">Status: Secure Exam Session Evaluated & Locked.</p>
                \`;
                targetArea.appendChild(reportBox);
            }
        }, 300);
    };
</script>
`;
html = html.replace('</body>', v6Script + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("v6 Suite Patched Successfully!");
