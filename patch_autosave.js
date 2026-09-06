const fs = require('fs');
let html = fs.readFileSync('public/exam.html', 'utf8');

// Inject auto-save & recovery script into the client-side code
const autoSaveLogic = `
<script>
    // Save state on every option click or navigation
    const originalSelectOption = window.selectOption || function(opt) {
        userAnswers[currentQIdx] = opt;
        localStorage.setItem('cbt_user_answers', JSON.stringify(userAnswers));
        renderMatrixPalette();
    };

    // Recover state on page load if available
    window.addEventListener('DOMContentLoaded', () => {
        let savedAnswers = localStorage.getItem('cbt_user_answers');
        if (savedAnswers) {
            try {
                window.userAnswers = JSON.parse(savedAnswers);
            } catch(e) { console.error("Could not parse saved answers"); }
        }
    });
</script>
`;

html = html.replace('</body>', autoSaveLogic + '</body>');
fs.writeFileSync('public/exam.html', html);
console.log("Persistent Auto-Save patch applied!");
