const fs = require('fs');

// Revert to stable v5 backup baseline
if (fs.existsSync('cbt_backup_exam_v5.html')) {
    fs.copyFileSync('cbt_backup_exam_v5.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. CSS for dynamic tabs (hidden by default on selection screen)
const cssCode = `
    <style>
        #dynamic-subject-bar { display: none; gap: 6px; margin-bottom: 10px; overflow-x: auto; padding-bottom: 4px; }
        .sub-btn { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .sub-btn.active { background: #0284c7; color: #fff; border-color: #38bdf8; }
        .analytics-modal { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; margin-top: 15px; color: #f8fafc; }
    </style>
`;
html = html.replace('</head>', cssCode + '</head>');

// 2. Insert dynamic subject bar container above toolbar
const targetToolbar = '<div class="pro-toolbar">';
const containerHTML = `
        <div id="dynamic-subject-bar" class="subject-tab-bar"></div>
        <div class="pro-toolbar">
`;
html = html.replace(targetToolbar, containerHTML);

// 3. Inject script to detect when exam starts and build exact subject tabs from checkboxes
const scriptCode = `
<script>
    document.addEventListener('click', function(e) {
        // Look for clicks on "Start CBT Examination" button or similar triggers
        if (e.target && (e.target.innerText.includes('Start') || e.target.id.includes('start') || e.target.classList.contains('start-btn'))) {
            setTimeout(activateDynamicTabs, 300);
        }
    });

    // Also check periodically if the exam view has become active
    const checkExamStarted = setInterval(() => {
        let questionBox = document.querySelector('.question-container, #question-section, [id*="question"], .exam-card');
        let bar = document.getElementById('dynamic-subject-bar');
        if (bar && bar.style.display !== 'flex') {
            // Check if we are past the selection screen
            let checkboxes = document.querySelectorAll('input[type="checkbox"]:checked, .subject-checkbox:checked');
            if (checkboxes.length > 0 || window.activeSubjects || document.querySelector('.timer')) {
                activateDynamicTabs();
            }
        }
    }, 1000);

    function activateDynamicTabs() {
        let bar = document.getElementById('dynamic-subject-bar');
        if (!bar) return;
        
        bar.style.display = 'flex';
        
        // Gather selected subjects from checkboxes or engine state
        let subs = ['Use of English'];
        let checkedBoxes = document.querySelectorAll('input[type="checkbox"]:checked');
        checkedBoxes.forEach(cb => {
            let label = cb.parentElement.innerText.trim();
            if (label && !subs.includes(label) && label !== 'Use of English (Compulsory across all careers)') {
                subs.push(label);
            }
        });

        // Fallback if none captured via DOM
        if (subs.length <= 1 && window.selectedSubjects) {
            subs = window.selectedSubjects;
        } else if (subs.length <= 1) {
            subs = ['Use of English', 'Mathematics', 'Physics', 'Chemistry'];
        }

        bar.innerHTML = '';
        subs.forEach((sub, idx) => {
            let btn = document.createElement('button');
            btn.className = 'sub-btn' + (idx === 0 ? ' active' : '');
            btn.innerText = sub;
            btn.onclick = () => {
                document.querySelectorAll('#dynamic-subject-bar .sub-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                if (typeof currentSubject !== 'undefined') currentSubject = sub;
                if (typeof loadQuestion === 'function') loadQuestion();
                if (typeof renderMatrixCells === 'function') renderMatrixCells();
                
                let headerLabel = document.querySelector('.exam-header, [id*="subject"], .subject-title');
                if(headerLabel) headerLabel.innerText = "SUBJECT: " + sub.toUpperCase();
            };
            bar.appendChild(btn);
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
html = html.replace('</body>', scriptCode + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("Perfect dynamic subjects patch applied!");
