const express = require('express');
const pool = require('./db');
const path = require('path');
const app = express();
const port = 5000;
app.use(express.json())

// Serve everything inside "public" as static assets
app.use(express.static(path.join(__dirname, 'public')));


// Redirecting landing page to login.html
app.get('/', async (req, res) => {
    console.log("Sending to Registration");
    return res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.post('/login', async (req, res) => {
    console.log("Received POST Request (login)");

    const { username, password } = req.body;

    try {
        //Check that the username exists
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if(rows.length == 0) {
            return res.status(400).json({success: false, error: 'Username Does Not Exist'});
        }

        if(rows[0].password == password) {
            return res.status(200).json({success: true, message: `Logged in as ${username}`});
        }

    } catch(err) {
        return res.status(500).json({error: 'Database Connection Failed'});
    }

	return res.status(400).json({success: false, error: 'Invalid Credentials'});

    // res.sendFile(path.join(__dirname, 'public', 'login.html'));
    // if (email === 'email@gmail.com' && password === 'password123') {
    //     res.json({ success: true, email });
    // } else {
    //     res.status(401).json({success: false, message: 'Invalid credentials' });
    // }

	return res.status(400).json({sucess: false, error: 'INCORRECT username OR password!'});
});

app.post('/register', async (req, res) => {
    console.log("Received POST Request (register)");

    const { firstName, lastName, username, email, password } = req.body;

    try {
        //Check that the username is available
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if(rows.length != 0) {
            return res.status(400).json({success: false, error: 'Username Already Exists'});
        }

        //Create the record in the DB
        const [result] = await pool.query('INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ? ,?)',
            [firstName, lastName, username, email, password]);

        return res.status(200).json({success: true, message: 'User Sucessfully Created'});
    } catch(err) {
        return res.status(500).json({error: 'Database Connection Failed'});
    }
});

app.post('/transactions', async (req, res) => {
    console.log("Received POST Request (transactions)");

	const { username } = req.body;

    try {
        //Check that the user's user_id exists in transactions db
        const [rows] = await pool.query('SELECT amount, city, country_name, transactions.created_at, postal_code, state_name, street_name, transaction_id, transactions.updated_at, vendor_name, category FROM transactions JOIN vendors ON transactions.vendor_id = vendors.vendor_id WHERE user_id = (SELECT id FROM users WHERE username = ?)', [username]);
        if(rows.length === 0) {
            return res.status(400).json({success: false, error: 'User Has No Existing Transactions!'});
        }

        return res.status(200).json({success: true, message: 'User Transactions Successfully Fetched!', data: rows});
    } catch(err) {
        return res.status(500).json({error: 'Database Connection Failed'});
    }
});

app.get('/chart', async (req, res) => {
	console.log("Received GET Request (chart)");
	console.log("rendering chart...");

	const today = new Date();
	const daysInCurrentMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
	const monthShort = today.toLocaleString('en-US', { month: 'short' });
	let daysInCurrentMonthAsStrings = [];
	for(let x = 0; x < daysInCurrentMonth; x++) {
		daysInCurrentMonthAsStrings.push(`${monthShort} ${x + 1}`)
	}

	const width = parseInt(req.query.width) || 800;
	const height = parseInt(req.query.height) || 600;
	const datesOfSpendingsThisMonth = JSON.parse(req.query.datesOfSpendingsThisMonth);
	const spendingsThisMonth = JSON.parse(req.query.spendingsThisMonth);
	const username = req.query.username;

	const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
	const ChartDataLabels = require('chartjs-plugin-datalabels');
	const { Chart, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } = require('chart.js');

	Chart.register(
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend,
		ChartDataLabels
	);

	let chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
	try {
		const configuration = {
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
				responsive: false,
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
					},
					title: {
						display: true,
						position: 'bottom',
						text: `${username}'s Spendings Overview`
					}
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
		};

		const image = await chartJSNodeCanvas.renderToBuffer(configuration);
		console.log("done rendering chart!");

		res.set('Content-Type', 'image/png');
		res.send(image);
	} catch(err) {
		console.error(err);
		res.status(500).send('Error generating chart');
	}
});

app.get('/doughnut', async (req, res) => {
	console.log("Received GET Request (doughnut)");
	console.log("rendering dougnut...");

	const width = parseInt(req.query.width) || 800;
	const height = parseInt(req.query.height) || 600;
	const vendorsOfSpendingsThisMonth = JSON.parse(req.query.vendorsOfSpendingsThisMonth);
	const spendingsThisMonth = JSON.parse(req.query.spendingsThisMonth);
	const username = req.query.username;

	const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
	const { Chart, DoughnutController, ArcElement, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend } = require('chart.js');

	Chart.register(
		DoughnutController,
		ArcElement,
		LineController,
		LineElement,
		PointElement,
		CategoryScale,
		LinearScale,
		Tooltip,
		Legend,
	);

	let chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
	try {
		const configuration = {
			type: 'doughnut',
			data: {
				labels: vendorsOfSpendingsThisMonth,
				datasets: [{
					label: 'Spendings This Month',
					data: spendingsThisMonth,
				}]
			},
			options: {
				plugins: {
					legend: {
						display: true,
						position: 'bottom'
					},
					title: {
						display: true,
						position: 'bottom',
						text: `${username}'s Spendings Overview`
					}
				},
			}
		};

		const image = await chartJSNodeCanvas.renderToBuffer(configuration);
		console.log("done rendering doughnut!");

		res.set('Content-Type', 'image/png');
		res.send(image);
	} catch(err) {
		console.error(err);
		res.status(500).send('Error generating doughnut');
	}
});

app.post('/changeUsername', async (req, res) => {
    console.log("Received POST Request (changeUsername)");

	const { newUsername, oldUsername } = req.body;

    try {
        //Check that the new username is available
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [newUsername]);
        if(rows.length === 0) {
			try {
				const [result] = await pool.query('UPDATE users SET username = ? WHERE username = ?', [newUsername, oldUsername]);
				if(result.length === 0) {
					return res.status(400).json({success: false, error: 'Something Went Wrong!'});
				}
			} catch(err) {
				return res.status(500).json({error: 'Database Connection Failed'});
			}
            return res.status(200).json({success: true, message: 'New Username Successfully Registered!'});
        }
        return res.status(400).json({success: false, error: 'New Username Is Not Available!'});
    } catch(err) {
        return res.status(500).json({error: 'Database Connection Failed'});
    }
});

