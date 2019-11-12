'use-strict';
const express = require('express');
const path = require('path');
const handlers = require('./api/handlers.js'); //require(`${__dirname}/api/handlers.js`);

const app = express();
const server = require('https').createServer(app);
// building socket server
require('./utils/socket.js')(server);
const port = 3000;
const views = path.join(__dirname, 'views');

app.use(require('body-parser').json());
app.use(express.static(path.join(__dirname, 'static')));

// Tank panel
app.get('/', function (req, res) {
  res.sendFile(path.join(views, 'index.html'));
});

// Pos machine panel
app.get('/pos', function (req, res) {
  res.sendFile(path.join(views, 'pos.html'));
});

app.post('/get-payment-qr', handlers.getPaymentQr);

app.post('/payment', handlers.completePayment);

// app.listen(port, () => console.log(`Server is up, listening on port ${port}!`));



server.listen(port);
