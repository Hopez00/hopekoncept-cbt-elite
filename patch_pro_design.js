const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Inject professional styling enhancements into the head style block
const targetStyleTag = '</style>';
const professionalStyles = `
        /* Professional Human-Designed Polish */
        body { background: #090d16; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; }
        .exam-wrapper { border-radius: 10px; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0,0,0,0.6); }
        .exam-header { background: #0f172a; border-bottom: 3px solid #38bdf8; padding: 14px 20px; }
        .timer-badge { font-variant-numeric: tabular-nums; letter-spacing: 0.5px; }
        
        /* Polished Quick Jump & Controls */
        .pro-toolbar { display: flex; align-items: center; justify-content: space-between; background: #1e293b; padding: 10px 16px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #334155; flex-wrap: wrap; gap: 10px; }
        body.dark-mode .pro-toolbar { background: #1e293b; border-color: #334155; }
        
        /* Option Card Ergonomics */
        .options-container label { transition: all 0.2s ease-in-out; border-radius: 8px; }
        .options-container label:hover { border-color: #38bdf8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(56, 189, 248, 0.1); }
        
        /* Custom Scrollbar for Professional Feel */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0f172a; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
    </style>`;

html = html.replace('</style>', professionalStyles);

// Wrap quick-jump and header meta into the professional toolbar container
const oldJumpSection = `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 15px; background: #f1f5f9; padding: 8px 12px; border-radius: 6px; font-size: 13px;">
                <span style="font-weight: bold; color: #475569;">⚡ Quick Jump:</span>
                <input type="number" id="quick-jump-input" min="1" max="180" placeholder="Q#" style="width: 60px; padding: 4px; border: 1px solid #cbd5e1; border-radius: 4px; text-align: center; font-weight: bold;">
                <button type="button" class="btn" style="padding: 4px 10px; font-size: 12px;" onclick="executeQuickJump()">Go</button>
                <span style="color: #64748b; font-size: 11px; margin-left: auto;">(Type # & hit Go)</span>
            </div>`;

const proToolbarHtml = `<div class="pro-toolbar">
                <div class="question-meta" id="q-meta" style="margin: 0; color: #38bdf8;">Subject: English | Question 1</div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="font-weight: 600; font-size: 12px; color: #94a3b8;">Jump to Q#:</span>
                    <input type="number" id="quick-jump-input" min="1" max="180" placeholder="No." style="width: 55px; padding: 5px; background: #0f172a; color: #f8fafc; border: 1px solid #475569; border-radius: 4px; text-align: center; font-weight: bold; font-size: 13px;">
                    <button type="button" class="btn" style="padding: 5px 12px; font-size: 12px; background: #0284c7;" onclick="executeQuickJump()">Go</button>
                </div>
            </div>`;

if (html.includes(oldJumpSection)) {
    html = html.replace(oldJumpSection, proToolbarHtml);
}

fs.writeFileSync('public/exam.html', html);
console.log("Professional design polish successfully applied!");
