let userPageButton = document.getElementById("userPageButton");
let loginPageButton = document.getElementById("loginPageButton");
let registerPageButton = document.getElementById("registerPageButton");
let settingsPageButton = document.getElementById("settingsPageButton");
let changeUsernameButton = document.getElementById("changeUsernameButton");

userPageButton.addEventListener('click', function() {
	window.location.href = '/user.html';
});

loginPageButton.addEventListener('click', function() {
	if(confirm("Are You Sure You Want To Go Back To The Login Page?"))
	{
		window.location.href = '/login.html';
	}
	loginPageButton.classList.remove('button-active');
});

registerPageButton.addEventListener('click', function() {
	if(confirm("Are You Sure You Want To Go Back To The Register Page?"))
	{
		window.location.href = '/register.html';
	}
	registerPageButton.classList.remove('button-active');
});

settingsPageButton.addEventListener('click', function() {
	window.location.href = '/settings.html';
});

changeUsernameButton.addEventListener('click', function() {
});


var username = `${localStorage.getItem("user")}`;
var user = document.getElementById("user");
user.textContent = `Logged in as ${username}`;
