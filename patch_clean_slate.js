const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Find where the question box starts and replace everything above it inside the card with a single clean professional bar
const targetStart = '<div class="exam-top-row"';
const targetEnd = '<div class="question-text" id="q-text">';

// Let's create a pristine single block replacement
const cleanCardHeader = `
            <div style="background: #1e293b; padding: 14px 18px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #334155; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #334155; padding-bottom: 8px;">
                    <div class="question-meta" id="q-meta" style="margin: 0; color: #38bdf8; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Subject: English | Q1</div>
                    <span style="font-size: 11px; color: #64748b; font-weight: 500;">CBT Pro Engine</span>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <button type="button" class="flag-btn" id="flag-btn" onclick="toggleFlag()" style="background: #d97706; color: white; border: none; padding: 6px 12px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 4px;">🚩 Flag Question</button>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <span style="font-weight: 600; font-size: 12px; color: #94a3b8;">Quick Jump:</span>
                        <input type="number" id="quick-jump-input" min="1" max="180" placeholder="Q#" style="width: 55px; padding: 5px 8px; background: #0f172a; color: #f8fafc; border: 1px solid #475569; border-radius: 6px; text-align: center; font-weight: bold; font-size: 13px;">
                        <button type="button" class="btn" style="padding: 5px 12px; font-size: 12px; background: #0284c7; border-radius: 6px; margin: 0; font-weight: 600;" onclick="executeQuickJump()">Go</button>
                    </div>
                </div>
            </div>
            <div class="question-text" id="q-text">`;

// If we can find the section between exam-top-row and question-text, replace it entirely
if (html.includes('exam-top-row') && html.includes(targetEnd)) {
    let startIndex = html.indexOf('<div class="exam-top-row"');
    let endIndex = html.indexOf(targetEnd);
    let sliceToReplace = html.substring(startIndex, endIndex);
    html = html.replace(sliceToReplace, cleanCardHeader);
}

fs.writeFileSync('public/exam.html', html);
console.log("Clean slate professional header applied!");
