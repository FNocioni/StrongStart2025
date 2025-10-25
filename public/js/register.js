var registerForm = document.getElementById("register_form");

var firstName = document.getElementById("first_name");
var lastName = document.getElementById("last_name");
var username = document.getElementById("username");
var email = document.getElementById("email");
var password = document.getElementById("password");
var submitButton = document.getElementById("submit_button");

var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

var baseUrl = "http://localhost:5000/"

registerForm.addEventListener('input', function() {
    validatePassword();
    validateEmail();
    validateUsername();
    submitButton.disabled = isSubmitDisabled();
});

// Check if username & password combination exists
async function register (){ 
    const params = {
        'firstName': firstName.value,
        'lastName': lastName.value,
        'username': username.value,
        'email': email.value,
        'password': password.value
    }
    
    const response = await fetch(baseUrl + "register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params)
    });

    const responseData = await response.json();

    if(!response.ok){        
        if(responseData.error == "Username Already Exists"){
            username.classList = ["invalid"]
        }
        throw new Error("Response not OK");        
    }else{
        alert(responseData.message);
        window.location.href = '/login.html';
    }
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

function validateUsername(){
    if(!username.value){
        username.classList = [];
        return false;
    }
    username.classList = ["valid"];

    return true;
}

function isSubmitDisabled(){
    return (!firstName.value || !lastName.value || !validateEmail() || !validatePassword() || !validateUsername());
}