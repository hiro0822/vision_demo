"use strict";

const express = require('express')
const bodyParser = require('body-parser')
// corsポリシーに抵触するため、その対策としてcorsを利用する
const cors = require('cors')

const vision = require('./src/api/vision')
const app = express()

app.use(bodyParser.urlencoded({ extended: true, limit: '100mb', parameterLimit: 50000 }))
app.use(bodyParser.json({ extended: true, limit: '100mb'}));
app.use(cors())

app.use(express.static(__dirname + "/dist/"));
app.use(vision)

app.get(/.*/, function (req, res) {
  res.sendfile(__dirname + "/dist/index.html");
});

app.listen(process.env.PORT || 3000)

module.exports = app
