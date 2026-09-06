const fs = require('fs');

let signupHTML = fs.readFileSync('public/signup.html', 'utf8');

// Update the subtitle text to explicitly mention JAMB & WAEC CBT
signupHTML = signupHTML.replace(
    'Official Institutional Examination Gateway',
    'Official JAMB & WAEC CBT Examination Gateway'
);

// Also update the card header or add a pill badge if desired
signupHTML = signupHTML.replace(
    '<div class="brand-title">Hopekoncept CBT Elite</div>',
    '<div class="brand-title">Hopekoncept CBT Elite</div>\n            <div style="font-size: 10px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 3px 8px; border-radius: 12px; display: inline-block; margin-top: 4px; font-weight: 600;">JAMB • WAEC • POST-UTME</div>'
);

fs.writeFileSync('public/signup.html', signupHTML);
console.log("signup.html updated with JAMB & WAEC branding!");
