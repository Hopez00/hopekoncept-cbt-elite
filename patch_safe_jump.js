const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Insert a clean, compact quick-jump bar right inside the quiz view container safely
const target = '<div class="question-text" id="q-text">';
const safeBar = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px; background: #f8fafc; padding: 8px 12px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <span style="font-weight: 600; font-size: 12px; color: #475569;">⚡ Jump to Q#:</span>
                <input type="number" id="quick-jump-input" min="1" max="180" placeholder="No." style="width: 55px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: center; font-weight: bold; font-size: 12px;">
                <button type="button" class="btn" style="padding: 4px 10px; font-size: 11px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer;" onclick="executeQuickJump()">Go</button>
            </div>
            <div class="question-text" id="q-text">`;

html = html.replace(target, safeBar);

// Add the quick jump handler function if not present
if (!html.includes('function executeQuickJump')) {
    const scriptTarget = 'function loadQuestion() {';
    const funcCode = `
        function executeQuickJump() {
            let input = document.getElementById('quick-jump-input');
            let qNum = parseInt(input.value);
            if (!isNaN(qNum) && qNum >= 1 && qNum <= activeQuestions.length) {
                currentQIdx = qNum - 1;
                loadQuestion();
                input.value = '';
            } else {
                alert("Please enter a valid question number between 1 and " + activeQuestions.length);
            }
        }
        function loadQuestion() {
    `;
    html = html.replace(scriptTarget, funcCode);
}

fs.writeFileSync('public/exam.html', html);
console.log("Safe reset and clean quick jump applied!");