app.post('/changeName', async (req, res) => {
    console.log("Received POST Request (changeName)");

	const { username, newFirstName, newLastName } = req.body;

    try {
        //Check that the user exists first
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if(rows.length === 0) {
			return res.status(400).json({success: false, error: 'User Does Not Exist!'});
        }

		try {
			const [result] = await pool.query('UPDATE users SET first_name = ?, last_name = ? WHERE username = ?', [newFirstName, newLastName, username]);
			if(result.length === 0) {
				return res.status(400).json({success: false, error: 'Something Went Wrong!'});
			}
		} catch(err) {
			return res.status(500).json({error: 'Database Connection Failed'});
		}
		return res.status(200).json({success: true, message: 'New Full Name Successfully Registered!'});
    } catch(err) {
        return res.status(500).json({error: 'Database Connection Failed'});
    }
});

app.get('/fullName', async (req, res) => {
	console.log("Received GET Request (fullName)");

	const { username } = req.query;
	try {
        const [rows] = await pool.query('SELECT first_name, last_name FROM users WHERE username = ?', [username]);
        if(rows.length === 0) {
			return res.status(400).json({success: false, error: 'User Does Not Exist!'});
        }

		res.set('Content-Type', 'text/plain');
		res.send(`${rows[0].first_name}\n${rows[0].last_name}`);
	} catch(err) {
		res.status(500).send('Error fetching fullName!');
	}
});


app.listen(port, '::', async () => {
    console.log(`✅ Server running at http://localhost:${port}`);

    //Test DB Connectivity
    try{
        const result = await pool.query('SHOW tables');
        console.log("Connected to Database!");
    } catch(err){
        console.error("Database Error", err);
        //res.status(500).json({error: 'Database Connection Failed'});
    }
});
