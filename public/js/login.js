var loginForm = document.getElementById("login_form");

var username = document.getElementById("username");
var password = document.getElementById("password");
var submitButton = document.getElementById("submit_button");

var baseUrl = "http://localhost:5000/"

loginForm.addEventListener('input', function() {
    submitButton.disabled = isSubmitDisabled();
});

// Check if username & password combination exists
async function login (){ 
    const params = {
        'username': username.value,        
        'password': password.value
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
    }else{
        alert(responseData.message);
        localStorage.setItem("user", username.value);
        window.location.href = '/user.html';
    }
}



function isSubmitDisabled(){
    return (!username.value || !password.value);
}
