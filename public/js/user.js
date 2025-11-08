var baseUrl = "http://localhost:5000/"

var username = `${localStorage.getItem("user")}`;
var user = document.getElementById("user");
user.textContent = `Logged in as ${username}`;

const userPageButton = document.getElementById("userPageButton");
const loginPageButton = document.getElementById("loginPageButton");
const registerPageButton = document.getElementById("registerPageButton");
const settingsPageButton = document.getElementById("settingsPageButton");
const renderLeftChartAsImageButton = document.getElementById("renderLeftChartAsImageButton");
const renderRightChartAsImageButton = document.getElementById("renderRightChartAsImageButton");
const alternateChartsButton = document.getElementById("alternateChartsButton");
const spendingsInfoDiv = document.getElementById("spendingsInfoDiv");

let spendingsThisMonth;
let datesOfSpendingsThisMonth;
let vendorsOfSpendingsThisMonth;
let categoriesToSpendingsMap;
let categoriesToNegativeSpendingsMap;
let categoriesThisMonth;
let matchedSpendingsThisMonth;
let categoriesNegativeThisMonth;
let matchedNegativeSpendingsThisMonth;
let leftChart = document.getElementById('leftChart');
let rightChart = document.getElementById('rightChart');
let leftChartInstance;
let rightChartInstance;
async function getTransactions(renderGraph = false, renderDoughnut = false, renderBar = false, renderRadar = false) {
	spendingsThisMonth = [];
	datesOfSpendingsThisMonth = [];
	vendorsOfSpendingsThisMonth = [];
	categoriesToSpendingsMap = {};
	categoriesToNegativeSpendingsMap = {};
	categoriesThisMonth = [];
	matchedSpendingsThisMonth = [];
	categoriesNegativeThisMonth = [];
	matchedNegativeSpendingsThisMonth = [];

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
		const vendor_name = `${responseData.data[x].vendor_name}`;
		const category = `${responseData.data[x].category}`;

		const created_at_date = created_at.substring(0, created_at.indexOf('T'));
		const created_at_time = created_at.substring(created_at.indexOf('T') + 1, created_at.indexOf(".000Z"));

		const updated_at_date = updated_at.substring(0, updated_at.indexOf('T'));
		const updated_at_time = updated_at.substring(updated_at.indexOf('T') + 1, updated_at.indexOf(".000Z"));

		categoriesToSpendingsMap[`${category}`] = (categoriesToSpendingsMap[`${category}`] || 0) + parseFloat(amount);
		if(parseFloat(amount) < 0)
		{
			categoriesToNegativeSpendingsMap[`${category}`] = (categoriesToSpendingsMap[`${category}`] || 0) + parseFloat(amount);
		}

		const spentDate = new Date(created_at_date);
		if(spentDate.getFullYear() === today.getFullYear() && spentDate.getMonth === today.getMonth) {
			spendingsThisMonth.push(amount);
			datesOfSpendingsThisMonth.push(created_at_date);
			vendorsOfSpendingsThisMonth.push(vendor_name);
		}

		let amountColor = 'red';
		if(parseFloat(amount) >= 0) {
			amountColor = 'rgb(50, 237, 100);';
		}

		innerHTMLStringBuffer += `<p id="transactionItem_${x}" class="transactionItem">`;
		innerHTMLStringBuffer += 	`<span class="transactionItemRow">`;
		innerHTMLStringBuffer += 		`<span><b>${vendor_name}</b></span>`;
		innerHTMLStringBuffer += 		`<span>`;
		innerHTMLStringBuffer += 			`<span style="color: ${amountColor};">${amount}</span>`;
		innerHTMLStringBuffer += 			`<span style="color: rgba(50, 50, 50, 100);"> [${created_at_date}, ${created_at_time}]</span>`;
		innerHTMLStringBuffer += 		`</span>`;
		innerHTMLStringBuffer += 	`</span>`;
		innerHTMLStringBuffer += 	`<span class="transactionItemRow" id="transactionItemHiddenText_${x}" style="display: none;">`;
		innerHTMLStringBuffer += 		`<span style="font-weight: bold;">${category}</span>`;
		innerHTMLStringBuffer += 		`<span style="font-size: 13px;">${street_name}, ${city}, ${state_name}, ${postal_code}, ${country_name}</span>`;
		innerHTMLStringBuffer += 	`</span>`;
		innerHTMLStringBuffer += `</p>`;
	}

	spendingsInfoDiv.innerHTML = innerHTMLStringBuffer;

	for(const key in categoriesToSpendingsMap) {
		categoriesThisMonth.push(key);
		matchedSpendingsThisMonth.push(String(categoriesToSpendingsMap[key]));
	}

	for(const key in categoriesToNegativeSpendingsMap) {
		categoriesNegativeThisMonth.push(key);
		matchedNegativeSpendingsThisMonth.push(String(categoriesToNegativeSpendingsMap[key]));
	}

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

	const dashboardContentDiv = document.getElementById('dashboardContent');
	let chartImageWidth = dashboardContentDiv.clientWidth * 0.586;
	let chartImageHeight = dashboardContentDiv.clientHeight * 0.9;

	if(leftChartInstance)
	{
		leftChartInstance.destroy();
	}
	if(rightChartInstance)
	{
		rightChartInstance.destroy();
	}

	if(renderGraph)
	{
		leftChartInstance = new Chart(leftChart, {
			type: 'line',
			data: {
				labels: datesOfSpendingsThisMonth,
				datasets: [{
					label: 'Spendings This Month',
					data: spendingsThisMonth,
					fill: false,
					borderColor: 'rgb(75, 192, 192)',
					tension: 0.1
				}]
			},
			options: {
				layout: {
					padding: {
						top: 30
					}
				},
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					datalabels: {
						display: true,
						align: 'top',
						formatter: function(value) {
							return value;
						},
						color: 'rgba(100, 100, 100, 50)',
						font: {
							weight: 'bold'
						}
					},
					legend: {
						position: 'bottom'
					}
					/*
					title: {
						display: true,
						position: 'bottom',
						text: `${username}'s Spendings Overview`
					}
					*/
				},
				scales: {
					x: {
						ticks: {
							padding: 0
						}
					},
					y: {
						beginAtZero: false,
						ticks: {
							stepSize: 10,
						}
					}
				}
			}
		});
	}

	if(renderDoughnut)
	{
		let vendorsToSpendingsMap = {};
		for(let x = 0; x < vendorsOfSpendingsThisMonth.length; x++) {
			if(parseFloat(spendingsThisMonth[x]) >= 0) {
				continue;
			}
			vendorsToSpendingsMap[`${vendorsOfSpendingsThisMonth[x]}`] = (vendorsToSpendingsMap[`${vendorsOfSpendingsThisMonth[x]}`] || 0.0) + parseFloat(spendingsThisMonth[x]);
		}
		let vendorsOfSpendingsThisMonthCopy = [];
		let spendingsThisMonthCopy = [];
		for(const key in vendorsToSpendingsMap) {
			vendorsOfSpendingsThisMonthCopy.push(key + '\n' + vendorsToSpendingsMap[key].toFixed(2));
			spendingsThisMonthCopy.push(String(vendorsToSpendingsMap[key]));
		}

		rightChartInstance = new Chart(rightChart, {
			type: 'doughnut',
			data: {
				labels: vendorsOfSpendingsThisMonthCopy,
				datasets: [{
					label: 'Spendings This Month',
					data: spendingsThisMonthCopy
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						display: true,
						position: 'bottom'
					}
					/*
					title: {
						display: true,
						position: 'bottom',
						text: `${username}'s Spendings Overview`
					}
					*/
				},
			}
		});
	}

	if(renderBar)
	{
		leftChartInstance = new Chart(leftChart, {
			type: 'bar',
			data: {
				labels: categoriesThisMonth,
				datasets:  [{
					label: 'Spending This Month',
					data: matchedSpendingsThisMonth
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true
					}
				}
			},
		});
	}

	if(renderRadar)
	{
		rightChartInstance = new Chart(rightChart, {
			type: 'radar',
			data: {
				labels: categoriesNegativeThisMonth,
				datasets:  [{
					label: 'Spending This Month',
					data: matchedNegativeSpendingsThisMonth
				}]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					y: {
						beginAtZero: true
					}
				}
			},
		});
	}
}

