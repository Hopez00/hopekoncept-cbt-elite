const fs = require('fs');

// Revert to clean v5 backup baseline to avoid stacking scripts
if (fs.existsSync('cbt_backup_exam_v5.html')) {
    fs.copyFileSync('cbt_backup_exam_v5.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Add Subject Tabs CSS
const subCSS = `
    <style>
        .subject-tab-bar { display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px; }
        .sub-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .sub-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
        .analytics-modal { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-top: 15px; color: #f8fafc; }
    </style>
`;
html = html.replace('</head>', subCSS + '</head>');

// 2. Insert Subject Switcher UI above the toolbar
const targetToolbar = '<div class="pro-toolbar">';
const subBarHTML = `
        <div class="subject-tab-bar" id="subject-tabs-container">
            <button class="sub-btn active" onclick="changeSubject('English', 0)">Use of English</button>
            <button class="sub-btn" onclick="changeSubject('Mathematics', 1)">Mathematics</button>
            <button class="sub-btn" onclick="changeSubject('Physics', 2)">Physics</button>
            <button class="sub-btn" onclick="changeSubject('Chemistry', 3)">Chemistry</button>
        </div>
        <div class="pro-toolbar">
`;
html = html.replace(targetToolbar, subBarHTML);

// 3. Inject Functional Subject Switcher Logic & Watchdog & Analytics
const subLogic = `
<script>
    function changeSubject(subName, index) {
        // Highlight active tab
        let tabs = document.querySelectorAll('.sub-btn');
        tabs.forEach((t, i) => {
            if(i === index) t.classList.add('active');
            else t.classList.remove('active');
        });

        // Update active subject state if global variables exist
        if (typeof currentSubject !== 'undefined') {
            currentSubject = subName;
        }
        
        // Reset or adjust question index for the new bank if available
        if (typeof currentQIdx !== 'undefined') {
            currentQIdx = 0;
        }

        // Trigger reload of question and matrix grid
        if (typeof loadQuestion === 'function') {
            loadQuestion();
        }
        if (typeof renderMatrixCells === 'function') {
            renderMatrixCells();
        }
        
        // Update header label directly if present
        let headerLabel = document.querySelector('.exam-header, [id*="subject"], .subject-title');
        if(headerLabel) {
            headerLabel.innerText = "SUBJECT: " + subName.toUpperCase();
        }
    }

    // Hard Auto-Submit Watchdog
    const watchdogInterval = setInterval(() => {
        let timerEl = document.querySelector('.timer, #timer, [id*="timer"]');
        if (timerEl && (timerEl.innerText === "00:00" || timerEl.innerText.includes("Time: 00:00"))) {
            clearInterval(watchdogInterval);
            if (typeof submitExam === 'function') submitExam();
        }
    }, 1000);
</script>
`;
html = html.replace('</body>', subLogic + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("Subject switching logic successfully integrated!");
