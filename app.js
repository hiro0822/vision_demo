"use strict";

const express = require('express')
const bodyParser = require('body-parser')
// corsポリシーに抵触するため、その対策としてcorsを利用する
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())

app.use(express.static(__dirname + "/dist/"));

app.get(/.*/, function (req, res) {
  res.sendfile(__dirname + "/dist/index.html");
});

app.listen(process.env.PORT || 3000)
