'use strict';
// avoiding global variables here.
(function () {
  var createBillButton = document.getElementById('createBillButton');
  var sendBillButton = document.getElementById('sendBillButton');
  var amountInput = document.getElementById('amountInput');
  var amountLabel = document.getElementById('amountSpan');
  var qrString = '';

  /**
   * data.qrString - str
   * data.amount - int
   * @param {*} data 
   */
  function sendQR(data) {
    try {
      var socket = io();
      socket.emit('toTank', JSON.stringify(data));
      socket.on('fromTank', function (data) {
        socket.disconnect(true);
      });
    } catch (error) {
      console.log(error);
    }
  }

  createBillButton.addEventListener('click', async function (event) {
    try {
      var amount = parseFloat(amountInput.value.trim()).toFixed(2);
      // implement creating bill here
      createBillButton.setAttribute('disabled', '');
      createBillButton.innerText = 'Fiş Oluşturuluyor..';
      var response = await fetch('/api/get-payment-qr', {
        'method': 'POST',
        'headers': {
          'Content-type': 'application/json'
        },
        'body': JSON.stringify({ 'amount': amount })
      });
      createBillButton.innerText = 'Fiş Oluşturuldu';
      var rt = await response.text();
      console.log(`my api response: ${rt}`);
      qrString = JSON.parse(rt).QRdata;
      amountLabel.innerText = ` ${amount} `;
      sendBillButton.removeAttribute('disabled');
    } catch (error) {
      console.log(error);
    }
    createBillButton.removeAttribute('disabled');
    createBillButton.innerText = 'Fiş Oluştur';
  });

  sendBillButton.addEventListener('click', function (event) {
    var amount = amountLabel.innerText.trim();
    console.log(`${amount} TL. Bill is on the way!`);
    sendBillButton.setAttribute('disabled', '');
    // sendAmount(amount);
    sendQR({
      'qrString': qrString,
      'amount': parseInt(amount)
    });
    amountInput.value = '';
    amountLabel.innerText = ' - ';
  });
})();