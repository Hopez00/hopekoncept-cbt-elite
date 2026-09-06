const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Insert quick jump bar right below the question meta row in quiz-view
const targetRow = `<div class="exam-top-row">
                <div class="question-meta" id="q-meta">Subject: English | Question 1</div>
                <button type="button" class="flag-btn" id="flag-btn" onclick="toggleFlag()">🚩 Flag Question</button>
            </div>`;

const enhancedRow = `${targetRow}
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px; background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 13px;">
                <span style="font-weight: bold; color: #475569;">⚡ Quick Jump:</span>
                <input type="number" id="quick-jump-input" min="1" max="\${activeQuestions.length}" placeholder="Q#" style="width: 60px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: center; font-weight: bold;">
                <button type="button" class="btn" style="padding: 4px 10px; font-size: 12px;" onclick="executeQuickJump()">Go</button>
                <span style="color: #64748b; font-size: 11px; margin-left: auto;">(Type # & hit Go)</span>
            </div>`;

html = html.replace(targetRow, enhancedRow);

// Add executeQuickJump function in script section
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

html = html.replace('function loadQuestion() {', jumpFuncCode);

fs.writeFileSync('public/exam.html', html);
console.log("Quick jump bar successfully added!");
