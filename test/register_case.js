var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

var baseUrl = "http://localhost:5000/"

// Responsive UI functions
function validatePassword(password){
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

module.exports = {
    validatePassword
}