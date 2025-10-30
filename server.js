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
