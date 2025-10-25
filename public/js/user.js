var baseUrl = "http://localhost:5000/"

var user = document.getElementById("user");

user.textContent = `Logged in as ${localStorage.getItem("user")}`;