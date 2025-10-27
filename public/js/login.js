var loginForm = document.getElementById("login_form");

var username = document.getElementById("username");
var password = document.getElementById("password");
var submitButton = document.getElementById("submit_button");

var baseUrl = "http://localhost:5000/"

loginForm.addEventListener('input', function() {
    submitButton.disabled = isSubmitDisabled();
});

// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH
// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH
// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH
// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH
// hash function and abstraction
async function stableSHA256(input) {
	const data = new TextEncoder().encode(JSON.stringify(input));
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH
// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH
// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH
// DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH DO NOT CHANGE DO NOT TOUCH

// Check if username & password combination exists
async function login (){
	const hashedPassword = await stableSHA256(password.value);
    const params = {
        'username': username.value,
        'password': hashedPassword
    }

    const response = await fetch(baseUrl + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    });

    const responseData = await response.json();

    if(!response.ok){
        if(responseData.error == "Username Does Not Exist"){
            username.classList = ['invalid'];
            password.classList = ['invalid'];
        }
        throw new Error("Response not OK");
    } else {
        alert(responseData.message);
        localStorage.setItem("user", username.value);
        window.location.href = '/user.html';
    }
}



function isSubmitDisabled(){
    return (!username.value || !password.value);
}
