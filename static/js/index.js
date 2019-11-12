'use strict';
// avoiding global variables here.
(function () {
  // status of recieving the bill mechanism
  var billReceiverStatus = 'inactive'; // active - inactive
  var readBillButton = document.getElementById('readBillButton');
  var amountSpan = document.getElementById('amountSpan');
  var payButton = document.getElementById('payButton');
  var socket;
  var qrString;

  function initSocket() {
    try {
      // io lib is loaded on the html
      socket = io();
      socket.on('fromPos', function (data) {
        console.log(`tank recieved data: ${data}`)
        var dataObj = JSON.parse(data);
        qrString = dataObj.qrString;
        amountSpan.innerText = `${dataObj.amount}`;
        socket.emit('toPos', 'canDisconnect');
        readBillButton.click();
      });
      // this means tank finished reading bill and
      // sending disconnect message, so it can
      // also disconnect now.
      socket.on('fromTank', function (data) {
        payButton.removeAttribute('disabled');
        socket.disconnect(true);
      });
    } catch (error) {
      console.log(error);
    }
  }

  readBillButton.addEventListener('click', function (event) {
    switch (billReceiverStatus) {
      case 'inactive':
        readBillButton.innerText = "(Fiş okunuyor..) İptal Et";
        billReceiverStatus = 'active';
        initSocket();
        break;
      case 'active':
        readBillButton.innerText = "Ödeme fişini oku";
        billReceiverStatus = 'inactive';
        break;
      default:
        break;
    }
  });

  payButton.addEventListener('click', async function (event) {
    var canPay = true;
    try {
      payButton.setAttribute('disabled', '');
      payButton.innerText = 'Ödeme Yapılıyor..';
      console.log(`qrString to send: ${qrString}`);
      var paymentResponseRaw = await fetch('/api/payment', {
        'method': 'POST',
        'headers': {
          'Content-type': 'application/json'
        },
        'body': JSON.stringify({ 'qrString': qrString })
      });
      var paymentResponse = await paymentResponseRaw.json();
      console.log(`paymentResponse: ${JSON.stringify(paymentResponse)}`);
      var message = paymentResponse.returnCode === 1000 ? 'Ödeme başarıyla tamamlandı' : 'Ödemede hata!';
      window.alert(message);
      console.log('payment completed');
      canPay = false;
    } catch (error) {
      console.log(error);
    }
    payButton.innerText = 'Öde';
    if (!canPay) payButton.setAttribute('disabled', '');
  });
})();

