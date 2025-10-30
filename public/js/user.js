var baseUrl = "http://localhost:5000/"

var username = `${localStorage.getItem("user")}`;
var user = document.getElementById("user");
user.textContent = `Logged in as ${username}`;

var spendingsInfoParagraph = document.getElementById("spendingsInfoParagraph");

async function getTransactions() {
	const params = {
		'username': username
	}

	const response = await fetch(baseUrl + "transactions", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params)
	});

	const responseData = await response.json();
	spendingsInforParagraph.innterHTML = ""
	for(let x = 0; x < responseData.data.length; x++) {
		spendingsInforParagraph.innterHTML += `${responseData.data[x]} \n<br>\n<br>`
		//console.log(responseData.data[x]);
	}
}

getTransactions();
