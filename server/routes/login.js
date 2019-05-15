const express = require('express')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const _ = require('underscore')

const SEED_TOKEN = require('../config/seed').SEED;
const jwt = require('jsonwebtoken');

const app = express()

app.post('/', (req, res) => {

    let body = req.body;

    User.findOne({ usr_email: body.email }, (err, userBD ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: "Error en la BD al loguear el usuario!",
                errors: err
            });
        }

        if ( !userBD ) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - email",
                errors: err
            });
        }

        if ( !bcrypt.compareSync(body.password, userBD.usr_password ) ) {
            return res.status(400).json({
                ok: false,
                message: "Credenciales incorrectas - password",
                errors: err
            });
        }

        // Crear token
        var token = jwt.sign({ user: userBD }, SEED_TOKEN, { expiresIn: 14400 }); // 4 horas


        res.status(200).json({
            ok: true,
            mensaje: 'Login post correcto!',
            user: userBD,
            id: userBD._id,
            token: token
        });

    });

})




module.exports = app;