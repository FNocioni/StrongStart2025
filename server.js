const express = require('express');
const pool = require('./db');
const path = require('path');
const argon2 = require('argon2');
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

    try{
        //Check that the username exists
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if(rows.length == 0){
            return res.status(400).json({success: false, error: 'Username Does Not Exist'});
        }

        if(rows[0].password == password){
            return res.status(200).json({success: true, message: `Logged in as ${username}`});
        }

    } catch(err){
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

    try{
        //Check that the username is available
        const [rows] = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        if(rows.length != 0){
            return res.status(400).json({success: false, error: 'Username Already Exists'});
        }

        //Create the record in the DB
        const [result] = await pool.query('INSERT INTO users (first_name, last_name, username, email, password) VALUES (?, ?, ?, ? ,?)',
            [firstName, lastName, username, email, password]);

        return res.status(200).json({success: true, message: 'User Sucessfully Created'});
    } catch(err){
        return res.status(500).json({error: 'Database Connection Failed'});
    }
});

app.post('/transactions', async (req, res) => {
    console.log("Received POST Request (transactions)");

	const { username } = req.body;

    try{
        //Check that the username is available
        const [rows] = await pool.query('SELECT * FROM transactions WHERE username = ?', [username]);
        if(rows.length === 0){
            return res.status(400).json({success: false, error: 'User Has No Existing Transactions!'});
        }

        return res.status(200).json({success: true, message: 'User Transactions Successfully Fetched!', data: rows});
    } catch(err){
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
				//labels: daysInCurrentMonthAsStrings,
				labels: datesOfSpendingsThisMonth,
				datasets: [{
					label: 'Spendings This Month',
					//data: [65, 59, 80, 81, 56, 55, 40],
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
