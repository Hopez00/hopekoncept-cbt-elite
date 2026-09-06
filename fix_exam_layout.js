const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Restore a clean, standard, professional exam-top-row and quick jump layout
const cleanLayout = `
            <div class="exam-top-row" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; background: #f8fafc; padding: 12px 15px; border-radius: 6px; border: 1px solid #e2e8f0;">
                <div class="question-meta" id="q-meta" style="font-weight: 600; color: #1e293b; font-size: 14px; margin: 0;">Subject: English | Question 1</div>
                <button type="button" class="flag-btn" id="flag-btn" onclick="toggleFlag()" style="background: #f59e0b; color: white; border: none; padding: 6px 12px; border-radius: 4px; font-weight: 600; cursor: pointer; font-size: 12px;">🚩 Flag Question</button>
            </div>

            <!-- Sleek Quick Jump Bar -->
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 20px; background: #e0f2fe; padding: 10px 15px; border-radius: 6px; border: 1px solid #bae6fd;">
                <span style="font-weight: 600; color: #0369a1; font-size: 13px;">⚡ Quick Jump:</span>
                <input type="number" id="quick-jump-input" min="1" max="180" placeholder="Q#" style="width: 70px; padding: 6px; border: 1px solid #7dd3fc; border-radius: 4px; text-align: center; font-weight: bold; background: white; color: #0f172a;">
                <button type="button" class="btn" style="padding: 6px 14px; font-size: 13px; background: #0284c7; color: white; border: none; border-radius: 4px; font-weight: 650; cursor: pointer;" onclick="executeQuickJump()">Go to Question</button>
            </div>

            <div class="question-text" id="q-text">
`;

// Replace from the start of exam-top-row up to the question-text div
if (html.includes('exam-top-row') && html.includes('<div class="question-text" id="q-text">')) {
    let startIndex = html.indexOf('<div class="exam-top-row"');
    let endIndex = html.indexOf('<div class="question-text" id="q-text">');
    let sliceToReplace = html.substring(startIndex, endIndex);
    html = html.replace(sliceToReplace, cleanLayout);
}

fs.writeFileSync('public/exam.html', html);
console.log("Exam layout successfully reset and cleaned!");
