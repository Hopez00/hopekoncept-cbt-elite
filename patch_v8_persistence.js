const fs = require('fs');

// 1. Revert to stable v7 backup baseline
if (fs.existsSync('cbt_backup_exam_v7.html')) {
    fs.copyFileSync('cbt_backup_exam_v7.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 2. Inject LocalStorage Persistence Script
const persistenceScript = `
<script>
    // LocalStorage Auto-Save & Resume Engine
    const STORAGE_KEY = 'cbt_session_state_v8';

    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(restoreSessionState, 600);
        setInterval(saveSessionState, 1000);
    });

    function saveSessionState() {
        // Only save if exam has actually started
        let timerEl = document.querySelector('.timer, #timer, [id*="timer"]');
        if (!timerEl) return;

        let sessionData = {
            answers: typeof userAnswers !== 'undefined' ? userAnswers : {},
            flagged: typeof flaggedQuestions !== 'undefined' ? flaggedQuestions : {},
            qIdx: typeof currentQIdx !== 'undefined' ? currentQIdx : 0,
            subject: typeof currentSubject !== 'undefined' ? currentSubject : '',
            timerText: timerEl.innerText,
            timestamp: Date.now()
        };

        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionData));
        } catch (e) {
            console.error("Failed to save session state:", e);
        }
    }

    function restoreSessionState() {
        let saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return;

        try {
            let data = JSON.parse(saved);
            // Check if session is less than 3 hours old
            if (Date.now() - data.timestamp < 3 * 3600 * 1000) {
                if (data.answers && typeof userAnswers !== 'undefined') {
                    Object.assign(userAnswers, data.answers);
                }
                if (data.flagged && typeof flaggedQuestions !== 'undefined') {
                    Object.assign(flaggedQuestions, data.flagged);
                }
                if (typeof currentQIdx !== 'undefined' && data.qIdx !== undefined) {
                    currentQIdx = data.qIdx;
                }
                if (typeof currentSubject !== 'undefined' && data.subject) {
                    currentSubject = data.subject;
                }
                
                // Refresh views if functions exist
                if (typeof loadQuestion === 'function') loadQuestion();
                if (typeof renderMatrixCells === 'function') renderMatrixCells();
                
                console.log("Exam session successfully restored from LocalStorage!");
            }
        } catch (e) {
            console.error("Failed to restore session state:", e);
        }
    }

    // Clear session storage upon formal submission
    const origSubmitV8 = window.submitExam || function(){};
    window.submitExam = function() {
        localStorage.removeItem(STORAGE_KEY);
        origSubmitV8();
    };
</script>
`;

html = html.replace('</body>', persistenceScript + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("v8 LocalStorage Persistence Patched Successfully!");
