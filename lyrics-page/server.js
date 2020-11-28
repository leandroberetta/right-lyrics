const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/health', (req, res) => {
    return res.send({status: "UP"});
});

app.listen(8080);