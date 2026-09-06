const fs = require('fs');

let signupHTML = fs.readFileSync('public/signup.html', 'utf8');

// Update signup script to alert the specific error message from the backend (like duplicate email)
signupHTML = signupHTML.replace(
    `} else {
                    alert('Registration failed.');
                }`,
    `} else {
                    alert(data.message || 'Registration failed.');
                }`
);

fs.writeFileSync('public/signup.html', signupHTML);
console.log("signup.html updated with duplicate email alerts!");
