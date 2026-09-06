const fs = require('fs');

// Revert to stable v5 backup baseline
if (fs.existsSync('cbt_backup_exam_v5.html')) {
    fs.copyFileSync('cbt_backup_exam_v5.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Add Dynamic Subject Tabs CSS & Container Styling
const cssPatch = `
    <style>
        .subject-tab-bar { display: flex; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px; }
        .sub-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .sub-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
        .analytics-modal { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-top: 15px; color: #f8fafc; }
    </style>
`;
html = html.replace('</head>', cssPatch + '</head>');

// 2. Insert a dynamic container for subject tabs above the toolbar
const targetToolbar = '<div class="pro-toolbar">';
const dynamicBarHTML = `
        <div class="subject-tab-bar" id="dynamic-subject-tabs">
            <!-- Dynamically populated based on candidate's selected combination -->
        </div>
        <div class="pro-toolbar">
`;
html = html.replace(targetToolbar, dynamicBarHTML);

// 3. Inject script to hook into the engine and build dynamic tabs upon exam start
const scriptPatch = `
<script>
    // Override or hook into exam initialization to build dynamic subject tabs
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            buildDynamicSubjectTabs();
        }, 500);
    });

    function buildDynamicSubjectTabs() {
        let container = document.getElementById('dynamic-subject-tabs');
        if (!container) return;
        
        // Check if the app has a selected subjects array or fall back to standard JAMB combo
        let subjects = window.selectedSubjects || window.userSubjects || ['Use of English', 'Mathematics', 'Physics', 'Chemistry'];
        
        // If it's an object or list, normalize to array
        if (!Array.isArray(subjects)) {
            subjects = ['Use of English', 'Mathematics', 'Physics', 'Chemistry'];
        }

        container.innerHTML = '';
        subjects.forEach((sub, idx) => {
            let btn = document.createElement('button');
            btn.className = 'sub-btn' + (idx === 0 ? ' active' : '');
            btn.innerText = sub;
            btn.onclick = () => {
                document.querySelectorAll('#dynamic-subject-tabs .sub-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Trigger native subject switch if engine supports it, or update state
                if (typeof switchSubject === 'function') {
                    switchSubject(sub);
                } else if (typeof currentSubject !== 'undefined') {
                    currentSubject = sub;
                    if (typeof loadQuestion === 'function') loadQuestion();
                    if (typeof renderMatrixCells === 'function') renderMatrixCells();
                }
                
                let headerLabel = document.querySelector('.exam-header, [id*="subject"], .subject-title');
                if(headerLabel) {
                    headerLabel.innerText = "SUBJECT: " + sub.toUpperCase();
                }
            };
            container.appendChild(btn);
        });
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
html = html.replace('</body>', scriptPatch + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("Dynamic subject tabs successfully integrated!");
