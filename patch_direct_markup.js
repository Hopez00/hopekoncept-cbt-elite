const fs = require('fs');

// 1. Reset to clean backup baseline
if (fs.existsSync('cbt_backup_exam_v4.html')) {
    fs.copyFileSync('cbt_backup_exam_v4.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 2. Insert CSS Styles in head
const proCSS = `
    <style>
        .pro-toolbar { display: flex; gap: 6px; justify-content: flex-end; margin-bottom: 12px; }
        .pro-btn { padding: 4px 10px; font-size: 11px; font-weight: 600; color: #fff; background: #334155; border: none; border-radius: 4px; cursor: pointer; }
        .pro-btn.primary { background: #0284c7; }
        .matrix-drawer { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
        .matrix-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(32px, 1fr)); gap: 6px; max-height: 160px; overflow-y: auto; margin-top: 8px; }
        .m-cell { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer; background: #0f172a; color: #f8fafc; border: 1px solid #475569; }
        .m-cell.answered { background: #15803d; border-color: #22c55e; }
        .m-cell.flagged { background: #b45309; border-color: #f59e0b; }
        .m-cell.active-q { border: 2px solid #38bdf8; transform: scale(1.05); }
    </style>
`;
html = html.replace('</head>', proCSS + '</head>');

// 3. Insert direct HTML markup right above the main exam card/container
const targetMarkup = '<div class="exam-container"';
const toolbarHTML = `
    <div style="max-width: 600px; margin: 10px auto; padding: 0 10px;">
        <div class="pro-toolbar">
            <button type="button" class="pro-btn" onclick="toggleMatrix()">🗂 Palette Grid</button>
            <button type="button" class="pro-btn primary" onclick="toggleFullScreen()">🖥 Fullscreen</button>
        </div>
        <div id="matrix-drawer" class="matrix-drawer" style="display: none;">
            <div style="font-size: 11px; font-weight: 600; color: #38bdf8; display: flex; justify-content: space-between;">
                <span>Question Status Grid</span>
                <span style="font-size: 10px; color: #94a3b8;">Green: Answered | Orange: Flagged</span>
            </div>
            <div id="matrix-grid" class="matrix-grid"></div>
        </div>
    </div>
    <div class="exam-container"
`;

if (html.includes(targetMarkup)) {
    html = html.replace(targetMarkup, toolbarHTML);
} else {
    // Fallback if class name differs
    html = html.replace('<body>', '<body>' + toolbarHTML);
}

// 4. Inject Matrix and Fullscreen logic script before closing body
const proScript = `
<script>
    function toggleMatrix() {
        let drawer = document.getElementById('matrix-drawer');
        if (!drawer) return;
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
            
            if (typeof userAnswers !== 'undefined' && userAnswers[idx] !== undefined) cell.classList.add('answered');
            if (typeof flaggedQuestions !== 'undefined' && flaggedQuestions[idx]) cell.classList.add('flagged');
            if (typeof currentQIdx !== 'undefined' && idx === currentQIdx) cell.classList.add('active-q');
            
            cell.onclick = () => {
                currentQIdx = idx;
                if (typeof loadQuestion === 'function') loadQuestion();
                renderMatrixCells();
            };
            grid.appendChild(cell);
        });
    }

    const origLoadQ = window.loadQuestion || function(){};
    window.loadQuestion = function() {
        origLoadQ();
        let drawer = document.getElementById('matrix-drawer');
        if (drawer && drawer.style.display === 'block') {
            renderMatrixCells();
        }
    };

    function toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    }
</script>
`;
html = html.replace('</body>', proScript + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("Direct markup patch applied successfully!");
