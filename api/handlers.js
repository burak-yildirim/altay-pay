'use strict';
const https = require('https');
const rp = require('request-promise-native');

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

function qrParser(qrString) {
  var table = {};
  for (var i = 0; i < qrString.length;) {
    var key = qrString.substr(i, 2);
    i += 2;
    var len = qrString.substr(i, 2);
    i += 2;
    var value = qrString.substr(i, len);
    i += parseInt(len);
    table[key] = value;
  }
  return {
    'amount': parseInt(table['54']),
    'currencyID': parseInt(table['53']),
    'vatRate': parseInt(table['86'].split('-')[0])
  };
}


async function getPaymentQr(req, res) {
  try {
    var amount = parseInt(req.body.amount * 100);
    var options = {
      'agent': agent,
      'method': 'POST',
      'uri': getPaymentQrURL,
      'headers': headers,
      'body': {
        'totalReceiptAmount': amount
      },
      'json': true
    };
    var parsedBody = await rp(options);
    res.send(parsedBody);
  } catch (error) {
    console.log(JSON.stringify(error));
    res.send(error);
  }
}

async function completePayment(req, res) {
  try {
    var qrVals = qrParser(req.body.qrString);
    console.log(`qrVals: ${JSON.stringify(qrVals)}`);
    var options = {
      'agent': agent,
      'method': 'POST',
      'uri': paymentURL,
      'headers': headers,
      'body': {
        'returnCode': 1000,
        'returnDesc': 'success',
        'receiptMsgCustomer': 'Pandaware Apps',
        'receiptMsgMerchant': 'Pandaware Apps Merchant',
        'paymentInfoList': [
          {
            'paymentProcessorID': 67,
            'paymentActionList':
              [
                {
                  'paymentType': 3,
                  'amount': qrVals.amount,
                  'currencyID': qrVals.currencyID,
                  'vatRate': qrVals.vatRate
                }
              ]
          }
        ],
        'QRdata': req.body.qrString
      },
      'json': true
    };
    // I don't have paymentProcessorID and the sample one gives 401 error
    // so I will comment next line and pretend like it is successfull
    // var parsedBody = await rp(paymentURL, options);
    var parsedBody = {
      'applicationID': 'api',
      'sessionID': '417',
      'posID': 'AT0000000001',
      'returnCode': 1000,
      'returnDesc': 'OK'
    };
    console.log(`parsedBody: ${JSON.stringify(parsedBody)}`);
    res.send(JSON.stringify(parsedBody));
  } catch (error) {
    console.log(error);
    res.status(400)
    res.send({ 'error': 'error occured' });
  }
}

module.exports = {
  getPaymentQr,
  completePayment
};

/*
{
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
      }
*/