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


async function getPaymentQr(req, res) {
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
}

async function completePayment(req, res) {
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
}

module.exports = {
  getPaymentQr,
  completePayment
};