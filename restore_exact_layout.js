const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Let's find the original clean top row block and neatly integrate the Quick Jump input right into it
const originalTopRow = `<div class="exam-top-row">`;
const enhancedTopRow = `<div class="exam-top-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">`;

html = html.replace(originalTopRow, enhancedTopRow);

// 2. Insert the quick jump controls right inside the top bar next to the question meta / flag button
const targetMeta = '</div>'; // closing tag of question-meta or flag button area
// Let's target the exact structure where exam-top-row closes or contains items
const topRowContent = document => {
    // Safely inject quick jump input into the top bar
};

// Clean approach: Replace the top row entirely with the exact styled version matching your reference screenshot plus the clean input field
const exactTarget = /<div class="exam-top-row">[\s\S]*?<\/div>/;

const pristineDesign = `
<div class="exam-top-row" style="background: #1e293b; padding: 10px 16px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-bottom: 15px; border: 1px solid #334155;">
    <div class="question-meta" id="q-meta" style="color: #38bdf8; font-weight: 600; font-size: 13px; margin: 0;">SUBJECT: USE OF ENGLISH | QUESTION 1 OF 180</div>
    <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 11px; color: #94a3b8; font-weight: 600;">Quick Jump Q#:</span>
        <input type="number" id="quick-jump-input" min="1" max="180" placeholder="No." style="width: 50px; padding: 3px 6px; background: #0f172a; color: #fff; border: 1px solid #475569; border-radius: 4px; text-align: center; font-weight: bold; font-size: 12px;">
        <button type="button" class="btn" style="padding: 3px 10px; font-size: 11px; background: #0284c7; color: white; border: none; border-radius: 4px; cursor: pointer; margin: 0; font-weight: 600;" onclick="executeQuickJump()">Go</button>
    </div>
    <button type="button" class="flag-btn" id="flag-btn" onclick="toggleFlag()" style="background: #d97706; color: white; border: none; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: 600; cursor: pointer;">🚩 Flag Question</button>
</div>
`;

if (exactTarget.test(html)) {
    html = html.replace(exactTarget, pristineDesign);
}

// Ensure executeQuickJump function exists
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
console.log("Exact layout restored and enhanced cleanly!");
