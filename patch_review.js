const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Insert the Review Modal HTML before closing </body>
const reviewModalHtml = `
    <!-- Pre-Submission Review Modal -->
    <div id="review-modal" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 25px; border-radius: 12px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); z-index: 3000; width: 90%; max-width: 550px; border: 2px solid #2563eb;">
        <h3 style="color: #1e293b; margin-bottom: 8px;">Exam Pre-Submission Review</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 15px;">Please review your status below before final submission:</p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; text-align: center;">
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px;">
                <div style="font-size: 11px; color: #64748b; font-weight: bold;">ANSWERED</div>
                <div id="rev-answered-count" style="font-size: 20px; font-weight: bold; color: #16a34a; margin-top: 4px;">0</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px;">
                <div style="font-size: 11px; color: #64748b; font-weight: bold;">UNANSWERED</div>
                <div id="rev-unanswered-count" style="font-size: 20px; font-weight: bold; color: #dc2626; margin-top: 4px;">0</div>
            </div>
            <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; border-radius: 8px;">
                <div style="font-size: 11px; color: #64748b; font-weight: bold;">FLAGGED</div>
                <div id="rev-flagged-count" style="font-size: 20px; font-weight: bold; color: #f59e0b; margin-top: 4px;">0</div>
            </div>
        </div>

        <div style="margin-bottom: 20px;">
            <p style="font-size: 13px; font-weight: bold; color: #1e293b; margin-bottom: 5px;">Flagged Questions Jump List:</p>
            <div id="rev-flagged-list" style="max-height: 120px; overflow-y: auto; background: #f1f5f9; padding: 8px; border-radius: 6px; font-size: 13px; color: #334155;">None</div>
        </div>

        <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" class="btn" style="background: #64748b;" onclick="closeReviewModal()">Resume Exam</button>
            <button type="button" class="btn btn-submit" onclick="confirmFinalSubmit()">Confirm & Submit Exam</button>
        </div>
    </div>
</body>`;

html = html.replace('</body>', reviewModalHtml);

// Hook submitExam to show review modal first instead of direct submission
html = html.replace('function submitExam() {', `
function triggerSubmitCheck() {
    let answered = Object.keys(userAnswers).length;
    let unanswered = activeQuestions.length - answered;
    let flaggedKeys = Object.keys(flaggedQuestions);

    document.getElementById('rev-answered-count').innerText = answered;
    document.getElementById('rev-unanswered-count').innerText = unanswered;
    document.getElementById('rev-flagged-count').innerText = flaggedKeys.length;

    let flagListDiv = document.getElementById('rev-flagged-list');
    if (flaggedKeys.length > 0) {
        flagListDiv.innerHTML = flaggedKeys.map(k => \`<a href="#" onclick="jumpToFlagged(\${k})" style="display: inline-block; margin: 2px 6px; color: #2563eb; font-weight: bold;">Q\${parseInt(k)+1}</a>\`).join(' | ');
    } else {
        flagListDiv.innerText = "No questions flagged.";
    }

    document.getElementById('review-modal').style.display = 'block';
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
}

function jumpToFlagged(idx) {
    closeReviewModal();
    jumpToQuestion(parseInt(idx));
}

function confirmFinalSubmit() {
    closeReviewModal();
    submitExam();
}

function submitExam() {
`);

// Replace last step button trigger for submission
html = html.replace("submitExam();", "triggerSubmitCheck();");

fs.writeFileSync('public/exam.html', html);
console.log("Review summary module successfully patched!");
