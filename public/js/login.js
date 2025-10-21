var loginForm = document.getElementById("login_form");

var firstName = document.getElementById("first_name");
var lastName = document.getElementById("last_name");
var email = document.getElementById("email");
var password = document.getElementById("password");
var submitButton = document.getElementById("submit_button");

var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

var baseUrl = "http://localhost:5000/"

loginForm.addEventListener('input', function() {
    validatePassword();
    validateEmail();
    submitButton.disabled = isSubmitDisabled();
});

// Check if username & password combination exists
async function login (){
    
    const params = {
        'firstName': firstName.value,
        'lastName': lastName.value,
        'email': email.value,
        'password': password.value
    }
    

    const response = await fetch(baseUrl + "login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    });

    if(!response.ok){
        alert("Incorrect Credentials");
        throw new Error("Response not OK");        
    }

    const responseData = await response.json();

    alert(`Logged in as ${responseData.email}`);
}

// Responsive UI functions

function validatePassword(){
    if(!password.value){
        password.classList = [];
        return false;
    }else{
        if(password.value.length < 8){
            password.classList = ["invalid"];
            return false;
        }
    }

    password.classList = ["valid"];
    return true;
}

function validateEmail(){
    if(!email.value){
        email.classList = [];
        return false;
    }

    if (!email.value.match(mailformat)){
        email.classList = ["invalid"];
        return false;
    }
    
    email.classList = ["valid"];
    return true;
}

function isSubmitDisabled(){
    return (!firstName.value || !lastName.value || !validateEmail() || !validatePassword());
}
