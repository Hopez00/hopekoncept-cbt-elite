const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Replace the footer navigation to include a permanent Submit button
const oldFooter = `<div class="footer-nav">
                <button type="button" class="btn" id="prev-btn" onclick="changeQuestion(-1)" style="background: #64748b;">Previous</button>
                <button type="button" class="btn" id="next-btn" onclick="changeQuestion(1)">Next Question</button>
            </div>`;

const newFooter = `<div class="footer-nav">
                <button type="button" class="btn" id="prev-btn" onclick="changeQuestion(-1)" style="background: #64748b;">Previous</button>
                <button type="button" class="btn btn-submit" onclick="triggerSubmitCheck()" style="background: #dc2626;">Submit Exam</button>
                <button type="button" class="btn" id="next-btn" onclick="changeQuestion(1)">Next Question</button>
            </div>`;

html = html.replace(oldFooter, newFooter);
fs.writeFileSync('public/exam.html', html);
console.log("Permanent submit button added!");
