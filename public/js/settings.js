var baseUrl = "http://localhost:5000/"

var username = `${localStorage.getItem("user")}`;
const user = document.getElementById("user");
user.textContent = `Logged in as ${username}`;

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

changeUsernameButton.addEventListener('click', async function() {
	let newUsername = prompt("Enter New Desired Username:", username);
	if(newUsername !== null) {
	} else {
		console.log('change username aborted!');
	}


	const params = {
		'newUsername': newUsername,
		'oldUsername': username,
	}

	const response = await fetch(baseUrl + "changeUsername", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params)
	});

	const responseData = await response.json();
	if(responseData.message) {
		alert(responseData.message);
		localStorage.setItem("user", newUsername);
		username = `${localStorage.getItem("user")}`;
		user.textContent = `Logged in as ${username}`;
	}
});
