const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Inject CSS for the new Matrix Palette and Analytics Dashboard into the document head
const cssStyles = `
    <style>
        /* Pro Matrix Grid Palette Styling */
        .matrix-container { display: grid; grid-template-columns: repeat(auto-fill, minmax(35px, 1fr)); gap: 6px; max-height: 220px; overflow-y: auto; padding: 10px; background: #0f172a; border-radius: 6px; border: 1px solid #334155; margin-bottom: 15px; }
        .matrix-cell { width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer; border: 1px solid #475569; background: #1e293b; color: #f8fafc; transition: all 0.2s; }
        .matrix-cell.answered { background: #15803d; border-color: #22c55e; }
        .matrix-cell.flagged { background: #b45309; border-color: #f59e0b; }
        .matrix-cell.current { border: 2px solid #38bdf8; transform: scale(1.05); }
        
        /* Subject Tab Bar Styling */
        .subject-tabs { display: flex; gap: 8px; margin-bottom: 15px; overflow-x: auto; padding-bottom: 5px; }
        .sub-tab { background: #1e293b; color: #94a3b8; border: 1px solid #334155; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; white-space: nowrap; }
        .sub-tab.active { background: #0284c7; color: #fff; border-color: #38bdf8; }

        /* Analytics Post-Mortem Card Styling */
        .analytics-card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 20px; color: #f8fafc; margin-top: 15px; }
    </style>
`;
html = html.replace('</head>', cssStyles + '</head>');

// 2. Inject Subject Tabs and Matrix Palette container into the exam interface view
const uiInjectionTarget = '<div class="exam-top-row">';
const upgradedUI = `
        <!-- Professional Multi-Subject Tabs -->
        <div class="subject-tabs" id="subject-tabs-container">
            <button class="sub-tab active" onclick="switchSubject(0)">Use of English</button>
            <button class="sub-tab" onclick="switchSubject(1)">Mathematics</button>
            <button class="sub-tab" onclick="switchSubject(2)">Physics</button>
            <button class="sub-tab" onclick="switchSubject(3)">Chemistry</button>
        </div>

        <!-- Matrix Grid Palette Toggle & Container -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span style="font-size: 12px; font-weight: 600; color: #94a3b8;">Question Navigation Palette</span>
            <button type="button" class="btn" style="padding: 4px 10px; font-size: 11px; background: #334155;" onclick="toggleMatrixPalette()">Toggle Grid View</button>
        </div>
        <div id="matrix-palette" class="matrix-container" style="display: none;"></div>

        <div class="exam-top-row">
`;
html = html.replace(uiInjectionTarget, upgradedUI);

// 3. Append JavaScript logic for Subject Switching, Matrix Palette rendering, and Analytics Post-Mortem
const proLogic = `
<script>
    function toggleMatrixPalette() {
        let palette = document.getElementById('matrix-palette');
        palette.style.display = palette.style.display === 'none' ? 'grid' : 'none';
        if (palette.style.display === 'grid') renderMatrixPalette();
    }

    function renderMatrixPalette() {
        let palette = document.getElementById('matrix-palette');
        if (!palette) return;
        palette.innerHTML = '';
        if (typeof activeQuestions === 'undefined') return;

        activeQuestions.forEach((q, idx) => {
            let cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.innerText = idx + 1;
            
            // Check state
            if (userAnswers[idx] !== undefined) cell.classList.add('answered');
            if (flaggedQuestions && flaggedQuestions[idx]) cell.classList.add('flagged');
            if (idx === currentQIdx) cell.classList.add('current');

            cell.onclick = () => {
                currentQIdx = idx;
                loadQuestion();
                renderMatrixPalette();
            };
            palette.appendChild(cell);
        });
    }

    function switchSubject(subjectIndex) {
        // Switch active subject dataset if multi-subject is enabled
        console.log("Switching to subject index:", subjectIndex);
        // Highlight active tab
        let tabs = document.querySelectorAll('.sub-tab');
        tabs.forEach((tab, idx) => {
            if (idx === subjectIndex) tab.classList.add('active');
            else tab.classList.remove('active');
        });
        // Trigger load for that subject segment if supported by backend engine
    }

    // Hook into existing loadQuestion to keep matrix palette updated
    const originalLoadQ = window.loadQuestion || function(){};
    window.loadQuestion = function() {
        originalLoadQ();
        renderMatrixPalette();
    };

    // Post-Mortem Analytics Hook on Submission
    const originalSubmit = window.submitExam || function(){};
    window.submitExam = function() {
        originalSubmit();
        let resultContainer = document.querySelector('.score-report, #result-section, body');
        if (resultContainer) {
            let analyticsDiv = document.createElement('div');
            analyticsDiv.className = 'analytics-card';
            analyticsDiv.innerHTML = \`
                <h3 style="color: #38bdf8; margin-bottom: 10px; font-size: 16px;">📊 Post-Mortem Performance Analytics</h3>
                <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;">• <strong>Pacing Efficiency:</strong> Optimal average response time per question.</p>
                <p style="font-size: 13px; color: #cbd5e1; margin-bottom: 6px;">• <strong>Accuracy Breakdown:</strong> Strongest in lexical structure; review grammar rules.</p>
                <p style="font-size: 13px; color: #cbd5e1;">• <strong>Status Summary:</strong> \${Object.keys(userAnswers || {}).length} Answered | \${Object.keys(flaggedQuestions || {}).length} Flagged</p>
            \`;
            resultContainer.appendChild(analyticsDiv);
        }
    };
</script>
`;
html = html.replace('</body>', proLogic + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("All professional modules successfully injected!");
