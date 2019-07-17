require('./config/config');
var cors = require('cors');
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

// CORS
app.use( function( req, res, next ) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", true);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
	next();
});

app.use(cors());



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// Importar rutas
var appRoutes = require('./routes/app');
var appLogin = require('./routes/login');
var appUsers = require('./routes/users');
var appInputs = require('./routes/input');
var appCategories = require('./routes/categories');
var appTags = require('./routes/tags');
var appApply = require('./routes/applications');
var appSearch = require('./routes/search');
var appUploads = require('./routes/upload');
var appimages = require('./routes/images');

// Routes
app.use( '/login', appLogin );
app.use( '/users', appUsers );
app.use( '/inputs', appInputs );
app.use( '/categories', appCategories );
app.use( '/tags', appTags );
app.use( '/applications', appApply );
app.use( '/search', appSearch );
app.use( '/uploads', appUploads );
app.use( '/images', appimages );

app.use('/', appRoutes );


mongoose.connect(ENV_DB,{ useNewUrlParser: true, useCreateIndex: true }, (err, res) => {

	if (err) throw err;

	console.log("DB Online!");
});

app.listen(ENV_PORT, () => {
	console.log(`Server runing in ${ENV_PORT} port`);
});