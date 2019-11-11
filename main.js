'use-strict';
const express = require('express');
const app = express();
const port = 3000;

app.get('/', function (req, res) {
  res.render('/index.html', function (err, html) {
    console.log(err);
  });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));