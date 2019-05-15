require('./config/config');

const express = require('express')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./routes/app');
var appLogin = require('./routes/login');
var appUsers = require('./routes/users');

// Routes
// app.use( require('./routes/users'));
app.use( '/users', appUsers );
app.use( '/login', appLogin );
app.use('/', appRoutes );


mongoose.connect(ENV_DB,{ useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

	if (err) throw err;

	console.log("DB Online!");
});

app.listen(ENV_PORT, () => {
	console.log(`Server runing in ${ENV_PORT} port`);
});