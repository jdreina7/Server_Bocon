
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const Service = require('../models/service_model')
const app = express()

// ================================
// OBTENER TODOS LOS SERVICIOS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);
    
    // El finde recibe 2 argumentos, el primero es la condicion de busqueda, y el segundo, es los campos exactos que necesitamos devolver
    // Pero no es obligatorio, si deseamos realizar una busqueda general lo podemos dejar asi .find({})
    Service.find({ serv_state: true })
        .skip(from)
        .limit(to)
        .exec( (err, services) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Service.countDocuments({ serv_state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    services,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UN SERVICIO
// ================================
app.post('/service', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myService = new Service({
        serv_name: body.serv_name,
        serv_description: body.serv_description,
        serv_price: body.serv_price,
        serv_price_sale: body.serv_price_sale,
        serv_unit: body.serv_unit,
        serv_featured_img: body.serv_featured_img,
        serv_start_date: body.serv_start_date,
        serv_end_date: body.serv_end_date,
        serv_start_time: body.serv_start_time,
        serv_end_time: body.serv_end_time,
        serv_category: body.serv_category,
        serv_tags: body.serv_tags,
        serv_others: body.serv_others,
        serv_created_by: body.serv_created_by,
        serv_state: body.serv_state,
    });

    myService.save( (err, serviceDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            servicio: serviceDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UN SERVICIO
// ================================
app.put('/service/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['serv_name', 'serv_description', 'serv_price', 'serv_price_sale', 'serv_unit', 'serv_featured_img', 'serv_start_date', 'serv_end_date', 'serv_start_time', 'serv_end_time', 'serv_category', 'serv_tags:', 'serv_others'] );

	Service.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, serviceDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            servicio: serviceDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UN SERVICIO
// ================================
app.delete('/service/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // Service.findByIdAndRemove( id, (err, userDeleted) => {
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
    //         servicio: userDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO

	Service.findByIdAndUpdate( id, {serv_state: false}, {new: true}, (err, prodDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!prodDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Servicio no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            servicio: prodDeleted2,
            usrLogin: req.userLogged
        });
    })

})

module.exports = app;