getTransactions(true, true, false, false);

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

let leftChartIsGraph = true;
renderLeftChartAsImageButton.addEventListener('click', async function() {
	const chartImageWidth=1920;
	const chartImageHeight=1080;

	if(leftChartIsGraph)
	{
		// render chart
		let chartImageSrc = `/graph?width=${chartImageWidth}&height=${chartImageHeight}`;
		chartImageSrc += `&datesOfSpendingsThisMonth=${encodeURIComponent(JSON.stringify(datesOfSpendingsThisMonth))}`;
		chartImageSrc += `&spendingsThisMonth=${encodeURIComponent(JSON.stringify(spendingsThisMonth))}`;
		chartImageSrc += `&username=${username}`;
		chartImageSrc += `&timestamp=${new Date().getTime()}`;
		window.open(`${chartImageSrc}`);
	} else
	{
		// render bar
		let chartImageSrc = `/bar?width=${chartImageWidth}&height=${chartImageHeight}`;
		chartImageSrc += `&categoriesThisMonth=${encodeURIComponent(JSON.stringify(categoriesThisMonth))}`;
		chartImageSrc += `&matchedSpendingsThisMonth=${encodeURIComponent(JSON.stringify(matchedSpendingsThisMonth))}`;
		chartImageSrc += `&username=${username}`;
		chartImageSrc += `&timestamp=${new Date().getTime()}`;
		window.open(`${chartImageSrc}`);
	}
});

