
const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')

const app = express()

app.get('/', function (req, res) {
	res.json('Hello World')
})



app.get('/usuario', function (req, res) {
	res.json('get Usuario')
})



app.post('/usuario', function (req, res) {
    let body = req.body;
    
    let myUser = new User({
        usr_name: body.name,
        usr_last_name: body.last_name,
        usr_email: body.email,
        usr_birthday: body.birthday,
        usr_password: bcrypt.hashSync(body.password, 10),
        usr_img: body.img,
        usr_role: body.role,
        usr_city: body.city,
        usr_address: body.address,
        usr_phone: body.phone,
        usr_celphone: body.celphone,
        usr_last_activity: body.last_activity,
        usr_state: body.state,
        usr_google: body.google
    });

    myUser.save( (err, usrDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usrDB
        });

    });

})



app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    let body = req.body;

	User.findByIdAndUpdate( id, body, {new: true}, ( err, usrDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usrDB
        });
    })
})



app.delete('/usuario', function (req, res) {
	res.json('delete Usuario')
})

module.exports = app;