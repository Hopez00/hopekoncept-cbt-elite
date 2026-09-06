const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// 1. Remove the old quick jump div if it exists to avoid duplication
html = html.replace(/<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px;[^>]*>[\s\S]*?<\/div>/g, '');

// 2. Locate the question meta row or question text and insert our pro-toolbar right above the question box
const targetMarker = '<div class="question-text" id="q-text">';
const proToolbarHtml = `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #1e293b; padding: 10px 16px; border-radius: 8px; margin-bottom: 15px; border: 1px solid #334155; flex-wrap: wrap; gap: 10px;">
                <div class="question-meta" id="q-meta" style="margin: 0; color: #38bdf8; font-weight: 600;">Subject: English | Question 1</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 600; font-size: 12px; color: #94a3b8;">Jump to Q#:</span>
                    <input type="number" id="quick-jump-input" min="1" max="180" placeholder="No." style="width: 55px; padding: 5px; background: #0f172a; color: #f8fafc; border: 1px solid #475569; border-radius: 4px; text-align: center; font-weight: bold; font-size: 13px;">
                    <button type="button" class="btn" style="padding: 5px 12px; font-size: 12px; background: #0284c7; margin: 0;" onclick="executeQuickJump()">Go</button>
                </div>
            </div>
            <div class="question-text" id="q-text">`;

if (html.includes(targetMarker)) {
    html = html.replace(targetMarker, proToolbarHtml);
}

fs.writeFileSync('public/exam.html', html);
console.log("Pro toolbar forced and applied!");
