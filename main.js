'use-strict';
const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise-native');
const https = require('https');
const path = require('path');

const app = express();
const port = 3000;
const views = path.join(__dirname, 'views');
const headers = {
  'accept': 'application/json',
  'content-type': 'application/json',
  'x-ibm-client-id': 'd56a0277-2ee3-4ae5-97c8-467abeda984d',
  'x-ibm-client-secret': 'bF1rB2nC1jY2tM4dL2bU1yO8sB1kX7cP3nK3pU0bV3gH1cN3uT'
};
const agent = https.Agent({
  'url': 'sandbox-api.payoys.com',
  'port': '443',
  'path': '/',
  'rejectUnauthorized': false
});
const getPaymentQrURL = 'https://sandbox-api.payosy.com/api/get_qr_sale';
const paymentURL = 'https://sandbox-api.payosy.com/api/payment';

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function (req, res) {
  res.sendFile(path.join(views, 'index.html'));
});

app.get('/pos', function (req, res) {
  res.sendFile(path.join(views, 'pos.html'));
});

// app.get('/payment/:amount', function (req, res) {
//   res.send({ amount: req.params.amount });
// });

// app.post('/mirror', function (req, res) {
//   var response = {
//     'status': 'ok',
//     'body': req.body
//   };
//   res.send(response);
// });

app.post('/get-payment-qr', async function (req, res) {
  try {
    var options = {
      'agent': agent,
      'method': 'POST',
      'uri': getPaymentQrURL,
      'headers': headers,
      'body': {
        'totalReceiptAmount': req.body.price
      },
      'json': true
    };
    var parsedBody = await rp(options);
    res.send(parsedBody);
  } catch (error) {
    console.log(JSON.stringify(error));
    res.send(error);
  }
});

app.post('/payment', async function (req, res) {
  try {
    var options = {
      'agent': agent,
      'method': 'POST',
      'uri': paymentURL,
      'headers': headers,
      'body': {
        'returnCode': 1000,
        'returnDesc': 'success',
        'receiptMsgCustomer': 'beko Campaign',
        'receiptMsgMerchant': 'beko Campaign Merchant',
        'paymentInfoList': [
          {
            'paymentProcessorID': 67,
            'paymentActionList':
              [
                {
                  'paymentType': 3,
                  'amount': 100,
                  'currencyID': 949,
                  'vatRate': 800
                }
              ]
          }
        ],
        'QRdata': '00020153039495403500800201810200821926-12-2017 ' +
          '18:54:558305312-58608800-500#8712EC0000000001890118402648844' +
          'secureqrsigniturewillbehereinthenearfuture1='
      },
      'json': true
    };
    var parsedBody = await rp(paymentURL);
    res.send(parsedBody);
  } catch (error) {
    console.log(JSON.stringify(error));
    res.send(error);
  }
});

app.listen(port, () => console.log(`Server is up, listening on port ${port}!`));
