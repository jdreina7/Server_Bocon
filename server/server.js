require('./config/config');

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Routes
app.use( require('./routes/users'));

mongoose.connect(ENV_DB, (err, res) => {

	if (err) throw err;

	console.log("DB Online!");
});

app.listen(ENV_PORT, () => {
	console.log(`Server runing in ${ENV_PORT} port`);
});