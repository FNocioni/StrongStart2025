const express = require('express');
const path = require('path');
const app = express();
const port = 5000;
app.use(express.json())

// Serve everything inside "public" as static assets
app.use(express.static(path.join(__dirname, 'public')));

// Redirecting landing page to login.html
app.get('/', (req, res) => {
    console.log("Sending to login");
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// 
app.post('/login', (req, res) => {
    console.log("Received request...");
    console.log(req.body);

    const { firstName, lastName, email, password } = req.body;
    console.log("Fetching data for " + email);


    res.sendFile(path.join(__dirname, 'public', 'login.html')); 
    if (email === 'email@gmail.com' && password === 'password123') {
    res.json({ success: true, email });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    } 
});


app.listen(port, '::', () => {
    console.log(`✅ Server running at http://localhost:${port}`);
});