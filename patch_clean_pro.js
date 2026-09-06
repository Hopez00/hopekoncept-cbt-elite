const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Clean up duplicate or overlapping banners entirely
html = html.replace(/<div class="exam-top-row">[\s\S]*?<\/div>\s*<\/div>/g, '');
html = html.replace(/<div style="display: flex; align-items: center; justify-content: space-between;[^>]*>[\s\S]*?<\/div>\s*<\/div>/g, '');

// If the original exam-top-row was stripped, let's craft a pristine, unified pro header block
const pristineHeaderBlock = `
            <div class="exam-top-row" style="background: #1e293b; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid #334155; display: flex; flex-direction: column; gap: 10px;">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
                    <div class="question-meta" id="q-meta" style="margin: 0; color: #38bdf8; font-weight: 600; font-size: 14px;">Subject: English | Question 1</div>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="font-weight: 600; font-size: 12px; color: #94a3b8;">Quick Jump Q#:</span>
                        <input type="number" id="quick-jump-input" min="1" max="180" placeholder="No." style="width: 55px; padding: 5px; background: #0f172a; color: #f8fafc; border: 1px solid #475569; border-radius: 4px; text-align: center; font-weight: bold; font-size: 13px;">
                        <button type="button" class="btn" style="padding: 5px 12px; font-size: 12px; background: #0284c7; margin: 0;" onclick="executeQuickJump()">Go</button>
                    </div>
                </div>
                <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #334155; padding-top: 8px;">
                    <button type="button" class="flag-btn" id="flag-btn" onclick="toggleFlag()" style="background: #d97706; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 12px; font-weight: 600; cursor: pointer;">🚩 Flag Question</button>
                    <span style="font-size: 11px; color: #cbd5e1;">Professional CBT Engine v2.6</span>
                </div>
            </div>
            <div class="question-text" id="q-text">
`;

// Replace target container marker with our clean unified block
if (html.includes('<div class="question-text" id="q-text">')) {
    html = html.replace('<div class="question-text" id="q-text">', pristineHeaderBlock);
}

fs.writeFileSync('public/exam.html', html);
console.log("Clean professional layout applied successfully!");
