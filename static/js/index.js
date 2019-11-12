'use strict';
// avoiding global variables here.
(function () {
  // status of recieving the bill mechanism
  var billReceiverStatus = 'inactive'; // active - inactive
  var readBillButton = document.getElementById('readBillButton');
  readBillButton.addEventListener('click', function (event) {
    switch (billReceiverStatus) {
      case 'inactive':
        readBillButton.innerText = "(Fiş okunuyor..) İptal Et";
        billReceiverStatus = 'active';
        break;
      case 'active':
        readBillButton.innerText = "Ödeme fişini oku";
        billReceiverStatus = 'inactive';
        break;
      default:
        break;
    }
    console.log(billReceiverStatus);
  });
})();

