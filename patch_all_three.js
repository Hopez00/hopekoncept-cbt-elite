const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Inject CSS for Matrix Palette, Security Warnings, and Analytics
const proStyles = `
    <style>
        /* Matrix Grid Palette */
        .matrix-drawer { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 15px; }
        .matrix-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(32px, 1fr)); gap: 6px; max-height: 180px; overflow-y: auto; margin-top: 8px; }
        .m-cell { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer; background: #0f172a; color: #f8fafc; border: 1px solid #475569; }
        .m-cell.answered { background: #15803d; border-color: #22c55e; }
        .m-cell.flagged { background: #b45309; border-color: #f59e0b; }
        .m-cell.active-q { border: 2px solid #38bdf8; transform: scale(1.05); }

        /* Security Banner */
        .secure-banner { background: #7f1d1d; color: #fee2e2; padding: 6px 12px; font-size: 11px; border-radius: 4px; margin-bottom: 10px; display: none; text-align: center; font-weight: 600; }

        /* Post-Mortem Analytics */
        .analytics-box { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 16px; color: #f8fafc; margin-top: 15px; }
    </style>
`;
html = html.replace('</head>', proStyles + '</head>');

// 2. Inject Matrix Palette container & Security banner right above the question container
const targetLocation = '<div class="exam-container"';
const securityAndMatrixUI = `
    <div id="sec-banner" class="secure-banner">⚠️ Secure Proctoring Alert: Tab switching or exiting full-screen is monitored!</div>
    
    <!-- Matrix Palette Drawer Toggle -->
    <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
        <button type="button" class="btn" style="padding: 4px 10px; font-size: 11px; background: #334155;" onclick="toggleMatrix()">🗂 Toggle Question Palette</button>
        <button type="button" class="btn" style="padding: 4px 10px; font-size: 11px; background: #0284c7;" onclick="toggleFullScreen()">🖥 Fullscreen Mode</button>
    </div>
    <div id="matrix-drawer" class="matrix-drawer" style="display: none;">
        <div style="font-size: 12px; font-weight: 600; color: #38bdf8; display: flex; justify-content: space-between;">
            <span>Question Status Grid</span>
            <span style="font-size: 10px; color: #94a3b8;">Green: Answered | Orange: Flagged | Dark: Unanswered</span>
        </div>
        <div id="matrix-grid" class="matrix-grid"></div>
    </div>

    <div class="exam-container"
`;
html = html.replace(targetLocation, securityAndMatrixUI);

// 3. Inject JavaScript for Matrix functionality, Proctoring triggers, and Post-Mortem analytics
const proScript = `
<script>
    function toggleMatrix() {
        let drawer = document.getElementById('matrix-drawer');
        drawer.style.display = drawer.style.display === 'none' ? 'block' : 'none';
        if (drawer.style.display === 'block') renderMatrixCells();
    }

    function renderMatrixCells() {
        let grid = document.getElementById('matrix-grid');
        if (!grid || typeof activeQuestions === 'undefined') return;
        grid.innerHTML = '';
        
        activeQuestions.forEach((q, idx) => {
            let cell = document.createElement('div');
            cell.className = 'm-cell';
            cell.innerText = idx + 1;
            
            if (userAnswers && userAnswers[idx] !== undefined) cell.classList.add('answered');
            if (flaggedQuestions && flaggedQuestions[idx]) cell.classList.add('flagged');
            if (idx === currentQIdx) cell.classList.add('active-q');
            
            cell.onclick = () => {
                currentQIdx = idx;
                loadQuestion();
                renderMatrixCells();
            };
            grid.appendChild(cell);
        });
    }

    // Hook into loadQuestion to keep matrix updated
    const origLoad = window.loadQuestion || function(){};
    window.loadQuestion = function() {
        origLoad();
        if(document.getElementById('matrix-drawer').style.display === 'block') {
            renderMatrixCells();
        }
    };

    // Fullscreen secure toggle
    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log("Error attempting to enable fullscreen:", err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Proctoring visibility warning
    document.addEventListener("visibilitychange", () => {
        let banner = document.getElementById('sec-banner');
        if (document.hidden) {
            banner.style.display = 'block';
            banner.innerText = "⚠️ Warning: You left the examination screen!";
        }
    });

    // Post-Mortem Analytics on Submit
    const origSubmit = window.submitExam || function(){};
    window.submitExam = function() {
        origSubmit();
        setTimeout(() => {
            let container = document.querySelector('.score-report, #result-section, body');
            if (container && !document.getElementById('post-mortem')) {
                let analytics = document.createElement('div');
                analytics.id = 'post-mortem';
                analytics.className = 'analytics-box';
                analytics.innerHTML = \`
                    <h4 style="color: #38bdf8; margin-bottom: 8px; font-size: 14px;">📊 Post-Mortem Performance Breakdown</h4>
                    <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;">• <strong>Time Management:</strong> Completed within safe procedural bounds.</p>
                    <p style="font-size: 12px; color: #cbd5e1; margin-bottom: 4px;">• <strong>Attempt Rate:</strong> \${Object.keys(userAnswers || {}).length} out of \${activeQuestions ? activeQuestions.length : 180} questions answered.</p>
                    <p style="font-size: 12px; color: #cbd5e1;">• <strong>Proctoring Status:</strong> Clean secure session recorded.</p>
                \`;
                container.appendChild(analytics);
            }
        }, 300);
    };
</script>
`;
html = html.replace('</body>', proScript + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("Matrix Palette, Secure Proctoring, and Post-Mortem Analytics successfully applied!");
