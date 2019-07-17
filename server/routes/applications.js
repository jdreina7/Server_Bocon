
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');
const Apply = require('../models/application_model')

const app = express()

// ================================
// OBTENER TODOS LAS APLICACIONES/POSTS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);

    Apply.find({ apply_state: true } )
        .skip(from)
        .limit(to)
        .populate('apply_item')
        .populate('apply_created_by')
        .exec( (err, applys) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Apply.countDocuments({ apply_state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    applys,
                    total: conteo
                });
            })

        })
})

// ================================
// OBTENER UNA APLICACION
// ================================
app.get('/application/:id', function (req, res) {

    var id = req.params.id;

    Apply.findById(id)
        .populate('apply_item')
        .populate('apply_created_by')
        .exec( (err, apply) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            if ( !apply ) {
                return res.status(400).json({
                    ok: false,
                    message: 'There is not an apply with the ID ' +id
                });
            }

            res.json({
                ok: true,
                apply
            });

        })
})

// ================================
// CREAR UNA APLICACION/POSTS
// ================================
app.post('/application', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myApply = new Apply({
        apply_code: body.apply_code,
        apply_name: body.apply_name,
        apply_amount: body.apply_amount,
        apply_total: body.apply_total,
        apply_fee: body.apply_fee,
        apply_item: body.apply_item,
        apply_prod: body.apply_prod,
        apply_serv: body.apply_serv,
        apply_date: body.apply_date,
        apply_created_by: body.apply_created_by,
        apply_admin_proccess: body.apply_admin_proccess,
        apply_client_proccess: body.apply_client_proccess,
        apply_state: body.apply_state,
    });

    myApply.save( (err, applyDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            aplicacion: applyDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UNA APLICACION/POSTS
// ================================
app.put('/application/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['apply_code', 'apply_name', 'apply_amount', 'apply_total', 'apply_fee', 'apply_item', 'apply_prod', 'apply_serv', 'apply_date', 'apply_created_by', 'apply_admin_proccess', 'apply_client_proccess', 'apply_state'] );

	Apply.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, applyDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            aplicacion: applyDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UNA APLICACION/POSTS
// ================================
app.delete('/application/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // Apply.findByIdAndRemove( id, (err, userDeleted) => {
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
    //         aplicacion: userDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO
    let delete2 = {
        apply_state: false
    };
	Apply.findByIdAndUpdate( id, {apply_state: false}, {new: true}, (err, aplicacionDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!aplicacionDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Solicitud no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            aplicacion: aplicacionDeleted2,
            usrLogin: req.userLogged
        });
    })

})

module.exports = app;