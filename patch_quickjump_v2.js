const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Inject the Quick Jump HTML right above the question text box if not already there
const targetArea = '<div class="question-text" id="q-text">';
const quickJumpComponent = `
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px; background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 13px;">
                <span style="font-weight: bold; color: #475569;">⚡ Quick Jump:</span>
                <input type="number" id="quick-jump-input" min="1" max="180" placeholder="Q#" style="width: 60px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: center; font-weight: bold;">
                <button type="button" class="btn" style="padding: 4px 10px; font-size: 12px;" onclick="executeQuickJump()">Go</button>
                <span style="color: #64748b; font-size: 11px; margin-left: auto;">(Type # & hit Go)</span>
            </div>
            <div class="question-text" id="q-text">`;

if (!html.includes('quick-jump-input')) {
    html = html.replace(targetArea, quickJumpComponent);
}

// Ensure the execution function exists in the script
if (!html.includes('function executeQuickJump')) {
    const scriptTarget = 'function loadQuestion() {';
    const jumpFuncCode = `
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
    html = html.replace(scriptTarget, jumpFuncCode);
}

fs.writeFileSync('public/exam.html', html);
console.log("Quick jump bar injected successfully!");