let rightChartIsDoughnut = true;
renderRightChartAsImageButton.addEventListener('click', async function() {
	const chartImageWidth=1920;
	const chartImageHeight=1080;

	if(rightChartIsDoughnut)
	{
		// render doughnut
		let vendorsToSpendingsMap = {};
		for(let x = 0; x < vendorsOfSpendingsThisMonth.length; x++) {
			if(parseFloat(spendingsThisMonth[x]) >= 0) {
				continue;
			}
			vendorsToSpendingsMap[`${vendorsOfSpendingsThisMonth[x]}`] = (vendorsToSpendingsMap[`${vendorsOfSpendingsThisMonth[x]}`] || 0.0) + parseFloat(spendingsThisMonth[x]);
		}
		vendorsOfSpendingsThisMonthCopy = [];
		spendingsThisMonthCopy = [];
		for(const key in vendorsToSpendingsMap) {
			vendorsOfSpendingsThisMonthCopy.push(key + '\n' + vendorsToSpendingsMap[key].toFixed(2));
			spendingsThisMonthCopy.push(String(vendorsToSpendingsMap[key]));
		}

		let doughnutImageSrc = `/doughnut?width=${chartImageWidth}&height=${chartImageHeight}`;
		doughnutImageSrc += `&vendorsOfSpendingsThisMonth=${encodeURIComponent(JSON.stringify(vendorsOfSpendingsThisMonthCopy))}`;
		doughnutImageSrc += `&spendingsThisMonth=${encodeURIComponent(JSON.stringify(spendingsThisMonthCopy))}`;
		doughnutImageSrc += `&username=${username}`;
		doughnutImageSrc += `&timestamp=${new Date().getTime()}`;
		window.open(`${doughnutImageSrc}`);
	} else
	{
		//render radar
		let chartImageSrc = `/radar?width=${chartImageWidth}&height=${chartImageHeight}`;
		chartImageSrc += `&categoriesNegativeThisMonth=${encodeURIComponent(JSON.stringify(categoriesNegativeThisMonth))}`;
		chartImageSrc += `&matchedNegativeSpendingsThisMonth=${encodeURIComponent(JSON.stringify(matchedNegativeSpendingsThisMonth))}`;
		chartImageSrc += `&username=${username}`;
		chartImageSrc += `&timestamp=${new Date().getTime()}`;
		window.open(`${chartImageSrc}`);
	}
});

let alternateView = false;
alternateChartsButton.addEventListener('click', async function() {
	alternateView = !alternateView;
	if(alternateView)
	{
		leftChartIsGraph = false;
		rightChartIsDoughnut = false;
		renderLeftChartAsImageButton.innerText = 'Download Bar';
		renderRightChartAsImageButton.innerText = 'Download Radar';
		getTransactions(false, false, true, true);
	} else
	{
		leftChartIsGraph = true;
		rightChartIsDoughnut = true;
		renderLeftChartAsImageButton.innerText = 'Download Graph';
		renderRightChartAsImageButton.innerText = 'Download Doughnut';
		getTransactions(true, true, false, false);
	}
});
