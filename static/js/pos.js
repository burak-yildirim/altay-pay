'use strict';
// avoiding global variables here.
(function () {
  var createBillButton = document.getElementById('createBillButton');
  var sendBillButton = document.getElementById('sendBillButton');
  var amountInput = document.getElementById('amountInput');
  var amountLabel = document.getElementById('amountSpan');

  createBillButton.addEventListener('click', function (event) {
    var amount = parseInt(amountInput.value);
    // implement creating bill here
    amountLabel.innerText = ` ${amount} `;
    sendBillButton.removeAttribute('disabled');
  });

  sendBillButton.addEventListener('click', function (event) {
    console.log(`${amountLabel.innerText} TL. Bill is on the way!`);
    sendBillButton.setAttribute('disabled', '');
  });
})();