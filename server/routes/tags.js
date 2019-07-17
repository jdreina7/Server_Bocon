
const express = require('express')
const _ = require('underscore')
var auth = require('../middlewares/auth');

const Tag = require('../models/tag_model')
const app = express()

// ================================
// OBTENER TODOS LAS ETIQUETAS
// ================================
app.get('/', function (req, res) {

    let from = req.query.desde || 0;
    let to = req.query.hasta || 5;
    
    from = Number(from);
    to = Number(to);

    Tag.find({})
        .skip(from)
        .limit(to)
        .exec( (err, tags) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            // El count recibve 2 argumentos, el primero DEB SER LA MISMA CONDICION DEL FIND, el segundo es el callback
            Tag.countDocuments( (err, conteo) => {
                res.json({
                    ok: true,
                    tags,
                    total: conteo
                });
            })

        })
})

// ================================
// CREAR UNA ETIQUETAS
// ================================
app.post('/tag', auth.verifyToken, function (req, res) {
    let body = req.body;
    
    let myTag = new Tag({
        tag_name: body.tag_name,
    });

    myTag.save( (err, tagDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            etiqueta: tagDB,
            usrLogin: req.userLogged
        });

    });

})


// ================================
// ACTUALIZAR UNA ETIQUETAS
// ================================
app.put('/tag/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, 
        ['tag_name'] );

	Tag.findByIdAndUpdate( id, body, {new: true, runValidators: true}, (err, tagDB2) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            etiqueta: tagDB2,
            usrLogin: req.userLogged
        });
    })
})


// ================================
// ELIMINAR/INACTIVAR UNA ETIQUETAS
// ================================
app.delete('/tag/:id', auth.verifyToken, function (req, res) {
    let id = req.params.id;
    
    // Borrado fisico
    Tag.findByIdAndRemove( id, (err, tagDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if(!tagDeleted) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no existe en la BD'
                }
            })
        }

        res.json({
            ok: true,
            etiqueta: tagDeleted
        });
    })

})

module.exports = app;