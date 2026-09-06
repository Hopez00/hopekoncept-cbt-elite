const fs = require('fs');

// 1. Revert to stable v9 backup baseline
if (fs.existsSync('cbt_backup_exam_v9.html')) {
    fs.copyFileSync('cbt_backup_exam_v9.html', 'public/exam.html');
}

let html = fs.readFileSync('public/exam.html', 'utf8');

// 2. Add Monetization Banner & Viral Sharing Styles
const adCSS = `
    <style>
        .ad-banner-container { background: #0f172a; border: 1px dashed #334155; border-radius: 6px; padding: 8px; text-align: center; margin: 10px 0; font-size: 11px; color: #94a3b8; }
        .viral-share-btn { background: #16a34a; color: #fff; border: none; padding: 8px 14px; border-radius: 6px; font-weight: 600; cursor: pointer; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; text-decoration: none; margin-top: 8px; }
        .viral-share-btn:hover { background: #15803d; }
    </style>
`;
html = html.replace('</head>', adCSS + '</head>');

// 3. Inject Ad Banner into Examination Header and WhatsApp Viral Button into Result Slip
const adScript = `
<script>
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(injectMonetizationFeatures, 1000);
    });

    function injectMonetizationFeatures() {
        // Inject Top Ad Banner into Exam Layout
        let examContainer = document.querySelector('.exam-container, .exam-card, body');
        if (examContainer && !document.getElementById('top-ad-banner')) {
            let adDiv = document.createElement('div');
            adDiv.id = 'top-ad-banner';
            adDiv.className = 'ad-banner-container';
            // Placeholder for AdNetwork snippet (AdSense / Monetag / Native Banner)
            adDiv.innerHTML = \`
                <span>Sponsored Ad - Support Free CBT Practice</span>
                <div style="font-weight: bold; color: #38bdf8; margin-top: 2px;">[Your Ad Code / Banner Here - Earn in NGN/USD]</div>
            \`;
            examContainer.insertBefore(adDiv, examContainer.firstChild);
        }

        // Enhance Result Slip with WhatsApp Viral Share Button
        const origEnhance = window.submitExam;
        // Watch for result slip rendering to append WhatsApp share
        const observer = new MutationObserver((mutations, obs) => {
            let slipCard = document.querySelector('.result-slip-card');
            if (slipCard && !document.getElementById('whatsapp-viral-btn')) {
                let btnGroup = slipCard.querySelector('.print-btn-group');
                if (!btnGroup) {
                    btnGroup = document.createElement('div');
                    btnGroup.className = 'print-btn-group no-print';
                    slipCard.appendChild(btnGroup);
                }
                
                let waBtn = document.createElement('a');
                waBtn.id = 'whatsapp-viral-btn';
                waBtn.className = 'viral-share-btn';
                waBtn.innerHTML = '📢 Share Score on WhatsApp';
                waBtn.href = 'https://api.whatsapp.com/send?text=' + encodeURIComponent('I just scored high on the 2026 JAMB CBT Practice App built by Hopekoncept! Try it out and test your speed here: http://localhost:3000/exam.html?type=JAMB');
                waBtn.target = '_blank';
                btnGroup.appendChild(waBtn);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
</script>
`;

html = html.replace('</body>', adScript + '</body>');

fs.writeFileSync('public/exam.html', html);
console.log("v10 Monetization & Viral Sharing Patched Successfully!");
