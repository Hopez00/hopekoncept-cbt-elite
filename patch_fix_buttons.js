const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Inject Styles for the Matrix Palette and Analytics
const styles = `
    <style>
        .matrix-drawer { background: #1e293b; border: 1px solid #334155; border-radius: 6px; padding: 10px; margin-top: 10px; }
        .matrix-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(30px, 1fr)); gap: 5px; max-height: 150px; overflow-y: auto; margin-top: 6px; }
        .m-cell { width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; border-radius: 3px; cursor: pointer; background: #0f172a; color: #f8fafc; border: 1px solid #475569; }
        .m-cell.answered { background: #15803d; border-color: #22c55e; }
        .m-cell.flagged { background: #b45309; border-color: #f59e0b; }
        .m-cell.active-q { border: 2px solid #38bdf8; }
        .analytics-box { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 14px; color: #f8fafc; margin-top: 15px; }
    </style>
`;
html = html.replace('</head>', styles + '</head>');

// 2. Insert the Palette Toggle directly inside the exam header or card top
const targetHeader = '</div>\n    <div class="exam-container">';
const newHeaderAddon = `
        <div style="margin-top: 8px; display: flex; gap: 6px; justify-content: flex-end;">
            <button type="button" class="btn" style="padding: 3px 8px; font-size: 10px; background: #334155; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="toggleMatrix()">🗂 Palette Grid</button>
            <button type="button" class="btn" style="padding: 3px 8px; font-size: 10px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="toggleFullScreen()">🖥 Fullscreen</button>
        </div>
        <div id="matrix-drawer" class="matrix-drawer" style="display: none;">
            <div style="font-size: 11px; font-weight: 600; color: #38bdf8;">Question Status Palette (Green: Answered | Orange: Flagged)</div>
            <div id="matrix-grid" class="matrix-grid"></div>
        </div>
    </div>
    <div class="exam-container"
`;

if (html.includes(targetHeader)) {
    html = html.replace(targetHeader, newHeaderAddon);
} else {
    // Fallback replacement if formatting differs slightly
    html = html.replace('<div class="exam-container"', newHeaderAddon);
}

// 3. Inject Matrix & Analytics Scripts
const scriptBlock = `
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
html = html.replace('</body>', scriptBlock + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("Buttons and Matrix Palette patched successfully!");
