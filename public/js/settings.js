var baseUrl = "http://localhost:5000/"

var username = `${localStorage.getItem("user")}`;
const user = document.getElementById("user");
user.textContent = `Logged in as ${username}`;

let firstName = "";
let lastName = "";
async function fetchFullName() {
	fetch(`/fullName?username=${username}`).then(response => {
		if (!response.ok) {
		  throw new Error(`HTTP error! Status: ${response.status}`);
		}
		return response.text();
	}).then(data => { 
		firstName = data.substring(0, data.indexOf('\n'));
		lastName = data.substring(data.indexOf('\n') + 1, data.length);
		localStorage.setItem("firstName", firstName);
		localStorage.setItem("lastName", lastName);
	}).catch(error => console.error('Request failed', error));
}
fetchFullName();

let userPageButton = document.getElementById("userPageButton");
let loginPageButton = document.getElementById("loginPageButton");
let registerPageButton = document.getElementById("registerPageButton");
let settingsPageButton = document.getElementById("settingsPageButton");
let changeUsernameButton = document.getElementById("changeUsernameButton");
let changeNameButton = document.getElementById("changeNameButton");

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


/*
MySQL [strongstart2025]> DESC users;
+------------+--------------+------+-----+-------------------+-------------------+
| Field      | Type         | Null | Key | Default           | Extra             |
+------------+--------------+------+-----+-------------------+-------------------+
| id         | int          | NO   | PRI | NULL              | auto_increment    |
| first_name | varchar(50)  | NO   |     | NULL              |                   |
| last_name  | varchar(50)  | NO   |     | NULL              |                   |
| username   | varchar(50)  | NO   | UNI | NULL              |                   |
| email      | varchar(100) | NO   | UNI | NULL              |                   |
| password   | varchar(255) | NO   |     | NULL              |                   |
| created_at | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+------------+--------------+------+-----+-------------------+-------------------+
7 rows in set (0.026 sec)
*/

changeUsernameButton.addEventListener('click', async function() {
	let newUsername = prompt("Enter New Desired Username:", username);
	if(newUsername == null || newUsername === username) {
		console.log('change username aborted!');
		return;
	} else if(newUsername.length > 50) {
		alert("username is too long! 50 character limit!");
		return;
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

changeNameButton.addEventListener('click', async function() {
	let newFirstName = prompt("Enter New Desired FirstName:", firstName);
	if(newFirstName == null) {
		console.log('change FirstName aborted!');
		return;
	} else if(newFirstName.length > 50) {
		alert("FirstName is too long! 50 character limit!");
		return;
	}

	let newLastName = prompt("Enter New Desired LastName:", lastName);
	if(newLastName == null) {
		console.log('change LastName aborted!');
		return;
	} else if(newLastName.length > 50) {
		alert("LastName is too long! 50 character limit!");
		return;
	}

	const params = {
		"username": username,
		"newFirstName": newFirstName,
		"newLastName": newLastName
	}

	const response = await fetch(baseUrl + "changeName", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params)
	});

	const responseData = await response.json();
	if(responseData.message) {
		alert(responseData.message);
		localStorage.setItem("firstName", newFirstName);
		firstName = `${localStorage.getItem("firstName")}`;
		
		localStorage.setItem("lastName", newLastName);
		lastName = `${localStorage.getItem("lastName")}`;
	}
});
