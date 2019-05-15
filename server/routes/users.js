
const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const User = require('../models/user')

var auth = require('../middlewares/auth');
//const SEED_TOKEN = require('../config/seed').SEED;
const jwt = require('jsonwebtoken');

const app = express()

// ================================
// OBTENER TODOS LOS USUARIOS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    User.find({ usr_state: true }, 'usr_name usr_last_name usr_email usr_img usr_city usr_last_activity')
        .skip(from)
        .limit(to)
        .exec( (err, users) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            User.count({ usr_state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    users,
                    total: conteo
                });
            })

        })
})

// ================================
// VERIFICAR EL TOKEN
// ================================



// ================================
// CREAR UN USUARIO
// ================================
app.post('/user', auth.verifyToken, function (req, res) {
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
            usuario: usrDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UN USUARIO
// ================================
app.put('/user/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['usr_name', 'usr_last_name', 'usr_email', 'usr_birthday', 'usr_img', 'usr_role','usr_city','usr_address','usr_phone','usr_celphone','usr_last_activity','usr_state'] );

	User.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, usrDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usrDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UN USUARIO
// ================================
app.delete('/user/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // User.findByIdAndRemove( id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }

    //     if(!userDeleted) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no existe en la BD'
    //             }
    //         })
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: userDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO
    let delete2 = {
        usr_state: false
    };
	User.findByIdAndUpdate( id, {usr_state: false}, {new: true}, (err, userDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!userDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            usuario: userDeleted2,
            usrLogin: req.userLogged
        });
    })

})

module.exports = app;