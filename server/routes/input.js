
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');
const Input = require('../models/input_model')

const app = express()

// ================================
// OBTENER TODOS LOS INSUMOS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);

    Input.find({ input_state: true } )
        .skip(from)
        .limit(to)
        .exec( (err, inputs) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Input.countDocuments({ input_state: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    inputs,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UN INSUMO
// ================================
app.post('/input', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myInput = new Input({
        input_name: body.input_name,
        input_type: body.input_type,
        input_description: body.input_description,
        input_price: body.input_price,
        input_price_sale: body.input_price_sale,
        input_unit: body.input_unit,
        input_featured_img: body.input_featured_img,
        input_p_weight: body.input_p_weight,
        input_p_large: body.input_p_large,
        input_p_width: body.input_p_width,
        input_p_color: body.input_p_color,
        input_s_start_date: body.input_s_start_date,
        input_s_end_date: body.input_s_end_date,
        input_s_start_time: body.input_s_start_time,
        input_s_end_time: body.input_s_end_time,
        input_category: body.input_category,
        input_tags: body.input_tags,
        input_others: body.input_others,
        input_created_by: body.input_created_by,
        input_state: body.input_state,
    });

    myInput.save( (err, inputDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            inputDB: inputDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UN INSUMO
// ================================
app.put('/input/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['input_name', 'input_type', 'input_description', 'input_price', 'input_price_sale', 'input_unit', 'input_featured_img', 'input_p_weight', 'input_p_large', 'input_p_width', 'input_p_color', 'input_s_start_date', 'input_s_end_date', 'input_s_start_time', 'input_s_end_time', 'input_category', 'input_tags', 'input_others', 'input_created_by', 'input_state'] );

	Input.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, inputDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            inputDB: inputDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UN INSUMO
// ================================
app.delete('/input/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    // Input.findByIdAndRemove( id, (err, userDeleted) => {
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
    //         inputDB: userDeleted
    //     });
    // })


    // Actualizar el estado: BORRADO LOGICO
    let delete2 = {
        input_state: false
    };
	Input.findByIdAndUpdate( id, {input_state: false}, {new: true}, (err, inputDBDeleted2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!inputDBDeleted2) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Insumo no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            inputDB: inputDBDeleted2,
            usrLogin: req.userLogged
        });
    })

})

module.exports = app;