const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Inject Styles for the Matrix Palette and Toolbar
const proStyles = `
    <style>
        .pro-toolbar { display: flex; gap: 6px; justify-content: flex-end; margin-bottom: 10px; padding: 0 5px; }
        .pro-btn { padding: 4px 10px; font-size: 11px; font-weight: 600; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
        .matrix-drawer { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 12px; margin-bottom: 12px; }
        .matrix-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(32px, 1fr)); gap: 6px; max-height: 160px; overflow-y: auto; margin-top: 8px; }
        .m-cell { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border-radius: 4px; cursor: pointer; background: #0f172a; color: #f8fafc; border: 1px solid #475569; }
        .m-cell.answered { background: #15803d; border-color: #22c55e; }
        .m-cell.flagged { background: #b45309; border-color: #f59e0b; }
        .m-cell.active-q { border: 2px solid #38bdf8; transform: scale(1.05); }
    </style>
`;
if (!html.includes('pro-toolbar')) {
    html = html.replace('</head>', proStyles + '</head>');
}

// 2. Inject Dynamic UI Injector Script before closing body
const dynamicScript = `
<script>
    window.addEventListener('DOMContentLoaded', () => {
        let container = document.querySelector('.exam-container') || document.body;
        if (!document.getElementById('pro-toolbar-wrap')) {
            let wrap = document.createElement('div');
            wrap.id = 'pro-toolbar-wrap';
            wrap.innerHTML = \`
                <div class="pro-toolbar">
                    <button type="button" class="pro-btn" style="background: #334155;" onclick="toggleMatrix()">🗂 Palette Grid</button>
                    <button type="button" class="pro-btn" style="background: #0284c7;" onclick="toggleFullScreen()">🖥 Fullscreen</button>
                </div>
                <div id="matrix-drawer" class="matrix-drawer" style="display: none;">
                    <div style="font-size: 11px; font-weight: 600; color: #38bdf8; display: flex; justify-content: space-between;">
                        <span>Question Status Grid</span>
                        <span style="font-size: 10px; color: #94a3b8;">Green: Answered | Orange: Flagged</span>
                    </div>
                    <div id="matrix-grid" class="matrix-grid"></div>
                </div>
            \`;
            container.parentNode.insertBefore(wrap, container);
        }
    });

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

    // Keep matrix updated on question load
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

if (!html.includes('pro-toolbar-wrap')) {
    html = html.replace('</body>', dynamicScript + '</body>');
}

fs.writeFileSync('public/exam.html', html);
console.log("Dynamic UI Injector applied successfully!");
