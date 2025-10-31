var baseUrl = "http://localhost:5000/"

var username = `${localStorage.getItem("user")}`;
var user = document.getElementById("user");
user.textContent = `Logged in as ${username}`;

var spendingsInfoDiv = document.getElementById("spendingsInfoDiv");

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

	const today = new Date();
	let totalSpendingsThisMonth = 0.0;
	let innerHTMLStringBuffer = "" //buffer because otherwise, will force close '<p>' tag automatically
	spendingsInfoDiv.innerHTML = ""
	for(let x = 0; x < responseData.data.length; x++) {
		const amount = `${responseData.data[x].amount}`;
		const city = `${responseData.data[x].city}`;
		const country_name = `${responseData.data[x].country_name}`;
		const created_at = `${responseData.data[x].created_at}`;
		const postal_code = `${responseData.data[x].postal_code}`;
		const state_name = `${responseData.data[x].state_name}`;
		const street_name = `${responseData.data[x].street_name}`;
		const transaction_id = `${responseData.data[x].transaction_id}`;
		const updated_at = `${responseData.data[x].updated_at}`;
		const username = `${responseData.data[x].username}`;
		const vendor = `${responseData.data[x].vendor}`;

		const created_at_date = created_at.substring(0, created_at.indexOf('T'));
		const created_at_time = created_at.substring(created_at.indexOf('T') + 1, created_at.indexOf(".000Z"));

		const updated_at_date = updated_at.substring(0, updated_at.indexOf('T'));
		const updated_at_time = updated_at.substring(updated_at.indexOf('T') + 1, updated_at.indexOf(".000Z"));

		const spentDate = new Date(created_at_date);
		if(spentDate.getFullYear() === today.getFullYear() && spentDate.getMonth === today.getMonth) {
			totalSpendingsThisMonth += parseFloat(amount);
		}

		let amountColor = 'red';
		if(parseFloat(amount) >= 0) {
			amountColor = 'rgb(50, 237, 100);';
		}

		innerHTMLStringBuffer += `<p id="transactionItem_${x}" class="transactionItem">`;
		innerHTMLStringBuffer += 	`<span class="transactionItemRow">`;
		innerHTMLStringBuffer += 		`<span><b>${vendor}</b></span>`;
		innerHTMLStringBuffer += 		`<span>`;
		innerHTMLStringBuffer += 			`<span style="color: ${amountColor};">${amount}</span>`;
		innerHTMLStringBuffer += 			`<span style="color: rgba(50, 50, 50, 100);"> [${created_at_date}, ${created_at_time}]</span>`;
		innerHTMLStringBuffer += 		`</span>`;
		innerHTMLStringBuffer += 	`</span>`;
		innerHTMLStringBuffer += 	`<span class="transactionItemRow" id="transactionItemHiddenText_${x}" style="display: none;">`;
		innerHTMLStringBuffer += 		`<span>${street_name}, ${city}, ${state_name}, ${postal_code}, ${country_name}</span>`;
		innerHTMLStringBuffer += 	`</span>`;
		innerHTMLStringBuffer += `</p>`;
	}
	localStorage.setItem("totalSpendingsThisMonth", totalSpendingsThisMonth);
	spendingsInfoDiv.innerHTML = innerHTMLStringBuffer;

	for(let x = 0; x < responseData.data.length; x++) {
		// as of Thursday, October 30, 2025, 17:57:10
		// weird javaScript feature? Need to use 'const' or 'let' instead of 'var'? Otherwise
		// instead, remembers the initialization and doesn't "reset" the variable???
		// javaScript closure doesn't destroy the variable after it's gone out of scope???

		const transactionItem = document.getElementById(`transactionItem_${x}`);
		const transactionItemHiddenText = document.getElementById(`transactionItemHiddenText_${x}`);
		transactionItem.addEventListener('click', function() {
			if(transactionItemHiddenText.style.display === 'none') {
				transactionItemHiddenText.style.display = 'flex';
				transactionItemHiddenText.style.justifyContent = 'space-between';
			} else {
				transactionItemHiddenText.style.display = 'none';
			}
		});
	}
}

getTransactions();
